import './SimpleLanding.css'

export default function SpidoCodeZeroPage() {
  return (
    <div className="simple-site">
      <header className="simple-nav">
        <div className="simple-container simple-nav-inner">
          <a href="/" className="simple-brand" aria-label="SPIDOCODE">
            SPIDO<span>CODE 0</span>
          </a>

          <nav className="simple-nav-links" aria-label="Navegación SpidoCode 0">
            <a href="/">Volver a Inicio</a>
            <a href="/spidocode">SpidoCode (Código)</a>
            <a href="/docs">A.D.A</a>
          </nav>

          <div className="simple-nav-cta-group">
            <a href="/" className="simple-btn-primary">
              Volver al Portal
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* Banner Hero SpidoCode 0 */}
        <section
          className="sec-hero"
          style={{
            background: 'linear-gradient(180deg, #eef1f6 0%, #e2e7ef 50%, #d4dae6 100%)',
            padding: '70px 0 85px',
          }}
        >
          <div className="simple-container">
            <div className="sec-hero-grid">
              <div className="sec-hero-copy">
                <span className="sec-section-tag" style={{ color: '#2b7a48' }}>
                  Aprende con Bloques Visuales
                </span>
                <h1 className="sec-hero-title">
                  SpidoCode <span>0</span>
                </h1>
                <p className="sec-hero-subtitle">
                  La puerta de entrada al pensamiento computacional. Aprende a programar guiando a
                  Spid mediante <strong>bloques visuales interactivos</strong>, conectando acciones,
                  bucles y condiciones sin la barrera de la sintaxis escrita.
                </p>

                <div className="sec-hero-actions">
                  <a href="/" className="simple-btn-primary" style={{ padding: '14px 26px' }}>
                    Volver a Inicio
                  </a>
                  <a href="/spidocode" className="simple-btn-ghost" style={{ padding: '13px 22px' }}>
                    Ver versión con Código Real
                  </a>
                </div>
              </div>

              <div className="sec-hero-visual">
                {/* Espacio reservado para el icono oficial de SpidoCode 0 */}
                <div
                  style={{
                    width: '240px',
                    height: '240px',
                    borderRadius: '40px',
                    background: 'linear-gradient(135deg, #ffffff 0%, #eef3fa 100%)',
                    border: '3px dashed rgba(124, 187, 137, 0.7)',
                    boxShadow: '0 20px 48px rgba(76, 81, 95, 0.16)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    padding: '20px',
                    textAlign: 'center',
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Spido Pixel', 'Pixelify Sans', monospace",
                      fontSize: '64px',
                      color: '#2b7a48',
                      lineHeight: 1,
                    }}
                  >
                    0
                  </span>
                  <span
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#4c515f',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Icono SpidoCode 0
                  </span>
                  <span style={{ fontSize: '11px', color: '#717789' }}>
                    (Espacio listo para la imagen)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sección de Explicación y Metodología */}
        <section
          style={{
            background: 'linear-gradient(180deg, #d4dae6 0%, #c4cbd8 50%, #b2bac9 100%)',
            padding: '85px 0 95px',
          }}
        >
          <div className="simple-container">
            <div className="sec-section-header">
              <span className="sec-section-tag">Metodología Pedagógica</span>
              <h2 className="sec-section-title">¿Cómo funciona SpidoCode 0?</h2>
              <p className="sec-section-desc">
                Inspirado en la filosofía de entornos como Scratch y Lightbot, SpidoCode 0 transforma
                los algoritmos en rompecabezas lógicos palpables.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '28px',
                marginTop: '40px',
              }}
            >
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.85)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '20px',
                  padding: '32px 28px',
                  boxShadow: '0 12px 32px rgba(76, 81, 95, 0.1)',
                  border: '1px solid rgba(158, 160, 179, 0.35)',
                }}
              >
                <h3
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: '20px',
                    fontWeight: 700,
                    color: '#1e222d',
                    marginBottom: '12px',
                  }}
                >
                  Bloques de Secuencia
                </h3>
                <p style={{ fontSize: '15px', color: '#4c515f', lineHeight: 1.6, margin: 0 }}>
                  Arrastra bloques para indicar hacia dónde debe avanzar Spid (Norte, Sur, Este,
                  Oeste) y qué acción ejecutar (Minar, Recolectar o Transferir a la nave).
                </p>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.85)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '20px',
                  padding: '32px 28px',
                  boxShadow: '0 12px 32px rgba(76, 81, 95, 0.1)',
                  border: '1px solid rgba(158, 160, 179, 0.35)',
                }}
              >
                <h3
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: '20px',
                    fontWeight: 700,
                    color: '#1e222d',
                    marginBottom: '12px',
                  }}
                >
                  Bucles y Repetición
                </h3>
                <p style={{ fontSize: '15px', color: '#4c515f', lineHeight: 1.6, margin: 0 }}>
                  Comprende el concepto de iteración envolviendo bloques de acción dentro de
                  contenedores de repetición, optimizando tus soluciones al mínimo número de pasos.
                </p>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.85)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '20px',
                  padding: '32px 28px',
                  boxShadow: '0 12px 32px rgba(76, 81, 95, 0.1)',
                  border: '1px solid rgba(158, 160, 179, 0.35)',
                }}
              >
                <h3
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: '20px',
                    fontWeight: 700,
                    color: '#1e222d',
                    marginBottom: '12px',
                  }}
                >
                  Toma de Decisiones
                </h3>
                <p style={{ fontSize: '15px', color: '#4c515f', lineHeight: 1.6, margin: 0 }}>
                  Enseña a Spid a responder al entorno con condicionales visuales: "Si hay mineral,
                  minar; si el camino está bloqueado, girar".
                </p>
              </div>
            </div>

            {/* Comparativa con SpidoCode */}
            <div
              style={{
                marginTop: '50px',
                background: '#ffffff',
                borderRadius: '24px',
                padding: '36px',
                border: '2px solid rgba(124, 187, 137, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '24px',
                flexWrap: 'wrap',
              }}
            >
              <div>
                <h4
                  style={{
                    fontFamily: "'Spido Pixel', 'Pixelify Sans', monospace",
                    fontSize: '26px',
                    margin: '0 0 8px',
                    color: '#1e222d',
                  }}
                >
                  ¿Listo para el siguiente paso?
                </h4>
                <p style={{ margin: 0, color: '#4c515f', fontSize: '15px', maxWidth: '640px' }}>
                  Cuando domines los bloques en SpidoCode 0, podrás dar el salto a <strong>SpidoCode</strong>,
                  donde esos mismos conceptos se escriben en código real basado en GDScript.
                </p>
              </div>
              <a href="/spidocode" className="simple-btn-primary" style={{ padding: '14px 24px' }}>
                Conoce SpidoCode
              </a>
            </div>
          </div>
        </section>

        {/* Footer simple */}
        <footer className="sec-footer" style={{ borderTop: 'none', marginTop: '-1px' }}>
          <div className="simple-container" style={{ textAlign: 'center' }}>
            <p style={{ margin: '0 0 16px', color: '#8c96a8' }}>
              © 2026 <strong>SPIDOCODE 0</strong> — Aprendizaje de programación basado en bloques
            </p>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
              <a href="/" style={{ color: '#00ff66', textDecoration: 'none', fontWeight: 600 }}>
                Volver al Inicio
              </a>
              <a href="/spidocode" style={{ color: '#ffffff', textDecoration: 'none' }}>
                SpidoCode (Código Real)
              </a>
              <a href="/docs" style={{ color: '#8c96a8', textDecoration: 'none' }}>
                Archivo A.D.A.
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
