'use client';

export default function CVPage() {
  return (
    <div style={{ background: '#383b40', minHeight: '100vh', padding: '30px 10px' }}>
      <div style={{ maxWidth: '850px', margin: '0 auto 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <a
          href="/"
          style={{
            color: '#00f7ff',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '600',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          ← Return to Portfolio
        </a>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => window.print()}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              background: '#00b4d8',
              color: '#03131c',
              fontWeight: '700',
              border: 'none',
              cursor: 'pointer',
              fontSize: '13px'
            }}
          >
            Print / Save as PDF
          </button>
          <a
            href="/Payal_Resume.pdf"
            download="Payal_Ghosh_CV.pdf"
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              background: '#00f7ff',
              color: '#03131c',
              fontWeight: '700',
              textDecoration: 'none',
              fontSize: '13px'
            }}
          >
            Download PDF
          </a>
        </div>
      </div>

      <iframe
        src="/resume.html"
        style={{
          width: '100%',
          maxWidth: '900px',
          height: '1180px',
          margin: '0 auto',
          display: 'block',
          border: 'none',
          borderRadius: '8px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)'
        }}
        title="Payal Ghosh 1:1 Official CV"
      />
    </div>
  );
}
