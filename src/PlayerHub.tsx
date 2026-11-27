import { useEffect, useState, type FormEvent } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'
import { learningGuides } from './learningGuides'
import './PlayerHub.css'

type Progress = {
  current_mission_id: string | null
  completed_missions: unknown
  unlocked_knowledge: unknown
  minerals_ship: number | null
  minerals_spid: number | null
  map_tier: number | null
  updated_at: string | null
}
const safeList = (value: unknown): string[] => Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []
const readable = (id: string) => id.replace(/_/g, ' ')

const iconPaths = {
  account: 'M4 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2 M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
  mission: 'M12 2v4m0 12v4M2 12h4m12 0h4M20 12a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z',
  completed: 'm5 12 4 4L19 6M4 21h16',
  ship: 'm12 3 7 4v8l-7 6-7-6V7Z m-7 4 7 5 7-5m-7 5v9',
  spid: 'm12 3 8 9-8 9-8-9Z M4 12h16m-8-9v18',
  map: 'm3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3Z M9 3v15m6-12v15',
  guides: 'M4 4h6a2 2 0 0 1 2 2v15a3 3 0 0 0-3-3H4Zm16 0h-6a2 2 0 0 0-2 2v15a3 3 0 0 1 3-3h5Z',
  unlocked: 'M8 11V7a4 4 0 0 1 8 0 M6 11h12v10H6Zm6 4v2',
  locked: 'M8 11V7a4 4 0 0 1 8 0v4 M6 11h12v10H6Zm6 4v2',
}

function HubIcon({ name }: { name: keyof typeof iconPaths }) {
  return <span className="spido-hub-icon" aria-hidden="true">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" focusable="false">
      <path d={iconPaths[name]} />
    </svg>
  </span>
}

