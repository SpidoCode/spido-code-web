import './SimpleLanding.css'

const BETA_DOWNLOAD_URL =
  'https://github.com/SpidoCode/spido-code/releases/download/v1.0.0-beta/SPIDOCODE-Windows-x64-v1.0.0-beta.zip'
const BETA_RELEASE_URL = 'https://github.com/SpidoCode/spido-code/releases/tag/v1.0.0-beta'

export default function SpidoCodeGamePage() {
  return (
    <div className="simple-site">
      <header className="simple-nav">
        <div className="simple-container simple-nav-inner">
          <a href="/" className="simple-brand" aria-label="SPIDOCODE">
            SPIDO<span>CODE</span>
          </a>

          <nav className="simple-nav-links" aria-label="Navegación SpidoCode">
            <a href="/">Volver a Inicio</a>
            <a href="/spidocode-0">SpidoCode 0 (Bloques)</a>
            <a href="/docs">A.D.A</a>
          </nav>

          <div className="simple-nav-cta-group">
            <a href={BETA_DOWNLOAD_URL} className="simple-btn-primary">
              Descargar Beta
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* Banner Hero SpidoCode */}
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
                  Programación con Código Escrito Real
                </span>
                <h1 className="sec-hero-title">
                  Spido<span>Code</span>
                </h1>
                <p className="sec-hero-subtitle">
                  La experiencia completa de ingeniería y computación. Escribe código real en
                  GDScript, automatiza tareas espaciales y pon a prueba tus algoritmos en un entorno
                  tridimensional.
                </p>

                <div className="sec-hero-actions">
                  <a href={BETA_DOWNLOAD_URL} className="simple-btn-primary" style={{ padding: '14px 26px' }}>
                    Descargar Beta Windows x64
                  </a>
                  <a href="/spidocode-0" className="simple-btn-ghost" style={{ padding: '13px 22px' }}>
                    Ver SpidoCode 0 (Bloques)
                  </a>
                </div>
              </div>

              <div className="sec-hero-visual">
                {/* Espacio reservado para el icono oficial de SpidoCode */}
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
                      fontSize: '54px',
                      color: '#2b7a48',
                      lineHeight: 1,
                    }}
                  >
                    &lt;/&gt;
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
                    Icono SpidoCode
                  </span>
                  <span style={{ fontSize: '11px', color: '#717789' }}>
                    (Espacio listo para la imagen)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sección de Capturas y Detalles del Código */}
        <section
          style={{
            background: 'linear-gradient(180deg, #d4dae6 0%, #c4cbd8 50%, #b2bac9 100%)',
            padding: '85px 0 95px',
          }}
        >
          <div className="simple-container">
            <div className="sec-section-header">
              <span className="sec-section-tag">Código Auténtico</span>
              <h2 className="sec-section-title">Escribe lógica como en un editor profesional</h2>
              <p className="sec-section-desc">
                En SpidoCode no memorizas teoría abstracta: cada línea de código que escribes mueve
                los servos de Spid en tiempo real.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '32px',
                marginTop: '40px',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  borderRadius: '20px',
                  overflow: 'hidden',
                  border: '2px solid rgba(124, 187, 137, 0.45)',
                  boxShadow: '0 16px 40px rgba(76, 81, 95, 0.16)',
                }}
              >
                <img
                  src="/images/spidocode/spid-code-console.png"
                  alt="Consola de código de SpidoCode"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.88)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '20px',
                  padding: '36px 32px',
                  boxShadow: '0 12px 32px rgba(76, 81, 95, 0.1)',
                  border: '1px solid rgba(158, 160, 179, 0.35)',
                }}
              >
                <h3
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: '22px',
                    fontWeight: 700,
                    color: '#1e222d',
                    marginBottom: '16px',
                  }}
                >
                  Funciones y Lógica en GDScript
                </h3>
                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: '0 0 24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    fontSize: '15px',
                    color: '#374151',
                  }}
                >
                  <li>
                    <strong>Comandos de dirección:</strong> <code>spid.norte()</code>,{' '}
                    <code>spid.sur()</code>, <code>spid.este()</code>, <code>spid.oeste()</code>.
                  </li>
                  <li>
                    <strong>Interacción:</strong> <code>spid.minar()</code> y{' '}
                    <code>spid.transferir()</code>.
                  </li>
                  <li>
                    <strong>Estructuras de control:</strong> Bucles <code>while</code> y condiciones{' '}
                    <code>if</code> con sensores en vivo.
                  </li>
                  <li>
                    <strong>Depuración paso a paso:</strong> Pausa y ejecuta instrucción a instrucción
                    para entender el flujo de control.
                  </li>
                </ul>

                <a
                  href={BETA_DOWNLOAD_URL}
                  className="simple-btn-primary"
                  style={{ padding: '14px 24px', display: 'inline-block' }}
                >
                  Descargar Beta para Windows x64
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Footer simple */}
        <footer className="sec-footer" style={{ borderTop: 'none', marginTop: '-1px' }}>
          <div className="simple-container" style={{ textAlign: 'center' }}>
            <p style={{ margin: '0 0 16px', color: '#8c96a8' }}>
              © 2026 <strong>SPIDOCODE</strong> — Videojuego educativo de programación en código real
            </p>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
              <a href="/" style={{ color: '#00ff66', textDecoration: 'none', fontWeight: 600 }}>
                Volver al Inicio
              </a>
              <a href="/spidocode-0" style={{ color: '#ffffff', textDecoration: 'none' }}>
                SpidoCode 0 (Bloques)
              </a>
              <a href={BETA_RELEASE_URL} target="_blank" rel="noopener noreferrer" style={{ color: '#8c96a8', textDecoration: 'none' }}>
                Releases en GitHub
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
