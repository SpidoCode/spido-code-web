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
          <a href="#descargas">Juegos</a>
          <a href="#mecanicas">Cómo se juega</a>
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
                  <a href="#descargas" className="simple-btn-primary" style={{ padding: '14px 26px' }}>
                    Ir a la descarga
                  </a>
                  <a href="/docs" className="simple-btn-ghost" style={{ padding: '13px 22px' }}>
                    Ver documentación
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
            SECCIÓN 2: CONTENIDO 1 (CUADRADO INTERCALADO TEXTO - FOTO)
            Fila 1: [Texto] [Foto 1: Consola de Código]
            Fila 2: [Foto 2: Gameplay Cuadrícula] [Texto con Descarga Beta]
            ======================================================== */}
        <section id="descargas" className="sec-download">
          <div className="simple-container">
            <div className="square-interleaved-grid">
              {/* Celda 1 (Arriba Izquierda): Texto estilo Lightbot */}
              <div className="square-cell square-text-cell">
                <h2 className="square-cell-title">
                  ¡Aprende a programar <span>jugando!</span>
                </h2>
                <p className="square-cell-desc">
                  <strong>SPIDOCODE</strong> es un juego educativo basado en lógica y código real.
                  Escribe instrucciones como <code>spid.norte()</code>, bucles <code>while</code> y
                  condiciones para que Spid explore asteroides y recolecte minerales de forma autónoma.
                </p>
              </div>

              {/* Celda 2 (Arriba Derecha): Foto de la Consola de Código con bordes redondeados */}
              <div className="square-cell square-photo-cell">
                <img
                  src="/images/spidocode/spid-code-console.png"
                  alt="Consola de código de Spid con bucles while, condiciones if y comandos de minería"
                  className="square-cell-img"
                  width="682"
                  height="686"
                />
              </div>

              {/* Celda 3 (Abajo Izquierda): Foto del Gameplay en la Cuadrícula con bordes redondeados */}
              <div className="square-cell square-photo-cell">
                <img
                  src="/images/spidocode/spid-grid-gameplay.jpg"
                  alt="Spid en la cuadrícula espacial 3D recolectando minerales frente a la estación"
                  className="square-cell-img"
                  width="619"
                  height="668"
                />
              </div>

              {/* Celda 4 (Abajo Derecha): Más Texto con Botón de Descarga Beta */}
              <div className="square-cell square-text-cell square-download-cell">
                <h3 className="square-cell-title">
                  Descarga la <span>Beta oficial</span>
                </h3>
                <p className="square-cell-desc">
                  Versión preliminar <strong>v1.0.0-beta</strong> disponible para Windows x64.
                  Descarga el archivo ZIP, descomprime la carpeta y ejecuta{' '}
                  <code>SpidoCode.exe</code> para comenzar a resolver desafíos.
                </p>
                <div className="sec-download-btn-group" style={{ marginTop: '22px' }}>
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
            SECCIÓN 3: CONTENIDO 2 (CONCEPTOS & LO QUE APRENDERÁS)
            Degradé de gris claro al oscuro con pintas verdes neón
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
              {/* Columna Izquierda: Captura del Menú / Mundo Spid + Spid con diálogo de A.D.A. */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="lightbot-card">
                  <div className="lightbot-img-frame">
                    <img
                      src="/images/spidocode/spid-menu-art.jpg"
                      alt="Spid en el menú oficial sobre el asteroide con cristales espaciales"
                      className="lightbot-img"
                      width="1024"
                      height="542"
                    />
                  </div>
                </div>

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
              </div>

              {/* Columna Derecha: Lo que aprenderás estilo Lightbot */}
              <div className="lightbot-card lightbot-text-card">
                <h3 className="lightbot-learn-title">Lo que aprenderás</h3>
                <ul className="lightbot-learn-list">
                  <li className="lightbot-learn-item">
                    <span className="lightbot-learn-dot" /> Secuenciación y comandos directos
                  </li>
                  <li className="lightbot-learn-item">
                    <span className="lightbot-learn-dot" /> Bucles y optimización de repeticiones
                  </li>
                  <li className="lightbot-learn-item">
                    <span className="lightbot-learn-dot" /> Procedimientos y automatización
                  </li>
                  <li className="lightbot-learn-item">
                    <span className="lightbot-learn-dot" /> Condicionales y toma de decisiones
                  </li>
                  <li className="lightbot-learn-item">
                    <span className="lightbot-learn-dot" /> Asistencia y orientación en vivo con A.D.A.
                  </li>
                </ul>

                <a href="/docs" className="sec-mechanics-docs-link">
                  Consultar Archivo A.D.A.
                </a>
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
                    <a href="#descargas">Juegos</a>
                  </li>
                  <li>
                    <a href="#mecanicas">Cómo se juega</a>
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