export default function PlayerHub() {
  const [user, setUser] = useState<User | null>(null)
  const [checking, setChecking] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authBusy, setAuthBusy] = useState(false)
  const [notice, setNotice] = useState('')
  const [progress, setProgress] = useState<Progress | null>(null)
  const [loadingProgress, setLoadingProgress] = useState(false)
  const [progressError, setProgressError] = useState('')

  useEffect(() => {
    if (!supabase) { setChecking(false); return }
    const client = supabase
    let active = true
    void client.auth.getUser().then(({ data, error }) => {
      if (active) { setUser(error ? null : data.user); setChecking(false) }
    }).catch(() => { if (active) { setUser(null); setChecking(false) } })
    const { data } = client.auth.onAuthStateChange((_event, session) => {
      if (active) setUser(session?.user ?? null)
    })
    return () => { active = false; data.subscription.unsubscribe() }
  }, [])

  useEffect(() => {
    if (!supabase || !user) { setProgress(null); setProgressError(''); return }
    const client = supabase
    let active = true
    const userId = user.id
    setLoadingProgress(true)
    setProgress(null)
    setProgressError('')
    // Sólo consulta la fila del usuario autenticado, además de las restricciones RLS del servidor.
    void client.from('player_progress')
      .select('current_mission_id,completed_missions,unlocked_knowledge,minerals_ship,minerals_spid,map_tier,updated_at')
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!active) return
        setLoadingProgress(false)
        if (error) {
          setProgressError('No fue posible consultar el progreso. Verifica que esta web use el mismo proyecto Supabase que el juego y que RLS permita leer solo los datos propios.')
        } else setProgress(data as Progress | null)
      })
    return () => { active = false }
  }, [user?.id])

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!supabase || authBusy) return
    setAuthBusy(true); setNotice('')
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
      setPassword('')
      if (error) setNotice('No se pudo iniciar sesión. Revisa tus credenciales.')
    } catch { setNotice('No se pudo conectar con el servicio de autenticación.') }
    finally { setAuthBusy(false) }
  }

  async function signOut() {
    if (!supabase || authBusy) return
    setAuthBusy(true)
    const { error } = await supabase.auth.signOut()
    setAuthBusy(false)
    if (error) setNotice('No se pudo cerrar sesión. Inténtalo nuevamente.')
    else { setUser(null); setProgress(null); setNotice('Sesión cerrada.') }
  }

  return <div className="spido-hub">
    <a className="spido-hub-skip" href="#hub-content">Saltar al contenido</a>
    <header className="spido-hub-header"><div className="spido-hub-container spido-hub-nav">
      <a href="/" className="spido-hub-logo">SPIDO<span>CODE</span></a>
      <nav aria-label="Navegación"><a href="/">Inicio</a></nav>
    </div></header>
    <main id="hub-content" className="spido-hub-container spido-hub-main">
      <section className="spido-hub-hero" aria-labelledby="hub-title">
        <div>
          <p className="spido-hub-kicker">PERFIL DEL JUGADOR</p>
          <h1 id="hub-title">Tu aventura, <span>tu progreso.</span></h1>
          <p className="spido-hub-lead">Consulta los datos guardados de tu partida de SpidoCode. Este panel no modifica misiones, minerales ni inventario.</p>
        </div>
        <img src="/images/spidocode/spid-smile.png" alt="" width="1024" height="788" />
      </section>
      {!supabase ? <section className="spido-hub-panel" role="status"><h2>Configuración pendiente</h2><p>El portal aún no tiene configuradas sus variables públicas de Supabase. No se puede acceder al perfil.</p></section>
      : checking ? <p className="spido-hub-panel" role="status">Comprobando sesión…</p>
      : !user ? <section className="spido-hub-panel spido-hub-auth">
          <h2>Inicia sesión</h2><p>Usa la misma cuenta que utilizas en el videojuego.</p>
          <form onSubmit={signIn}>
            <label>Correo electrónico<input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
            <label>Contraseña<input type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} /></label>
            <button type="submit" disabled={authBusy}>{authBusy ? 'Ingresando…' : 'Entrar a mi perfil'}</button>
          </form>
          <p className="spido-hub-note">Las credenciales se procesan mediante Supabase Auth. Nunca aparecen en la URL ni se registran en esta página.</p>
        </section>
      : <section aria-label="Progreso del jugador">
          <div className="spido-hub-account"><HubIcon name="account" /><div><small>CUENTA CONECTADA</small><strong>{user.email ?? 'Cuenta de jugador'}</strong></div><button type="button" disabled={authBusy} onClick={signOut}>Cerrar sesión</button></div>
          {loadingProgress ? <p className="spido-hub-panel" role="status">Cargando progreso…</p>
          : progressError ? <div className="spido-hub-panel" role="alert"><h2>Progreso no disponible</h2><p>{progressError}</p></div>
          : !progress ? <div className="spido-hub-panel" role="status"><h2>Sin partida sincronizada</h2><p>Esta cuenta todavía no tiene una partida remota registrada. Abre SpidoCode con esa cuenta para generar progreso.</p></div>
          : <>
              <div className="spido-hub-stats">
                <article><HubIcon name="mission" /><small>MISIÓN ACTUAL</small><strong>{progress.current_mission_id ? readable(progress.current_mission_id) : 'Sin datos'}</strong></article>
                <article><HubIcon name="completed" /><small>MISIONES COMPLETADAS</small><strong>{safeList(progress.completed_missions).length}</strong></article>
                <article><HubIcon name="ship" /><small>MINERALES EN NAVE</small><strong>{progress.minerals_ship ?? 'Sin datos'}</strong></article>
                <article><HubIcon name="spid" /><small>MINERALES DE SPID</small><strong>{progress.minerals_spid ?? 'Sin datos'}</strong></article>
                <article><HubIcon name="map" /><small>NIVEL DEL MAPA</small><strong>{progress.map_tier ?? 'Sin datos'}</strong></article>
                <article><HubIcon name="guides" /><small>CONOCIMIENTOS</small><strong>{safeList(progress.unlocked_knowledge).length}</strong></article>
              </div>
              <section className="spido-hub-panel" aria-labelledby="hub-codex-heading">
                <div className="spido-hub-codex-heading">
                  <div><p className="spido-hub-kicker">CONOCIMIENTOS // SINCRONIZADO</p><h2 id="hub-codex-heading">Tu Códice de programación</h2></div>
                  <span className="spido-hub-codex-total">{learningGuides.filter((guide) => safeList(progress.unlocked_knowledge).includes(guide.id)).length} / {learningGuides.length} guías disponibles</span>
                </div>
                <p>Los conocimientos desbloqueados se leen de tu partida sin modificar el progreso del juego.</p>
                <div className="spido-hub-codex-grid">
                  {learningGuides.map((guide) => {
                    const unlocked = safeList(progress.unlocked_knowledge).includes(guide.id)
                    return <article key={guide.id} className={`spido-hub-codex-card ${unlocked ? 'is-unlocked' : 'is-locked'}`}>
                      <span><HubIcon name={unlocked ? 'unlocked' : 'locked'} />{guide.group} · {unlocked ? 'Desbloqueado' : 'Pendiente en el juego'}</span>
                      <h3>{guide.title}</h3>
                      <p>{unlocked ? guide.summary : 'Continúa avanzando en SpidoCode para desbloquear este conocimiento.'}</p>
                    </article>
                  })}
                </div>
                {safeList(progress.unlocked_knowledge).some((id) => !learningGuides.some((guide) => guide.id === id)) &&
                  <p className="spido-hub-note">Otros conocimientos registrados: {safeList(progress.unlocked_knowledge).filter((id) => !learningGuides.some((guide) => guide.id === id)).map(readable).join(', ')}. Todavía no tienen guía web publicada.</p>}
              </section>
              <p className="spido-hub-note">Última sincronización registrada: {progress.updated_at ? new Date(progress.updated_at).toLocaleString('es-CL') : 'Sin datos'}. Solo lectura.</p>
            </>}
        </section>}
      {notice && <p role="status" className="spido-hub-notice">{notice}</p>}
    </main>
    <footer className="spido-hub-footer"><div className="spido-hub-container"><span>© 2026 SPIDOCODE</span><a href="/">Volver al inicio ↑</a></div></footer>
  </div>
}
