import { Nav, Footer, NeonSpeckles, BETA_DOWNLOAD_URL, BETA_RELEASE_URL } from './SimpleLanding'
import './SimpleLanding.css'

export default function SpidoCodeZeroPage() {
  return (
    <div className="simple-site">
      <Nav />

      <main id="contenido">
        {/* ========================================================
            HERO: TARJETA CENTRAL DESTACADA DE SPIDOCODE 0
            Fondo gris claro con degradé suave y tarjeta centrada
            ======================================================== */}
        <section className="game-hero-section">
          <div className="simple-container">
            <div className="game-central-card">
              <span className="game-central-badge">
                Programación con Bloques y Algoritmos
              </span>

              <h1 className="game-central-title">
                SPIDOCODE <span>0</span>
              </h1>

              <p className="game-central-tagline">
                La puerta de entrada al pensamiento computacional. Guía a <strong>Spid</strong> mediante
                bloques visuales interactivos, construyendo secuencias lógicas y resolviendo
                acertijos espaciales sin la frustración de la sintaxis escrita.
              </p>

              {/* Parte para la foto: Portada oficial de SpidoCode 0 en proporción panorámica 16:9 */}
              <div className="game-central-photo-frame">
                <img
                  src="/images/spidocode/spidocode-0-cover.jpg"
                  alt="Portada oficial de SpidoCode 0 con Spid y el astronauta en el hangar"
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
                  aria-label="Descargar Beta de SpidoCode 0 para Windows x64"
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
                <a href="/spidocode" className="simple-btn-ghost">
                  Ver SpidoCode (Código Real)
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECCIÓN EXPLICATIVA: BLOQUES Y ALGORITMOS
            Explicación detallada de la metodología pedagógica
            ======================================================== */}
        <section className="game-explanation-section">
          <div className="simple-container">
            <div className="sec-section-header">
              <span className="sec-section-tag" style={{ color: '#2b7a48' }}>
                Metodología Educativa
              </span>
              <h2 className="sec-section-title">
                Aprender mediante Bloques y Algoritmos
              </h2>
              <p className="sec-section-desc">
                SpidoCode 0 transforma conceptos abstractos de ingeniería en piezas visuales intuitivas.
                Los estudiantes aprenden a pensar como programadores formulando algoritmos eficaces
                antes de enfrentarse al código escrito.
              </p>
            </div>

            <div className="game-features-grid">
              {/* Feature 1: Bloques Visuales */}
              <div className="game-feature-box">
                <div className="game-feature-icon">01</div>
                <h3 className="game-feature-title">Bloques Visuales de Acción</h3>
                <p className="game-feature-desc">
                  Arrastra bloques como <code>Avanzar</code>, <code>Girar izquierda</code>, <code>Girar derecha</code>,
                  y <code>Minar mineral</code>. Cada bloque representa una orden concreta y elimina por completo
                  los errores de puntuación, mayúsculas o paréntesis.
                </p>
              </div>

              {/* Feature 2: Construcción de Algoritmos */}
              <div className="game-feature-box">
                <div className="game-feature-icon">02</div>
                <h3 className="game-feature-title">Construcción de Algoritmos</h3>
                <p className="game-feature-desc">
                  Un algoritmo es una serie de instrucciones ordenadas para resolver un problema. En SpidoCode 0,
                  los jugadores descomponen desafíos complejos en pequeños pasos lógicos para guiar a Spid a su meta.
                </p>
              </div>

              {/* Feature 3: Bucles y Condiciones Gráficas */}
              <div className="game-feature-box">
                <div className="game-feature-icon">03</div>
                <h3 className="game-feature-title">Bucles y Condiciones Visuales</h3>
                <p className="game-feature-desc">
                  Descubre cómo optimizar secuencias envolviendo bloques en contenedores de <code>Repetir</code> y
                  toma de decisiones <code>Si hay mineral</code>, enseñando al rover a reaccionar a su entorno espacial.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECCIÓN INFERIOR: DEGRADÉ A OSCURO CON NEÓN & PUENTE A SPIDOCODE
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
                  Siguiente Nivel de Aprendizaje
                </span>
                <h3
                  style={{
                    fontFamily: "'Spido Pixel', 'Pixelify Sans', monospace",
                    fontSize: '28px',
                    color: '#ffffff',
                    margin: '0 0 10px',
                  }}
                >
                  ¿Listo para pasar al código real?
                </h3>
                <p style={{ color: '#d1d7e2', fontSize: '15px', lineHeight: 1.6, margin: 0, maxWidth: '580px' }}>
                  Cuando domines los bloques en SpidoCode 0, da el salto a <strong>SpidoCode</strong>, donde esos mismos
                  algoritmos se escriben con sintaxis auténtica en GDScript, bucles <code>while</code> y condicionales.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <a href="/spidocode" className="simple-btn-primary" style={{ padding: '14px 24px' }}>
                  Conocer SpidoCode
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
