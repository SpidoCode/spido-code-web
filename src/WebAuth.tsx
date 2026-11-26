import { useEffect, useLayoutEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { closeRecoveryClient, exchangeRecoveryLink, recoveryLinkClient, supabase, verifyRecoveryHash, type RecoveryClient } from './lib/supabase'
import './WebAuth.css'

const VERIFICATION_WAIT_MS = 60_000
const VERIFICATION_REDIRECT = 'https://www.spidocode.com/login'
const VERIFICATION_PATH = '/verificar-correo'
const VERIFICATION_KEY = 'spidocode.pending-verification'

type PendingVerification = { email: string; until: number }

function readVerification(): PendingVerification {
  try {
    const pending = JSON.parse(sessionStorage.getItem(VERIFICATION_KEY) ?? 'null')
    if (typeof pending?.email === 'string' && pending.email.length <= 254 &&
      Number.isFinite(pending.until)) return pending
  } catch {
    // La pantalla también admite visitas sin almacenamiento.
  }
  return { email: '', until: 0 }
}

function saveVerification(pending: PendingVerification) {
  try {
    sessionStorage.setItem(VERIFICATION_KEY, JSON.stringify(pending))
  } catch {
    // Si el navegador bloquea el almacenamiento, se muestra el acceso sin contexto.
  }
}

function openVerification(email: string, wait: number) {
  const previous = readVerification()
  const until = Math.max(Date.now() + wait, previous.email === email ? previous.until : 0)
  saveVerification({ email, until })
  window.location.assign(VERIFICATION_PATH)
}

function isRateLimited(error: { status?: number; code?: string }) {
  return error.status === 429 || error.code === 'over_email_send_rate_limit' ||
    error.code === 'over_request_rate_limit'
}

export function VerifyEmail() {
  const [{ email, until }] = useState(readVerification)
  const [resending, setResending] = useState(false)
  const [resendStatus, setResendStatus] = useState('')
  const [seconds, setSeconds] = useState(() => Math.max(0, Math.ceil((until - Date.now()) / 1000)))
  const cooldownUntil = useRef(until)
  const requestActive = useRef(false)

  useEffect(() => {
    if (!seconds) return
    const timer = window.setTimeout(() => {
      setSeconds(Math.max(0, Math.ceil((cooldownUntil.current - Date.now()) / 1000)))
    }, Math.max(1, cooldownUntil.current - Date.now() - (seconds - 1) * 1000))
    return () => window.clearTimeout(timer)
  }, [seconds])

  function startCooldown() {
    cooldownUntil.current = Date.now() + VERIFICATION_WAIT_MS
    saveVerification({ email, until: cooldownUntil.current })
    setSeconds(60)
  }

  async function resendVerification() {
    if (!supabase || !email ||
      requestActive.current || Date.now() < cooldownUntil.current) return

    requestActive.current = true
    setResending(true)
    setResendStatus('')
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: { emailRedirectTo: VERIFICATION_REDIRECT },
      })
      if (error && isRateLimited(error)) {
        startCooldown()
        setResendStatus('Demasiadas solicitudes. Espera antes de volver a intentarlo.')
      } else if (error && !['user_not_found', 'email_exists', 'user_already_exists'].includes(error.code ?? '')) {
        setResendStatus('No pudimos procesar el reenvío en este momento. Inténtalo más tarde.')
      } else {
        startCooldown()
        setResendStatus('Solicitud procesada. Si hay una verificación pendiente, revisa tu bandeja de entrada y el correo no deseado.')
      }
    } catch {
      setResendStatus('No pudimos procesar el reenvío en este momento. Inténtalo más tarde.')
    } finally {
      requestActive.current = false
      setResending(false)
    }
  }

  const isGmail = /@(?:gmail|googlemail)\.com$/i.test(email)
  return (
    <main className="spido-verify-page">
      <a href="/" className="spido-verify-logo" aria-label="SPIDOCODE, inicio">SPIDO<span>CODE</span></a>
      <section className="spido-verify-card" aria-labelledby="verification-title">
        <span className="spido-verify-icon" aria-hidden="true">✉</span>
        <h1 id="verification-title">Verifica tu correo electrónico</h1>
        {email ? <>
          <p>Si hay una verificación pendiente para <strong>{email}</strong>, abre el enlace de confirmación. Revisa también la carpeta de Spam o correo no deseado.</p>
          {isGmail && <a className="spido-verify-gmail" href="https://mail.google.com/" target="_blank" rel="noopener noreferrer">Abrir Gmail <span aria-label="(se abre en una pestaña nueva)">↗</span></a>}
          {supabase ? (
            <div className="spido-auth-verification" aria-busy={resending}>
              <button type="button" disabled={resending || seconds > 0} onClick={() => void resendVerification()}
                aria-describedby={seconds > 0 ? 'verification-wait' : undefined}>
                {resending ? 'Procesando solicitud…' : 'Reenviar correo de verificación'}
              </button>
              {seconds > 0 && <p id="verification-wait">Disponible en {seconds} s.</p>}
            </div>
          ) : <p>El reenvío no está disponible en este entorno.</p>}
          <p role="status">{resendStatus}</p>
        </> : <p>Abre esta pantalla desde el registro o el inicio de sesión para solicitar otro enlace.</p>}
        <a href="/login" className="spido-verify-back">Volver a iniciar sesión</a>
      </section>
    </main>
  )
}

