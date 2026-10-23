import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function LoginModal() {
  const { isLoggedIn, setIsLoggedIn, showToast } = useApp();
  const [email, setEmail] = useState('ravi@knotnex.org');
  const [password, setPassword] = useState('••••••••••••');

  if (isLoggedIn) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
    showToast('Signed in successfully as Organization Admin!', 'success');
  };

  return (
    <div className="login-screen open" id="loginScreen" style={{ display: 'flex' }}>
      <div className="login-card">
        <div className="login-logo">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <div>
          <h2 className="login-title">Knotbox Organization Admin</h2>
          <p className="login-desc">Sign in with your administrator credentials</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left', width: '100%' }}>
          <div className="form-group">
            <label className="form-label">Admin Email</label>
            <input
              type="email"
              className="form-input"
              id="loginEmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              id="loginPass"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            id="btnPerformLogin"
            style={{ justifyContent: 'center', height: '44px', marginTop: '6px', width: '100%' }}
          >
            <span>Log In to Admin Dashboard</span>
          </button>
        </form>

        <div style={{ fontSize: '11.5px', color: 'var(--neutral-400)' }}>
          Secured with Knotbox Enterprise SSO &amp; Multi-Factor Authentication
        </div>
      </div>
    </div>
  );
}
