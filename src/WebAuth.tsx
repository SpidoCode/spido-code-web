import { useEffect, useRef, useState, type FormEvent } from 'react'
import { supabase } from './lib/supabase'
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
        <p>Usa la misma cuenta en la web y en el videojuego.</p>
        <img className="spido-auth-spid" src="/images/spidocode/spid-smile.png" alt="" width="1024" height="788" />
      </div>
      <section className="spido-auth-card" aria-label={registering?'Crear cuenta':'Iniciar sesión'}>
        <h2>{registering?'Crear una cuenta':'Iniciar sesión'}</h2>
        {!supabase?<p role="alert">La autenticación web todavía no está configurada. No es posible crear cuentas en este entorno.</p>:complete?<div role="status"><p>{status}</p><a className="spido-auth-primary" href={registering ? '/login' : '/perfil'}>{registering ? 'Ir a iniciar sesión' : 'Ir a mi perfil ↗'}</a></div>:<>
          <form onSubmit={submit} aria-busy={busy}>
            <label>Correo electrónico<input type="email" autoComplete="email" value={email} disabled={busy} onChange={e=>{setEmail(e.target.value);setStatus('')}} required maxLength={254}/></label>
            <label>Contraseña<input type="password" autoComplete={registering?'new-password':'current-password'} minLength={registering ? 6 : undefined} value={password} onChange={e=>setPassword(e.target.value)} required/></label>
            {registering&&<label>Repetir contraseña<input type="password" autoComplete="new-password" minLength={6} value={confirm} onChange={e=>setConfirm(e.target.value)} required/></label>}
            <button className="spido-auth-primary" disabled={busy} type="submit">{busy?'Procesando…':registering?'Crear cuenta':'Entrar'}</button>
          </form>
          {status&&<p role="alert" className="spido-auth-error">{status}</p>}
        </>}
        <p className="spido-auth-switch">{registering?<>¿Ya tienes cuenta? <a href="/login">Inicia sesión</a></>:<>¿Aún no tienes cuenta? <a href="/registro">Regístrate</a></>}</p>
        <p className="spido-auth-hint">Tu cuenta se gestiona mediante Supabase Auth. Nunca compartimos la contraseña con el videojuego por URL.</p>
      </section>
    </main>
  </div>
}