function PasswordField({ id, label, value, onChange, registering }: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  registering: boolean
}) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="spido-auth-password">
      <label htmlFor={id}>{label}</label>
      <div className="spido-auth-password-control">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          autoComplete={registering ? 'new-password' : 'current-password'}
          minLength={registering ? 6 : undefined}
          value={value}
          onChange={event => onChange(event.target.value)}
          required
        />
        <button
          className="spido-auth-eye"
          type="button"
          aria-label={`${visible ? 'Ocultar' : 'Mostrar'} ${label.toLowerCase()}`}
          aria-controls={id}
          onClick={() => setVisible(previous => !previous)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
            <circle cx="12" cy="12" r="2.5" />
            {visible && <path d="m3 3 18 18" />}
          </svg>
        </button>
      </div>
    </div>
  )
}

export default function WebAuth({ mode }: { mode: 'register' | 'login' }) {
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [confirm,setConfirm] = useState('')
  const [busy,setBusy] = useState(false)
  const [status,setStatus] = useState('')
  const [complete,setComplete] = useState(false)
  const requestActive = useRef(false)
  const registering = mode === 'register'

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!supabase || requestActive.current) return
    setStatus('')
    if(registering && password!==confirm){setStatus('Las contraseñas no coinciden.');return}
    if(registering && password.length<6){setStatus('La contraseña debe tener al menos 6 caracteres.');return}
    const submittedEmail = email.trim()
    requestActive.current = true
    setBusy(true)
    try{
      if(registering){
        const {data,error}=await supabase.auth.signUp({
          email:submittedEmail,
          password,
          options: {
            emailRedirectTo: VERIFICATION_REDIRECT,
          },
        })
        if(error) throw error
        if (!data.session) {
          openVerification(submittedEmail, VERIFICATION_WAIT_MS)
          return
        }
        setComplete(true)
        setStatus('Cuenta creada. Vuelve a SpidoCode e inicia sesión con las mismas credenciales.')
      }else{
        const {error}=await supabase.auth.signInWithPassword({email:submittedEmail,password})
        if (error?.code === 'email_not_confirmed') {
          openVerification(submittedEmail, 0)
          return
        }
        if(error) throw error
        setComplete(true)
        setStatus('Sesión iniciada. Puedes consultar tu progreso o volver al videojuego.')
      }
    }catch{
      setStatus(registering?'No fue posible completar el registro. Comprueba los datos o inténtalo más tarde.':'No fue posible iniciar sesión. Revisa tus credenciales.')
    }finally{requestActive.current = false;setBusy(false);setPassword('');setConfirm('')}
  }
  return <div className="spido-web-auth">
    <a className="spido-auth-skip" href="#auth-main">Saltar al contenido</a>
    <header className="spido-auth-header"><div className="spido-auth-container"><a className="spido-auth-logo" href="/">SPIDO<span>CODE</span></a><nav aria-label="Navegación"><a href="/">Inicio</a><a href="/perfil">Mi progreso</a></nav></div></header>
    <main id="auth-main" className="spido-auth-container spido-auth-main">
      <div className="spido-auth-intro">
        <h1>{registering ? 'Únete a la' : 'Bienvenido de'} <span>{registering ? 'misión.' : 'vuelta.'}</span></h1>
        <p>Aprende a programar con Spid.</p>
        <img className="spido-auth-spid" src="/images/spidocode/spid-smile.png" alt="" width="1024" height="788" />
      </div>
      <section className="spido-auth-card" aria-label={registering?'Crear cuenta':'Iniciar sesión'}>
        <h2>{registering?'Crear una cuenta':'Iniciar sesión'}</h2>
        {!supabase?<p role="alert">La autenticación web todavía no está configurada. No es posible crear cuentas en este entorno.</p>:complete?<div role="status"><p>{status}</p><a className="spido-auth-primary" href={registering ? '/login' : '/perfil'}>{registering ? 'Ir a iniciar sesión' : 'Ir a mi perfil ↗'}</a></div>:<>
          <form onSubmit={submit} aria-busy={busy}>
            <label>Correo electrónico<input type="email" autoComplete="email" value={email} disabled={busy} onChange={e=>{setEmail(e.target.value);setStatus('')}} required maxLength={254}/></label>
            <PasswordField id="auth-password" label="Contraseña" value={password} onChange={setPassword} registering={registering} />
            {registering && <PasswordField id="auth-password-confirm" label="Repetir contraseña" value={confirm} onChange={setConfirm} registering />}
            {!registering && <a className="spido-auth-recovery-link" href={RECOVERY_PATH}>¿Olvidaste tu contraseña?</a>}
            <button className="spido-auth-primary" disabled={busy} type="submit">{busy?'Procesando…':registering?'Crear cuenta':'Entrar'}</button>
          </form>
          {status&&<p role="alert" className="spido-auth-error">{status}</p>}
        </>}
        <p className="spido-auth-switch">{registering?<>¿Ya tienes cuenta? <a href="/login">Inicia sesión</a></>:<>¿Aún no tienes cuenta? <a href="/registro">Regístrate</a></>}</p>
        <p className="spido-auth-hint">Una sola cuenta para aprender, jugar y explorar</p>
      </section>
    </main>
  </div>
}

