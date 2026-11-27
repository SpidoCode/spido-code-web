import { useEffect, useMemo, useRef, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'
import './SimpleLanding.css'

export const BETA_DOWNLOAD_URL =
  'https://github.com/SpidoCode/spido-code/releases/download/v1.0.0-beta/SPIDOCODE-Windows-x64-v1.0.0-beta.zip'
export const BETA_RELEASE_URL = 'https://github.com/SpidoCode/spido-code/releases/tag/v1.0.0-beta'

// El texto real siempre permanece en el árbol accesible; solo cambia su copia decorativa.
function EncryptedLabel({ text, duration = 405, immediate = false, title = false }: {
  text: string; duration?: number; immediate?: boolean; title?: boolean
}) {
  const label = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(text)
  useEffect(() => {
    const element = label.current
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!element || reduced.matches) return
    let timer: ReturnType<typeof setInterval> | undefined
    let started = false
    const finish = () => { clearInterval(timer); setDisplay(text) }
    const steps = Math.ceil(duration / 45)
    const scramble = (step: number) => setDisplay([...text].map((character, index) =>
      /\s/.test(character) || index < text.length * step / steps
        ? character : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 36)]).join(''))
    const play = () => {
      if (started) return
      started = true
      let step = 0
      scramble(step)
      timer = setInterval(() => {
        step += 1
        if (step >= steps) { finish(); return }
        scramble(step)
      }, 45)
    }
    let observer: IntersectionObserver | undefined
    if (immediate) play()
    else if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(entries => {
        if (!entries.some(entry => entry.isIntersecting)) return
        observer?.disconnect()
        play()
      }, { threshold: 0.15 })
      observer.observe(element)
    }
    const onPreference = () => { if (reduced.matches) { observer?.disconnect(); finish() } }
    reduced.addEventListener('change', onPreference)
    return () => { observer?.disconnect(); clearInterval(timer); reduced.removeEventListener('change', onPreference) }
  }, [text, duration, immediate])
  if (title) {
    let offset = 0
    return <span ref={label} className="motion-title-text"><span className="motion-title-accessible">{text}</span><span aria-hidden="true">{text.split(/(\s+)/).map((word, wordIndex) => {
      if (/^\s+$/.test(word)) { offset += word.length; return word }
      const start = offset
      offset += word.length
      return <span className="motion-title-word" key={wordIndex}>{[...word].map((character, index) => <span className="motion-title-glyph" key={index}><span className="motion-title-reserve">{character}</span><span className="motion-title-display">{display[start + index]}</span></span>)}</span>
    })}</span></span>
  }
  return <span ref={label} className="motion-label"><span>{text}</span><span aria-hidden="true" className="motion-label-display">{display}</span></span>
}

