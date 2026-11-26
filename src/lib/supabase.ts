import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined

export const supabase = supabaseUrl && publishableKey
  ? createClient(supabaseUrl.replace(/\/$/, ''), publishableKey, {
      auth: {
        detectSessionInUrl: !['/reset-password', '/confirmar-recuperacion'].includes(window.location.pathname.replace(/\/+$/, '')),
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null

const recoveryKey = 'spidocode-auth-recovery'
const isVerifier = (key: string) => key.endsWith('-code-verifier')

export const recoveryLinkClient = supabaseUrl && publishableKey
  ? createClient(supabaseUrl.replace(/\/$/, ''), publishableKey, {
      auth: {
        flowType: 'pkce',
        storageKey: recoveryKey,
        detectSessionInUrl: false,
        autoRefreshToken: false,
        // Persist only the SDK's verifier across navigation, never a recovery session.
        storage: {
          getItem: key => isVerifier(key) ? localStorage.getItem(key) : null,
          setItem: (key, value) => { if (isVerifier(key)) localStorage.setItem(key, value) },
          removeItem: key => { if (isVerifier(key)) localStorage.removeItem(key) },
        },
      },
    })
  : null

export async function exchangeRecoveryLink() {
  if (!supabaseUrl || !publishableKey || !recoveryLinkClient) return null

  const url = new URL(window.location.href)
  const code = url.searchParams.get('code')
  const fragment = new URLSearchParams(url.hash.slice(1))
  const failed = [url.searchParams, fragment].some(params => params.has('error') || params.has('error_code'))
  const clearUrl = () => window.history.replaceState(window.history.state, '', url.pathname)
  if (!code || failed) {
    clearUrl()
    return null
  }

  // Subscribe before redeeming the code, so initialization cannot race the event.
  let recoveryToken: string | undefined
  const { data: { subscription } } = recoveryLinkClient.auth.onAuthStateChange((event, session) => {
    if (event === 'PASSWORD_RECOVERY') recoveryToken = session?.access_token
  })
  try {
    const { data, error } = await recoveryLinkClient.auth.exchangeCodeForSession(code)
    if (error || !data.session || recoveryToken !== data.session.access_token) return null

    // Bind updates to this specific account in SDK-managed, per-page memory.
    const client = createRecoveryClient()
    if (!client) return null
    try {
      const { data: bound, error: bindError } = await client.auth.setSession(data.session)
      if (!bindError && bound.user?.id === data.session.user.id) return client
    } catch {
      // An unusable exchange must never authorize a password update.
    }
    await closeRecoveryClient(client)
    return null
  } finally {
    subscription.unsubscribe()
    clearUrl()
  }
}

function createRecoveryClient() {
  if (!supabaseUrl || !publishableKey) return null
  return createClient(supabaseUrl.replace(/\/$/, ''), publishableKey, {
    auth: {
      storageKey: recoveryKey + '-active',
      detectSessionInUrl: false,
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

export type RecoveryClient = NonNullable<ReturnType<typeof createRecoveryClient>>

export async function closeRecoveryClient(client: RecoveryClient) {
  try {
    const { error } = await client.auth.signOut({ scope: 'local' })
    return !error
  } catch {
    return false
  } finally {
    await client.auth.dispose().catch(() => undefined)
  }
}

export async function verifyRecoveryHash(hash: string) {
  const client = createRecoveryClient()
  if (!client) return null
  let verified = false
  try {
    const { data, error } = await client.auth.verifyOtp({ token_hash: hash, type: 'recovery' })
    if (error) throw error
    verified = Boolean(data.session && data.user && data.session.user.id === data.user.id)
    return verified ? client : null
  } finally {
    if (!verified) await closeRecoveryClient(client)
  }
}