const RECOVERY_PATH = '/recuperar-contrasena'
const RECOVERY_REDIRECT = 'https://www.spidocode.com/reset-password'
const RECOVERY_WAIT_MS = 60_000

function RecoveryCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className="spido-web-auth spido-auth-recovery">
      <section className="spido-auth-card" aria-labelledby="recovery-title">
        <a className="spido-auth-logo" href="/">SPIDO<span>CODE</span></a>
        <h1 id="recovery-title">{title}</h1>
        {children}
        <a className="spido-auth-recovery-link" href="/login">Volver a iniciar sesión</a>
      </section>
    </main>
  )
}

export function RequestPasswordRecovery() {
  const [email, setEmail] = useState('')
  const [requestedEmail, setRequestedEmail] = useState('')
  const [remaining, setRemaining] = useState(0)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const requesting = useRef(false)
  const deadline = useRef(0)

  useEffect(() => {
    const tick = () => setRemaining(Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000)))
    const timer = window.setInterval(tick, 500)
    return () => window.clearInterval(timer)
  }, [])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!recoveryLinkClient || requesting.current || Date.now() < deadline.current) return
    requesting.current = true
    setBusy(true)
    setError('')
    const address = requestedEmail || email.trim()
    try {
      const { error: requestError } = await recoveryLinkClient.auth.resetPasswordForEmail(
        address, { redirectTo: RECOVERY_REDIRECT },
      )
      if (requestError && isRateLimited(requestError)) {
        setError('Hay demasiadas solicitudes. Espera antes de volver a intentarlo.')
      } else {
        // SMTP and account-specific outcomes get the same response as an accepted request.
        setRequestedEmail(address)
      }
    } catch {
      setRequestedEmail(address)
    } finally {
      deadline.current = Date.now() + RECOVERY_WAIT_MS
      setRemaining(60)
      requesting.current = false
      setBusy(false)
    }
  }

  return (
    <RecoveryCard title={requestedEmail ? 'Revisa tu correo' : 'Recupera tu contraseña'}>
      {requestedEmail ? <>
        <p role="status">Si podemos tramitar tu solicitud, recibirás un enlace. Revisa también la carpeta Spam.</p>
        <p>Abre el enlace del correo y pulsa Continuar para verificarlo.</p>
        {/@gmail\.com$/i.test(requestedEmail) && (
          <a className="spido-auth-recovery-link" href="https://mail.google.com/" target="_blank" rel="noopener noreferrer">Abrir Gmail (nueva pestaña)</a>
        )}
      </> : <p>Introduce el correo asociado a tu cuenta de SPIDOCODE.</p>}
      {!recoveryLinkClient && <p role="alert" className="spido-auth-error">La recuperación no está disponible en este entorno.</p>}
      <form onSubmit={submit} aria-busy={busy}>
        {!requestedEmail && (
          <label>Correo electrónico
            <input type="email" autoComplete="email" required maxLength={254} value={email}
              disabled={busy} onChange={event => setEmail(event.target.value)} />
          </label>
        )}
        <button type="submit" className="spido-auth-primary" disabled={!recoveryLinkClient || busy || remaining > 0}>
          {busy ? 'Procesando…' : requestedEmail ? 'Reenviar enlace de recuperación' : 'Enviar enlace de recuperación'}
        </button>
      </form>
      {remaining > 0 && <p>Podrás volver a intentarlo en {remaining} s.</p>}
      {error && <p role="alert" className="spido-auth-error">{error}</p>}
    </RecoveryCard>
  )
}

