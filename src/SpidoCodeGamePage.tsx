import { Nav, Footer, NeonSpeckles, BETA_DOWNLOAD_URL, BETA_RELEASE_URL } from './SimpleLanding'
import './SimpleLanding.css'

export default function SpidoCodeGamePage() {
  return (
    <div className="simple-site">
      <Nav />

      <main id="contenido">
        {/* ========================================================
            HERO: TARJETA CENTRAL DESTACADA DE SPIDOCODE
            Fondo gris claro con degradé suave y tarjeta centrada
            ======================================================== */}
        <section className="game-hero-section">
          <div className="simple-container">
            <div className="game-central-card">
              <span className="game-central-badge">
                Programación con Sintaxis y Bucles (Código Real)
              </span>

              <h1 className="game-central-title">
                SPIDO<span>CODE</span>
              </h1>

              <p className="game-central-tagline">
                El siguiente paso en tu viaje de ingeniería espacial. Domina el código escrito en
                GDScript, automatiza rutinas complejas con bucles <code>while</code> y programa
                a <strong>Spid</strong> para superar desafíos autónomos en asteroides 3D.
              </p>

              {/* Parte para la foto: Portada oficial de SpidoCode en proporción panorámica 16:9 */}
              <div className="game-central-photo-frame">
                <img
                  src="/images/spidocode/spidocode-cover.jpg"
                  alt="Portada oficial de SpidoCode con el rover Spid sobre un asteroide mirando al espacio"
                  className="game-central-photo-img"
                  width="1024"
                  height="576"
                />
              </div>

              {/* Links de descarga y acciones */}
              <div className="game-central-actions">
                <a
                  href={BETA_DOWNLOAD_URL}
                  className="btn-download-hero"
                  aria-label="Descargar Beta de SpidoCode para Windows x64"
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
                <a href="/spidocode-0" className="simple-btn-ghost">
                  Ver SpidoCode 0 (Bloques)
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECCIÓN EXPLICATIVA: SINTAXIS Y BUCLES
            Explicación detallada de código real y automatización
            ======================================================== */}
        <section className="game-explanation-section">
          <div className="simple-container">
            <div className="sec-section-header">
              <span className="sec-section-tag" style={{ color: '#2b7a48' }}>
                Metodología Educativa: Código Escrito
              </span>
              <h2 className="sec-section-title">
                Aprender mediante Sintaxis y Bucles
              </h2>
              <p className="sec-section-desc">
                SpidoCode lleva la lógica algorítmica al siguiente nivel introduciendo sintaxis real y
                estructuras de control de flujo. Diseñado para que la transición de bloques visuales a
                programación profesional sea intuitiva, estimulante y natural.
              </p>
            </div>

            <div className="game-features-grid">
              {/* Feature 1: Sintaxis Real */}
              <div className="game-feature-box">
                <div className="game-feature-icon">01</div>
                <h3 className="game-feature-title">Sintaxis Real en GDScript</h3>
                <p className="game-feature-desc">
                  Escribe instrucciones directas en la consola como <code>spid.norte()</code>,{' '}
                  <code>spid.minar()</code> y <code>spid.transferir()</code>. Aprenderás las convenciones
                  de la programación moderna: llamadas a métodos con paréntesis, parámetros y sangrías
                  estructuradas sin ambigüedades.
                </p>
              </div>

              {/* Feature 2: El Poder de los Bucles */}
              <div className="game-feature-box">
                <div className="game-feature-icon">02</div>
                <h3 className="game-feature-title">El Poder de los Bucles (Loops)</h3>
                <p className="game-feature-desc">
                  Automatiza la exploración utilizando estructuras de repetición como{' '}
                  <code>while spid.minerales_en_nave() &lt; 20:</code>. Los bucles permiten que Spid
                  ejecute tareas repetitivas de forma autónoma sin necesidad de reescribir código manualmente.
                </p>
              </div>

              {/* Feature 3: Condicionales y Sensores */}
              <div className="game-feature-box">
                <div className="game-feature-icon">03</div>
                <h3 className="game-feature-title">Condicionales y Sensores en Tiempo Real</h3>
                <p className="game-feature-desc">
                  Evalúa el entorno del asteroide con sentencias <code>if spid.hay_mineral():</code> y
                  lecturas de sensores frontales. Tu código toma decisiones inteligentes en tiempo real según
                  el terreno y los recursos disponibles.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECCIÓN INFERIOR: DEGRADÉ A OSCURO CON NEÓN & PUENTE A SPIDOCODE 0
            ======================================================== */}
        <section className="game-deep-section">
          <NeonSpeckles count={20} />

          <div className="simple-container" style={{ position: 'relative', zIndex: 2 }}>
            <div className="game-switch-card">
              <div>
                <span
                  style={{
                    display: 'inline-block',
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'var(--color-neon-green)',
                    marginBottom: '8px',
                  }}
                >
                  Fundamentos Visuales
                </span>
                <h3
                  style={{
                    fontFamily: "'Spido Pixel', 'Pixelify Sans', monospace",
                    fontSize: '28px',
                    color: '#ffffff',
                    margin: '0 0 10px',
                  }}
                >
                  ¿Prefieres comenzar desde las bases?
                </h3>
                <p style={{ color: '#d1d7e2', fontSize: '15px', lineHeight: 1.6, margin: 0, maxWidth: '580px' }}>
                  Si nunca has programado o quieres una experiencia más visual antes de escribir código en texto,
                  prueba <strong>SpidoCode 0</strong>. Conecta órdenes lógicas y resuelve acertijos mediante bloques
                  interactivos sin errores de sintaxis.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <a href="/spidocode-0" className="simple-btn-primary" style={{ padding: '14px 24px' }}>
                  Conocer SpidoCode 0
                </a>
                <a href="/#inicio" className="simple-btn-ghost" style={{ padding: '13px 20px' }}>
                  Volver a Inicio
                </a>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  )
}