// Generador de pintas y destellos verdes neón para la Sección 3
export function NeonSpeckles({ count = 16 }: { count?: number }) {
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

export function Nav() {
  const [session, setSession] = useState<Session | null>(null)
  const [checking, setChecking] = useState(true)
  const [busy, setBusy] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const mounted = useRef(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 15)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
    <header className={`simple-nav ${scrolled ? 'simple-nav-scrolled' : ''}`}>
      <div className="simple-container simple-nav-inner">
        <a href="/#inicio" className="simple-brand" aria-label="SPIDOCODE" data-motion-card="2">
          SPIDO<span>CODE</span>
        </a>

        <nav className="simple-nav-links" aria-label="Navegación principal">
          <a href="/#inicio">Inicio</a>
          <a href="/#juegos">Juegos</a>
          <a href="/#ada">A.D.A</a>
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
  const site = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const root = site.current
    if (!root) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const pointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    const revealed = new WeakSet<Element>()
    let dispose = () => {}
    const setup = () => {
      dispose()
      if (reduced.matches) { dispose = () => {}; return }
      const animations: Animation[] = []
      const cleanups: Array<() => void> = []
      if ('IntersectionObserver' in window && typeof root.animate === 'function') {
        const observer = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) return
            observer.unobserve(entry.target)
            if (revealed.has(entry.target)) return
            revealed.add(entry.target)
            if (entry.target.contains(document.activeElement)) return
            animations.push(entry.target.animate([
              { opacity: 0.15, transform: 'translateY(22px)' },
              { opacity: 1, transform: 'translateY(0)' },
            ], { duration: 700, easing: 'cubic-bezier(.2,.7,.3,1)' }))
          })
        }, { threshold: 0.15 })
        // Solo contenido: las secciones y sus degradados nunca se vuelven transparentes.
        root.querySelectorAll([
          '.sec-section-header', '.game-app-info', '.game-app-icon-slot',
          '.lightbot-four-title', '.lightbot-four-img',
          '.lightbot-learn-list-clean', '.sec-download-btn-group',
          '.lightbot-card > img', '.lightbot-companion-face img', '.lightbot-speech-bubble',
          '.lightbot-card > h3', '.lightbot-card > p', '.lightbot-card > a',
        ].join(',')).forEach(content => observer.observe(content))
        cleanups.push(() => observer.disconnect())
      }
      if (pointer.matches) root.querySelectorAll<HTMLElement>('[data-motion-card]:not(.motion-info-block)').forEach(card => {
        const maximum = Math.min(5, Math.max(0, Number(card.dataset.motionCard) || 3))
        const lift = card.classList.contains('game-app-card') ? 4 : 2
        let frame = 0
        let bounds: DOMRect | undefined
        const reset = () => {
          cancelAnimationFrame(frame)
          card.style.removeProperty('transform')
          card.style.removeProperty('--motion-shadow-x')
          card.style.removeProperty('--motion-shadow-y')
          bounds = undefined
        }
        const move = (event: PointerEvent) => {
          if (event.pointerType !== 'mouse') { reset(); return }
          if (card.matches(':focus-visible') || card.querySelector(':focus-visible')) return
          bounds ??= card.getBoundingClientRect()
          const x = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1))
          const y = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1))
          cancelAnimationFrame(frame)
          frame = requestAnimationFrame(() => {
            card.style.transform = `perspective(950px) translateY(-${lift}px) rotateX(${-y * maximum}deg) rotateY(${x * maximum}deg)`
            card.style.setProperty('--motion-shadow-x', `${-x * 7}px`)
            card.style.setProperty('--motion-shadow-y', `${16 - y * 4}px`)
          })
        }
        card.addEventListener('pointermove', move)
        card.addEventListener('pointerleave', reset)
        card.addEventListener('pointercancel', reset)
        card.addEventListener('focusin', reset)
        cleanups.push(() => {
          reset()
          card.removeEventListener('pointermove', move)
          card.removeEventListener('pointerleave', reset)
          card.removeEventListener('pointercancel', reset)
          card.removeEventListener('focusin', reset)
        })
      })
      const stopOnFocus = () => animations.forEach(animation => animation.cancel())
      root.addEventListener('focusin', stopOnFocus)
      dispose = () => { cleanups.forEach(cleanup => cleanup()); stopOnFocus(); root.removeEventListener('focusin', stopOnFocus) }
    }
    setup()
    reduced.addEventListener('change', setup)
    pointer.addEventListener('change', setup)
    return () => { dispose(); reduced.removeEventListener('change', setup); pointer.removeEventListener('change', setup) }
  }, [])

  const [adaHintLevel, setAdaHintLevel] = useState<1 | 2 | 3>(1)
  const [adaCodeMode, setAdaCodeMode] = useState<'error' | 'success'>('error')

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div ref={site} className="simple-site motion-experience">
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
                  <EncryptedLabel text="Aprende a programar" duration={1100} immediate title /> <span><EncryptedLabel text="explorando el espacio." duration={1100} immediate title /></span>
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
                </div>
              </div>

              <div className="sec-hero-visual" data-motion-card="3">
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
              <h2 className="sec-section-title"><EncryptedLabel text="Juegos" duration={650} title /></h2>
              <p className="sec-section-desc">
                Explora nuestras dos modalidades de aprendizaje: desde la lógica visual con bloques
                hasta la programación real con código escrito.
              </p>
            </div>

            <div className="games-apps-grid">
              {/* Juego 1: SpidoCode 0 (Bloques) */}
              <div className="game-app-card" data-motion-card="5">
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
              <div className="game-app-card" data-motion-card="5">
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
            SECCIÓN 3: COPILOTO TÁCTICO A.D.A.
            Pistas escalonadas y simulación de código interactivo
            ======================================================== */}
        <section id="ada" className="sec-mechanics">
          <NeonSpeckles count={20} />

          <div className="simple-container" style={{ position: 'relative', zIndex: 2 }}>
            <div className="sec-section-header">
              <span className="sec-section-tag"><EncryptedLabel text="Soporte Táctico // A.D.A." /></span>
              <h2 className="sec-section-title"><EncryptedLabel text="Sistema A.D.A" duration={650} title /></h2>
              <p className="sec-section-desc">
                En SpidoCode el error es parte del aprendizaje. Cuando tu código falla, A.D.A. activa
                pistas pedagógicas escalonadas en 3 niveles para guiar tu razonamiento sin frustración.
              </p>
            </div>

            <div className="ada-showcase-grid">
              {/* Columna Izquierda: Consola Interactiva de GDScript */}
              <div className="ada-terminal-card" data-motion-card="2.5">
                <div className="ada-terminal-header">
                  <div className="ada-terminal-dots">
                    <span className="ada-dot ada-dot-red" />
                    <span className="ada-dot ada-dot-yellow" />
                    <span className="ada-dot ada-dot-green" />
                    <span className="ada-terminal-title">CONSOLA SPID // GDScript</span>
                  </div>
                  <div className="ada-terminal-modes">
                    <button
                      type="button"
                      className={`ada-mode-btn ${adaCodeMode === 'error' ? 'is-active is-error' : ''}`}
                      onClick={() => { setAdaCodeMode('error'); setAdaHintLevel(1) }}
                    >
                      Error Detectado
                    </button>
                    <button
                      type="button"
                      className={`ada-mode-btn ${adaCodeMode === 'success' ? 'is-active is-success' : ''}`}
                      onClick={() => { setAdaCodeMode('success'); setAdaHintLevel(3) }}
                    >
                      Código Corregido
                    </button>
                  </div>
                </div>

                <div className="ada-terminal-body">
                  <div className="ada-code-lines">
                    {adaCodeMode === 'error' ? (
                      <>
                        <div className="ada-code-line"><span className="ada-line-num">1</span><span className="ada-comment"># MISIÓN: EXTRACCIÓN EN ASTEROIDE 2X3</span></div>
                        <div className="ada-code-line"><span className="ada-line-num">2</span><span className="ada-kw">while</span> spid.tiene_espacio():</div>
                        <div className="ada-code-line ada-code-line-error"><span className="ada-line-num">3</span>    spid.minar() <span className="ada-error-tag"># [!] ERROR: CASILLA ESTÉRIL</span></div>
                        <div className="ada-code-line"><span className="ada-line-num">4</span>    spid.norte(1)</div>
                      </>
                    ) : (
                      <>
                        <div className="ada-code-line"><span className="ada-line-num">1</span><span className="ada-comment"># MISIÓN: EXTRACCIÓN EN ASTEROIDE 2X3</span></div>
                        <div className="ada-code-line"><span className="ada-line-num">2</span><span className="ada-kw">while</span> spid.tiene_espacio():</div>
                        <div className="ada-code-line ada-code-line-success"><span className="ada-line-num">3</span>    <span className="ada-kw">if</span> spid.hay_mineral():</div>
                        <div className="ada-code-line ada-code-line-success"><span className="ada-line-num">4</span>        spid.minar() <span className="ada-comment"># ✓ Muestra extraída</span></div>
                        <div className="ada-code-line"><span className="ada-line-num">5</span>    spid.norte(1)</div>
                      </>
                    )}
                  </div>
                </div>

                <div className={`ada-terminal-status ${adaCodeMode === 'error' ? 'is-error' : 'is-success'}`}>
                  {adaCodeMode === 'error' ? (
                    <span>⚠️ <strong>ALERTA SENSOR:</strong> Perforación sin mineral detectado. Actuador en riesgo.</span>
                  ) : (
                    <span>✓ <strong>MISIÓN COMPLETADA:</strong> Sensor reactivo activo. 20 Minerales recolectados.</span>
                  )}
                </div>
              </div>

              {/* Columna Derecha: Tarjeta A.D.A. con el Avatar de Spid y Pistas Escalonadas */}
              <div className="ada-companion-card" data-motion-card="2.5">
                <div className="ada-companion-header">
                  <div className="ada-avatar-frame">
                    <img
                      src="/images/spidocode/spid-smile.png"
                      alt="Cara de Spid sonriente en monitor espacial"
                      className="ada-avatar-img"
                      width="80"
                      height="62"
                    />
                  </div>
                  <div>
                    <span className="ada-companion-tag">ASISTENTE DIGITAL AVANZADO</span>
                    <h3 className="ada-companion-title">Pistas Progresivas de A.D.A.</h3>
                  </div>
                </div>

                <div className="ada-hint-selector">
                  <button
                    type="button"
                    className={`ada-hint-btn ${adaHintLevel === 1 ? 'is-active' : ''}`}
                    onClick={() => setAdaHintLevel(1)}
                  >
                    <span className="ada-hint-step">01</span> Concepto
                  </button>
                  <button
                    type="button"
                    className={`ada-hint-btn ${adaHintLevel === 2 ? 'is-active' : ''}`}
                    onClick={() => setAdaHintLevel(2)}
                  >
                    <span className="ada-hint-step">02</span> Dónde mirar
                  </button>
                  <button
                    type="button"
                    className={`ada-hint-btn ${adaHintLevel === 3 ? 'is-active' : ''}`}
                    onClick={() => setAdaHintLevel(3)}
                  >
                    <span className="ada-hint-step">03</span> Solución guiada
                  </button>
                </div>

                <div className="ada-hint-box">
                  {adaHintLevel === 1 && (
                    <div className="ada-hint-content">
                      <span className="ada-hint-pill">Nivel 1 · Andamiaje Conceptual</span>
                      <p>
                        "Los depósitos minerales en este asteroide son <strong>estocásticos</strong> (aleatorios). Si perforas a ciegas sin verificar con tus sensores, Spid dañará su actuador y desperdiciará energía. Antes de actuar, pregúntate si hay mineral en la casilla."
                      </p>
                    </div>
                  )}
                  {adaHintLevel === 2 && (
                    <div className="ada-hint-content">
                      <span className="ada-hint-pill">Nivel 2 · Detección de Línea</span>
                      <p>
                        "Revisa la acción de minado en la línea 3. Antes de llamar a <code>spid.minar()</code>, necesitas evaluar una condición previa usando el sensor <code>spid.hay_mineral()</code>."
                      </p>
                    </div>
                  )}
                  {adaHintLevel === 3 && (
                    <div className="ada-hint-content">
                      <span className="ada-hint-pill">Nivel 3 · Estructura Recomendada</span>
                      <p>
                        "Envuelve la orden dentro de una condición para activar el ciclo percepción-acción:"
                      </p>
                      <pre className="ada-hint-code">
                        <code>{`if spid.hay_mineral():\n    spid.minar()`}</code>
                      </pre>
                    </div>
                  )}
                </div>

                <div className="ada-pedagogy-footer">
                  <span className="ada-pedagogy-dot" />
                  <p>
                    <strong>Metodología de Andamiaje:</strong> A.D.A. entrena tu intuición lógica paso a paso sin resolverte el desafío.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECCIÓN 4: FOOTER (COMPLETAMENTE GRIS OSCURA)
            Gris oscuro profundo y uniforme (#12141a)
            ======================================================== */}
        <Footer />
      </main>
    </div>
  )
}

export function Footer() {
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
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
            <h5>Explorar</h5>
            <ul>
              <li>
                <a href="/#inicio">Inicio</a>
              </li>
              <li>
                <a href="/#juegos">Juegos</a>
              </li>
              <li>
                <a href="/#ada">Sistema A.D.A</a>
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
  )
}