export function ResetPasswordPage({ legacy = false }: { legacy?: boolean }) {
  const [status, setStatus] = useState<'checking' | 'confirm' | 'verifying' | 'ready' | 'submitting' | 'success' | 'invalid'>('checking')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const clientRef = useRef<RecoveryClient | null>(null)
  const pendingHash = useRef('')
  const initialized = useRef(false)
  const active = useRef(false)
  const busy = useRef(false)

  useLayoutEffect(() => {
    active.current = true
    if (!initialized.current) {
      initialized.current = true
      const url = new URL(window.location.href)
      if (legacy && url.searchParams.has('code')) {
        setStatus('confirm')
      } else {
        if (!legacy) pendingHash.current = new URLSearchParams(url.hash.slice(1)).get('token_hash') ?? ''
        window.history.replaceState(window.history.state, '', url.pathname)
        setStatus(pendingHash.current ? 'confirm' : 'invalid')
      }
    }

    function stop() {
      active.current = false
      const client = clientRef.current
      clientRef.current = null
      if (client) void closeRecoveryClient(client)
    }

    function leavePage() {
      pendingHash.current = ''
      setPassword('')
      setConfirm('')
      setStatus(previous => previous === 'success' ? previous : 'invalid')
      stop()
    }

    window.addEventListener('pagehide', leavePage)
    return () => {
      window.removeEventListener('pagehide', leavePage)
      stop()
      // Strict Mode repeats effect setup before this microtask runs.
      queueMicrotask(() => { if (!active.current) pendingHash.current = '' })
    }
  }, [legacy])

  async function verify() {
    if (!active.current || busy.current || status !== 'confirm') return
    busy.current = true
    setStatus('verifying')
    const hash = pendingHash.current
    pendingHash.current = ''

    try {
      const client = legacy ? await exchangeRecoveryLink() : await verifyRecoveryHash(hash)
      if (!active.current) {
        if (client) await closeRecoveryClient(client)
        return
      }
      clientRef.current = client
      setStatus(client ? 'ready' : 'invalid')
    } catch {
      if (active.current) setStatus('invalid')
    } finally {
      busy.current = false
    }
  }

  function clearPasswords() {
    setPassword('')
    setConfirm('')
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const client = clientRef.current
    if (!active.current || status !== 'ready' || !client || busy.current) return
    setError('')
    if (password !== confirm) {
      setError('Las contraseñas no coinciden.')
      return
    }
    busy.current = true
    setStatus('submitting')
    try {
      const { error: updateError } = await client.auth.updateUser({ password })
      if (!active.current) return
      if (updateError) {
        if (updateError.status === 401 || ['session_not_found', 'session_expired', 'bad_jwt'].includes(updateError.code ?? '')) {
          clientRef.current = null
          clearPasswords()
          void closeRecoveryClient(client)
          setStatus('invalid')
          return
        }
        setError(updateError.code === 'weak_password' ? 'La contraseña no cumple los requisitos de seguridad. Elige una más segura.' :
          updateError.code === 'same_password' ? 'Elige una contraseña distinta de la anterior.' :
          'No pudimos actualizar la contraseña. Inténtalo nuevamente.')
        setStatus('ready')
        return
      }

      clientRef.current = null
      clearPasswords()
      const closed = await closeRecoveryClient(client)
      if (!active.current) return
      if (!closed) setError('No se pudo revocar la sesión temporal. El cambio de contraseña ya se realizó.')
      setStatus('success')
    } catch {
      if (!active.current) return
      setError('No pudimos actualizar la contraseña. Inténtalo nuevamente.')
      setStatus('ready')
    } finally {
      busy.current = false
    }
  }

  return (
    <RecoveryCard title="Restablecer contraseña">
      {(status === 'checking' || status === 'verifying') && <p role="status">Validando enlace de recuperación…</p>}
      {status === 'confirm' && <>
        <p>Verifica el enlace del correo para elegir una nueva contraseña.</p>
        <button type="button" className="spido-auth-primary" onClick={() => void verify()}>Continuar</button>
      </>}
      {status === 'invalid' && <>
        <p role="alert">No pudimos verificar el enlace. Puede haber vencido o haberse usado. Solicita un enlace nuevo.</p>
        <a className="spido-auth-recovery-link" href={RECOVERY_PATH}>Solicitar un enlace nuevo</a>
      </>}
      {status === 'success' && <p role="status">Tu contraseña se actualizó. Ya puedes iniciar sesión con la nueva contraseña.</p>}
      {(status === 'ready' || status === 'submitting') && <>
        <p>Crea una contraseña nueva para tu cuenta de SPIDOCODE.</p>
        <form onSubmit={submit} aria-busy={status === 'submitting'}>
          <PasswordField id="recovery-password" label="Nueva contraseña" value={password} onChange={setPassword} registering />
          <PasswordField id="recovery-confirm" label="Repetir contraseña" value={confirm} onChange={setConfirm} registering />
          <button className="spido-auth-primary" type="submit" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Actualizando…' : 'Actualizar contraseña'}
          </button>
        </form>
      </>}
      {error && <p role="alert" className="spido-auth-error">{error}</p>}
    </RecoveryCard>
  )
}
