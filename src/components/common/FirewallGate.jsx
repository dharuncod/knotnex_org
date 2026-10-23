import React, { useMemo } from 'react';

export default function FirewallGate({ onBypassDev, ssoError }) {
  const isLocalhost =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname.startsWith('192.168.') ||
      window.location.hostname.startsWith('10.'));

  // Detect current browser / environment
  const detectedBrowser = useMemo(() => {
    if (typeof window === 'undefined') return 'Web Browser';
    const ua = navigator.userAgent;
    if (/Edg\//i.test(ua)) return 'Microsoft Edge';
    if (/Chrome\//i.test(ua) && !/Edg\//i.test(ua)) return 'Google Chrome';
    if (/Firefox\//i.test(ua)) return 'Mozilla Firefox';
    if (/Safari\//i.test(ua) && !/Chrome\//i.test(ua)) return 'Apple Safari';
    if (/OPR\//i.test(ua)) return 'Opera';
    return 'Standard Web Browser';
  }, []);

  const handleRetry = () => {
    window.location.reload();
  };

  const handleOpenApp = () => {
    // Attempt deep link scheme to launch the KnotNex Flutter app
    window.location.href = 'knotnex://organization/dashboard';
    setTimeout(() => {
      // Fallback intent if app isn't installed
      alert('If KnotNex is installed, it will open automatically. Otherwise, please open the KnotNex App and tap "Manage Organization".');
    }, 1500);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at top, #1a0b2e 0%, #0d0618 60%, #05020a 100%)',
        color: '#ffffff',
        fontFamily: "'Google Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        padding: '24px 16px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          maxWidth: '560px',
          width: '100%',
          background: 'rgba(255, 255, 255, 0.04)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRadius: '28px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '44px 36px',
          textAlign: 'center',
          boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.7), 0 0 40px rgba(99, 54, 235, 0.15)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Glow accent */}
        <div
          style={{
            position: 'absolute',
            top: '-80px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '240px',
            height: '160px',
            background: 'radial-gradient(circle, rgba(99, 54, 235, 0.35) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Shield Icon Badge */}
        <div
          style={{
            width: '74px',
            height: '74px',
            borderRadius: '22px',
            background: 'linear-gradient(135deg, #6336eb 0%, #8b5cf6 50%, #d946ef 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 22px',
            boxShadow: '0 12px 30px rgba(99, 54, 235, 0.5)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <svg
            width="38"
            height="38"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
          </svg>
        </div>

        {/* Title & Domain Tag */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: '700', color: '#a78bfa', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            org.knotnex.com
          </span>
          <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            Restricted Enclave
          </span>
        </div>

        <h1
          style={{
            fontSize: '26px',
            fontWeight: '800',
            letterSpacing: '-0.5px',
            margin: '0 0 12px 0',
            color: '#ffffff',
          }}
        >
          Direct Browser Access Prohibited
        </h1>

        {/* Detected Browser Warning Chip */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '14px',
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            color: '#fca5a5',
            fontSize: '12.5px',
            fontWeight: '600',
            marginBottom: '20px',
          }}
        >
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
          Detected: {detectedBrowser} (External Browser)
        </div>

        {/* SSO Error Banner if Present */}
        {ssoError ? (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '14px',
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#fecaca',
              fontSize: '13px',
              fontWeight: '500',
              marginBottom: '20px',
              textAlign: 'left',
            }}
          >
            <strong>Authentication Failed:</strong> {ssoError}. Please return to the KnotNex Mobile App to generate a fresh launch token.
          </div>
        ) : null}

        <p
          style={{
            fontSize: '14px',
            color: '#cbd5e1',
            lineHeight: 1.6,
            margin: '0 0 24px 0',
          }}
        >
          For maximum security and attendee data protection, this administrative console cannot be accessed directly via web browsers (Chrome, Edge, Safari, Firefox).
          Access is strictly authorized through verified sessions launched from the <strong>KnotNex Mobile App</strong>.
        </p>

        {/* Instructions Container */}
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.35)',
            borderRadius: '18px',
            padding: '20px 22px',
            textAlign: 'left',
            marginBottom: '26px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div
            style={{
              fontSize: '13px',
              fontWeight: '700',
              color: '#e2e8f0',
              marginBottom: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2.5">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            Authorized Launch Steps:
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span
              style={{
                background: 'linear-gradient(135deg, #6336eb, #9333ea)',
                color: '#fff',
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: '700',
                flexShrink: 0,
              }}
            >
              1
            </span>
            <span style={{ fontSize: '13px', color: '#e2e8f0', lineHeight: 1.45 }}>
              Open your <strong>KnotNex Mobile Application</strong> on your device.
            </span>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span
              style={{
                background: 'linear-gradient(135deg, #6336eb, #9333ea)',
                color: '#fff',
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: '700',
                flexShrink: 0,
              }}
            >
              2
            </span>
            <span style={{ fontSize: '13px', color: '#e2e8f0', lineHeight: 1.45 }}>
              Navigate to <strong>Profile &gt; Organization Dashboard</strong>.
            </span>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <span
              style={{
                background: 'linear-gradient(135deg, #6336eb, #9333ea)',
                color: '#fff',
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: '700',
                flexShrink: 0,
              }}
            >
              3
            </span>
            <span style={{ fontSize: '13px', color: '#e2e8f0', lineHeight: 1.45 }}>
              Tap <strong>"org.knotnex.com"</strong> in the top-right header to launch the biometric SSO session.
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={handleOpenApp}
            style={{
              width: '100%',
              padding: '14px 20px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #6336eb 0%, #7c3aed 100%)',
              color: '#ffffff',
              border: 'none',
              fontWeight: '700',
              fontSize: '14.5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 8px 20px rgba(99, 54, 235, 0.4)',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
              <line x1="12" y1="18" x2="12.01" y2="18" />
            </svg>
            Open in KnotNex Mobile App
          </button>

          <button
            onClick={handleRetry}
            style={{
              width: '100%',
              padding: '11px 20px',
              borderRadius: '14px',
              background: 'rgba(255, 255, 255, 0.06)',
              color: '#cbd5e1',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              fontWeight: '600',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)')}
            onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)')}
          >
            Check Authentication Handshake
          </button>
        </div>

        {/* Developer Bypass (Visible exclusively on Localhost) */}
        {isLocalhost && (
          <div
            style={{
              marginTop: '24px',
              borderTop: '1px dashed rgba(251, 191, 36, 0.4)',
              paddingTop: '20px',
            }}
          >
            <div style={{ fontSize: '12px', color: '#fbbf24', marginBottom: '8px', fontWeight: '700' }}>
              🔧 Localhost Developer Sandbox Mode
            </div>
            <p style={{ fontSize: '11.5px', color: '#94a3b8', margin: '0 0 12px 0' }}>
              Bypasses SSO verification for local testing on port 5173 / localhost. (Disabled in production).
            </p>
            <button
              onClick={onBypassDev}
              style={{
                width: '100%',
                padding: '10px 16px',
                borderRadius: '12px',
                background: 'rgba(251, 191, 36, 0.15)',
                color: '#fef08a',
                border: '1px solid rgba(251, 191, 36, 0.35)',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              Continue to Local Dev Console
            </button>
          </div>
        )}

        {/* Footer Security Badge */}
        <div
          style={{
            marginTop: '28px',
            paddingTop: '18px',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            fontSize: '11.5px',
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Protected by KnotNex Biometric SSO & Cloud Enclave
        </div>
      </div>
    </div>
  );
}
