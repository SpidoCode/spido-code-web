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
          <a href="#descargas">Descarga Beta</a>
          <a href="#mecanicas">Cómo se juega</a>
          <a href="/docs">Archivo A.D.A.</a>
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
            SECCIÓN 2: CONTENIDO 1 (DESCARGA DE LA BETA & PASOS)
            Gris claro continuando con el Botón Principal de la Beta
            Cara 2: Spid Curioso / Atento (spid-curious.jpg)
            ======================================================== */}
        <section id="descargas" className="sec-download">
          <div className="simple-container">
            <div className="sec-section-header">
              <span className="sec-section-tag">Acceso Oficial</span>
              <h2 className="sec-section-title">Descarga la Beta de SPIDOCODE</h2>
              <p className="sec-section-desc">
                La versión preliminar oficial ya está disponible para Windows. Descarga el paquete,
                descomprímelo y comienza a programar tu primera misión en cuestión de segundos.
              </p>
            </div>

            {/* Caja de descarga con botón protagonista y Cara 2 */}
            <div className="sec-download-box">
              <div className="sec-download-main">
                <h3>SPIDOCODE v1.0.0-beta</h3>
                <p>
                  Construido sobre Godot 4. Incluye los primeros sectores de exploración, el editor
                  de comandos para Spid y el sistema de asistencia pedagógica A.D.A.
                </p>
                <div className="sec-download-btn-group">
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

              <div className="sec-download-side">
                <div className="sec-download-face-wrap">
                  <img
                    src="/images/spidocode/spid-smile.png"
                    alt="Spid con expresión alegre listo para la descarga"
                    className="sec-download-face-img"
                    width="1024"
                    height="788"
                  />
                </div>
                <div className="sec-download-specs">
                  <h4>Ficha técnica</h4>
                  <ul>
                    <li>
                      <span>Sistema operativo:</span>
                      <strong>Windows 10 / 11 (64-bit)</strong>
                    </li>
                    <li>
                      <span>Tamaño del archivo:</span>
                      <strong>Aproximadamente 100 MB</strong>
                    </li>
                    <li>
                      <span>Modo de uso:</span>
                      <strong>Portable (sin instalador)</strong>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 3 Pasos rápidos para jugar */}
            <div className="sec-steps-grid">
              <div className="sec-step-card">
                <span className="sec-step-badge">1</span>
                <h4>Descarga el archivo ZIP</h4>
                <p>
                  Haz clic en el botón superior para bajar el paquete comprimido oficial de la
                  beta.
                </p>
              </div>

              <div className="sec-step-card">
                <span className="sec-step-badge">2</span>
                <h4>Extrae la carpeta</h4>
                <p>
                  Descomprime el archivo en tu escritorio conservando todos sus componentes en la
                  misma carpeta.
                </p>
              </div>

              <div className="sec-step-card">
                <span className="sec-step-badge">3</span>
                <h4>Ejecuta SpidoCode.exe</h4>
                <p>
                  Abre el archivo ejecutable y comienza a resolver tus primeros desafíos junto a Spid.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECCIÓN 3: CONTENIDO 2 (MECÁNICAS Y CÓDIGO - DEGRADÉ CON PINTAS VERDES NEÓN)
            Degradé de gris claro al oscuro con pintas verdes neón
            Cara 3: Spid Guiño / Astuto (spid-wink.jpg)
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

            {/* 3 Bloques de conceptos estilo Lightbot */}
            <div className="sec-mechanics-grid">
              <div className="sec-mechanic-card">
                <div className="sec-mechanic-icon">01</div>
                <h4>Secuencias y Comandos</h4>
                <p>
                  Aprende la base del pensamiento algorítmico: planifica paso a paso cómo Spid debe
                  avanzar, girar e interactuar con el entorno.
                </p>
                <div className="sec-code-box">
                  <span className="code-fn">rover.avanzar</span>(2)<br />
                  <span className="code-fn">rover.girar_derecha</span>()<br />
                  <span className="code-green">rover.minar</span>()
                </div>
              </div>

              <div className="sec-mechanic-card">
                <div className="sec-mechanic-icon">02</div>
                <h4>Bucles y Repetición</h4>
                <p>
                  Optimiza tu código evitando repetir las mismas órdenes. Usa bucles para recolectar
                  minerales de múltiples depósitos de forma automática.
                </p>
                <div className="sec-code-box">
                  <span className="code-keyword">while</span> <span className="code-fn">rover.tiene_energia</span>():<br />
                  &nbsp;&nbsp;<span className="code-fn">rover.avanzar</span>(1)<br />
                  &nbsp;&nbsp;<span className="code-green">rover.transferir</span>()
                </div>
              </div>

              <div className="sec-mechanic-card">
                <div className="sec-mechanic-icon">03</div>
                <h4>Condicionales y Sensores</h4>
                <p>
                  Haz que tu rover tome decisiones según los obstáculos y el estado de la nave. Si
                  encuentras un cráter o mineral, reacciona en tiempo real.
                </p>
                <div className="sec-code-box">
                  <span className="code-keyword">if</span> <span className="code-fn">rover.detecta_roca</span>():<br />
                  &nbsp;&nbsp;<span className="code-fn">rover.esquivar</span>()<br />
                  <span className="code-keyword">else</span>:<br />
                  &nbsp;&nbsp;<span className="code-green">rover.continuar</span>()
                </div>
              </div>
            </div>

            {/* Banner resumen didáctico con Spid */}
            <div className="sec-mechanics-summary">
              <div className="sec-mechanics-summary-face">
                <img
                  src="/images/spidocode/spid-smile.png"
                  alt="Spid con expresión alegre al resolver el código"
                  className="sec-mechanics-face-img"
                  width="1024"
                  height="788"
                />
              </div>
              <div className="sec-mechanics-summary-text">
                <h5>Cada instrucción le enseña algo nuevo a Spid</h5>
                <p>
                  Consulta el Archivo A.D.A. para profundizar en la documentación pedagógica, guías
                  de bucles, condicionales y diseño del juego.
                </p>
              </div>
              <a href="/docs" className="sec-mechanics-docs-link">
                Consultar Archivo A.D.A.
              </a>
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
                <h5>Juego</h5>
                <ul>
                  <li>
                    <a href="#inicio">Inicio</a>
                  </li>
                  <li>
                    <a href="#descargas">Descargar Beta</a>
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
                <h5>Documentación</h5>
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
