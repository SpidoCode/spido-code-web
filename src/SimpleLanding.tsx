import { useEffect, useMemo, useRef, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'
import './SimpleLanding.css'

const BETA_DOWNLOAD_URL =
  'https://github.com/SpidoCode/spido-code/releases/download/v1.0.0-beta/SPIDOCODE-Windows-x64-v1.0.0-beta.zip'
const BETA_RELEASE_URL = 'https://github.com/SpidoCode/spido-code/releases/tag/v1.0.0-beta'

// Generador de pintas y destellos verdes neón para la Sección 3
function NeonSpeckles({ count = 16 }: { count?: number }) {
  const speckles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        top: Math.random() * 88 + 6,
        left: Math.random() * 92 + 4,
        size: Math.random() * 4 + 2.5,
        dur: `${(Math.random() * 3 + 2.5).toFixed(1)}s`,
        delay: `${(Math.random() * 3).toFixed(1)}s`,
      })),
    [count]
  )

  return (
    <div className="neon-glow-container" aria-hidden="true">
      {speckles.map((s) => (
        <span
          key={s.id}
          className="neon-speckle"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDuration: s.dur,
            animationDelay: s.delay,
          }}
        />
      ))}
    </div>
  )
}

function Nav() {
  const [session, setSession] = useState<Session | null>(null)
  const [checking, setChecking] = useState(true)
  const [busy, setBusy] = useState(false)
  const mounted = useRef(false)

  useEffect(() => {
    mounted.current = true
    const client = supabase
    if (!client) {
      setChecking(false)
      return () => {
        mounted.current = false
      }
    }
    let active = true
    const { data } = client.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return
      setSession(nextSession)
      setChecking(false)
    })
    void client.auth.getSession().then(({ data: initial, error }) => {
      if (!active) return
      setSession(error ? null : initial.session)
      setChecking(false)
    }).catch(() => {
      if (!active) return
      setChecking(false)
    })
    return () => {
      active = false
      mounted.current = false
      data.subscription.unsubscribe()
    }
  }, [])

  async function handleSignOut() {
    if (!supabase) return
    setBusy(true)
    try {
      await supabase.auth.signOut({ scope: 'local' })
      if (mounted.current) setSession(null)
    } finally {
      if (mounted.current) setBusy(false)
    }
  }

  return (
    <header className="simple-nav">
      <div className="simple-container simple-nav-inner">
        <a href="#inicio" className="simple-brand" aria-label="SPIDOCODE">
          SPIDO<span>CODE</span>
        </a>

        <nav className="simple-nav-links" aria-label="Navegación principal">
          <a href="#inicio">Inicio</a>
          <a href="#juegos">Juegos</a>
          <a href="#como-se-juega">Cómo se juega</a>
          <a href="/docs">A.D.A</a>
        </nav>

        <div className="simple-nav-cta-group">
          {checking ? null : session ? (
            <>
              <a href="/perfil" className="simple-btn-ghost">
                Mi Perfil
              </a>
              <button
                type="button"
                onClick={() => void handleSignOut()}
                disabled={busy}
                className="simple-btn-ghost"
              >
                {busy ? 'Cerrando sesión' : 'Cerrar sesión'}
              </button>
            </>
          ) : (
            <>
              <a href="/login" className="simple-btn-ghost">
                Iniciar sesión
              </a>
              <a href="/registro" className="simple-btn-primary">
                Registrarse
              </a>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default function SimpleLanding() {
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="simple-site">
      <Nav />

      <main id="contenido">
        {/* ========================================================
            SECCIÓN 1: INICIO (HERO)
            Gris claro + verde suave
            Cara 1: Spid Feliz (spid-happy.jpg)
            ======================================================== */}
        <section id="inicio" className="sec-hero">
          <div className="simple-container">
            <div className="sec-hero-grid">
              <div className="sec-hero-copy">
                <h1 className="sec-hero-title">
                  Aprende a programar <span>explorando el espacio.</span>
                </h1>
                <p className="sec-hero-subtitle">
                  Guía a <strong>Spid</strong>, un robot explorador con aspecto de computador y patas.
                  Resuelve misiones lógicas escribiendo instrucciones, automatizando tareas y
                  recolectando minerales en asteroides lejanos.
                </p>

                <div className="sec-hero-actions">
                  <a href="#juegos" className="simple-btn-primary" style={{ padding: '14px 26px' }}>
                    Ver Juegos
                  </a>
                  <a href="#como-se-juega" className="simple-btn-ghost" style={{ padding: '13px 22px' }}>
                    Cómo se juega
                  </a>
                </div>
              </div>

              <div className="sec-hero-visual">
                <div className="sec-hero-face-standalone">
                  <img
                    src="/images/spidocode/spid-smile.png"
                    alt="Spid con expresión alegre y sonriente listo para programar"
                    className="sec-hero-face-img"
                    width="1024"
                    height="788"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECCIÓN 2: JUEGOS (SPIDOCODE 0 Y SPIDOCODE)
            Estilo horizontal tipo Lightbot con iconos redondeados y
            links directos a la información de cada versión
            ======================================================== */}
        <section id="juegos" className="sec-games">
          <div className="simple-container">
            <div className="sec-section-header">
              <span className="sec-section-tag">Nuestras Experiencias</span>
              <h2 className="sec-section-title">Juegos SpidoCode</h2>
              <p className="sec-section-desc">
                Explora nuestras dos modalidades de aprendizaje: desde la lógica visual con bloques
                hasta la programación real con código escrito.
              </p>
            </div>

            <div className="games-apps-grid">
              {/* Juego 1: SpidoCode 0 (Bloques) */}
              <div className="game-app-card">
                <div className="game-app-icon-slot">
                  {/* Espacio reservado para la imagen de SpidoCode 0 */}
                  <div
                    className="game-app-icon-placeholder"
                    title="Icono SpidoCode 0 (espacio vacío listo para tu imagen)"
                  >
                    <span className="game-app-icon-badge">0</span>
                    <span className="game-app-icon-hint">SpidoCode 0</span>
                  </div>
                </div>

                <div className="game-app-info">
                  <h3 className="game-app-name">
                    <a href="/spidocode-0">SpidoCode 0</a>
                  </h3>
                  <span className="game-app-pill">Programación con Bloques</span>
                  <p className="game-app-desc">
                    Una aventura interactiva basada en bloques visuales. Ideal para dar los primeros
                    pasos, conectar órdenes lógicas y resolver acertijos espaciales sin preocuparse por
                    la sintaxis.
                  </p>
                  <a href="/spidocode-0" className="game-app-read-more">
                    Conocer SpidoCode 0
                  </a>
                </div>
              </div>

              {/* Juego 2: SpidoCode (Código Real) */}
              <div className="game-app-card">
                <div className="game-app-icon-slot">
                  {/* Espacio reservado para la imagen de SpidoCode */}
                  <div
                    className="game-app-icon-placeholder"
                    title="Icono SpidoCode (espacio vacío listo para tu imagen)"
                  >
                    <span className="game-app-icon-badge">&lt;/&gt;</span>
                    <span className="game-app-icon-hint">SpidoCode</span>
                  </div>
                </div>

                <div className="game-app-info">
                  <h3 className="game-app-name">
                    <a href="/spidocode">SpidoCode</a>
                  </h3>
                  <span className="game-app-pill">Programación con Código Real</span>
                  <p className="game-app-desc">
                    El juego educativo completo con lenguaje GDScript en texto. Escribe comandos
                    directos, controla bucles <code>while</code>, condiciones <code>if</code> y
                    automatiza la exploración en asteroides 3D.
                  </p>
                  <a href="/spidocode" className="game-app-read-more">
                    Conocer SpidoCode
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECCIÓN 3: CÓMO SE JUEGA & LO QUE APRENDERÁS
            Estructura de 4 bloques estilo Lightbot (Texto - Foto / Foto - Texto)
            Con las portadas oficiales de SpidoCode 0 y SpidoCode
            ======================================================== */}
        <section id="como-se-juega" className="sec-download">
          <div className="simple-container">
            <div className="lightbot-four-grid">
              {/* Bloque 1 (Arriba Izquierda): Texto explicativo propio de SpidoCode */}
              <div className="lightbot-four-text">
                <h2 className="lightbot-four-title">
                  ¡Aprende programación y <span>algoritmos jugando!</span>
                </h2>
                <p className="lightbot-four-desc">
                  En <strong>SPIDOCODE</strong> la programación cobra vida a través de la exploración espacial.
                  Diseña tus propios algoritmos paso a paso, automatiza las tareas de Spid y
                  resuelve desafíos lógicos en cada asteroide de manera práctica y divertida.
                </p>
              </div>

              {/* Bloque 2 (Arriba Derecha): Foto Widescreen - Portada SpidoCode 0 */}
              <div className="lightbot-four-image-frame">
                <img
                  src="/images/spidocode/spidocode-0-cover.jpg"
                  alt="Portada oficial de SpidoCode 0 con Spid y el astronauta en el hangar"
                  className="lightbot-four-img"
                  width="1024"
                  height="576"
                />
              </div>

              {/* Bloque 3 (Abajo Izquierda): Foto Widescreen - Portada SpidoCode */}
              <div className="lightbot-four-image-frame">
                <img
                  src="/images/spidocode/spidocode-cover.jpg"
                  alt="Portada oficial de SpidoCode con Spid sobre el asteroide con cristales"
                  className="lightbot-four-img"
                  width="1024"
                  height="576"
                />
              </div>

              {/* Bloque 4 (Abajo Derecha): "Lo que aprenderás" + Descarga Beta */}
              <div className="lightbot-four-text">
                <h3 className="lightbot-four-title">
                  Lo que <span>aprenderás</span>
                </h3>
                <ul className="lightbot-learn-list-clean">
                  <li>
                    <span className="lightbot-learn-dot-clean" /> Secuenciación y comandos directos
                  </li>
                  <li>
                    <span className="lightbot-learn-dot-clean" /> Bucles y optimización de repeticiones
                  </li>
                  <li>
                    <span className="lightbot-learn-dot-clean" /> Procedimientos y lógica computacional
                  </li>
                  <li>
                    <span className="lightbot-learn-dot-clean" /> Condicionales y toma de decisiones
                  </li>
                  <li>
                    <span className="lightbot-learn-dot-clean" /> Transición natural de bloques a código real
                  </li>
                </ul>

                <div className="sec-download-btn-group" style={{ marginTop: '10px' }}>
                  <a
                    href={BETA_DOWNLOAD_URL}
                    className="btn-download-hero"
                    aria-label="Descargar Beta de SPIDOCODE para Windows x64"
                  >
                    Descargar Beta para Windows x64
                  </a>
                  <a
                    href={BETA_RELEASE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-download-release"
                  >
                    Ver Release en GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECCIÓN 4: MECÁNICAS EN VIVO & ASISTENTE A.D.A.
            Degradé suave a oscuro con pintas verdes neón y consola de código
            ======================================================== */}
        <section id="mecanicas" className="sec-mechanics">
          <NeonSpeckles count={20} />

          <div className="simple-container" style={{ position: 'relative', zIndex: 2 }}>
            <div className="sec-section-header">
              <span className="sec-section-tag">Lógica Educativa</span>
              <h2 className="sec-section-title">De instrucciones simples a algoritmos espaciales</h2>
              <p className="sec-section-desc">
                Al estilo de juegos como Lightbot, el código es acción directa que cobra vida en
                pantalla. Aprende computación paso a paso mediante resolución de problemas.
              </p>
            </div>

            <div className="lightbot-showcase-grid">
              {/* Columna Izquierda: Consola de Código GDScript */}
              <div className="lightbot-card" style={{ padding: '0', overflow: 'hidden' }}>
                <img
                  src="/images/spidocode/spid-code-console.png"
                  alt="Consola GDScript de SpidoCode con bucles while y condiciones if"
                  className="square-cell-img"
                  style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '18px' }}
                />
              </div>

              {/* Columna Derecha: Tarjeta A.D.A. + Información del Editor */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="lightbot-card lightbot-companion-card">
                  <div className="lightbot-companion-face">
                    <img
                      src="/images/spidocode/spid-smile.png"
                      alt="Spid sonriendo listo para resolver misiones"
                      width="1024"
                      height="788"
                    />
                  </div>
                  <div className="lightbot-speech-bubble">
                    <strong>Pista de A.D.A.:</strong>
                    <p>
                      ¡Usa las instrucciones para avanzar por la cuadrícula y recolectar las piezas
                      antes de que se agote la energía!
                    </p>
                  </div>
                </div>

                <div className="lightbot-card" style={{ padding: '28px' }}>
                  <h3
                    style={{
                      fontFamily: "'Spido Pixel', 'Pixelify Sans', monospace",
                      fontSize: '24px',
                      color: 'var(--color-neon-green)',
                      margin: '0 0 12px',
                    }}
                  >
                    Editor de Código en Vivo
                  </h3>
                  <p style={{ color: '#e2e8f0', fontSize: '15px', lineHeight: 1.6, margin: '0 0 20px' }}>
                    Ejecuta tu código paso a paso para pausar en cada línea, inspeccionar variables y
                    aprender cómo piensa la computadora en cada decisión algorítmica.
                  </p>
                  <a href="/docs" className="sec-mechanics-docs-link">
                    Consultar Archivo A.D.A.
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECCIÓN 4: FOOTER (COMPLETAMENTE GRIS OSCURA)
            Gris oscuro profundo y uniforme (#12141a)
            ======================================================== */}
        <footer className="sec-footer">
          <div className="simple-container">
            <div className="sec-footer-top">
              <div className="sec-footer-brand">
                <h4>
                  SPIDO<span>CODE</span>
                </h4>
                <p>
                  Videojuego educativo para aprender lógica y programación explorando el espacio.
                  Proyecto de código abierto desarrollado para estudiantes y docentes.
                </p>
                <div className="sec-footer-status">
                  <span className="sec-footer-status-dot" />
                  Versión Beta v1.0.0 activa
                </div>
              </div>

              <div className="sec-footer-col">
                <h5>Juegos</h5>
                <ul>
                  <li>
                    <a href="#inicio">Inicio</a>
                  </li>
                  <li>
                    <a href="#juegos">Juegos</a>
                  </li>
                  <li>
                    <a href="#como-se-juega">Cómo se juega</a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/SpidoCode/spido-code"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Repositorio en GitHub
                    </a>
                  </li>
                </ul>
              </div>

              <div className="sec-footer-col">
                <h5>A.D.A</h5>
                <ul>
                  <li>
                    <a href="/docs">Archivo A.D.A.</a>
                  </li>
                  <li>
                    <a href="/docs?topic=bucles">Guía de Bucles</a>
                  </li>
                  <li>
                    <a href="/docs?topic=condicionales">Guía de Condicionales</a>
                  </li>
                  <li>
                    <a href="/docs?topic=arquitectura">Arquitectura del Juego</a>
                  </li>
                </ul>
              </div>

              <div className="sec-footer-col">
                <h5>Comunidad</h5>
                <ul>
                  <li>
                    <a href="/perfil">Mi Perfil y Códice</a>
                  </li>
                  <li>
                    <a href="/login">Iniciar sesión</a>
                  </li>
                  <li>
                    <a href="/registro">Registrarse</a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="sec-footer-bottom">
              <div>
                © 2026 <strong>SPIDOCODE</strong>
              </div>
              <button
                type="button"
                className="btn-back-to-top"
                onClick={scrollToTop}
                aria-label="Volver al inicio de la página"
              >
                Volver al inicio
              </button>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
