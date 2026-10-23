import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function OrgProfileView() {
  const { orgProfile, updateOrgProfile, setOrgProfile, setIsLoggedIn, showToast } = useApp();

  const [formData, setFormData] = useState(orgProfile);

  const handleSave = (e) => {
    e.preventDefault();
    if (updateOrgProfile) {
      updateOrgProfile(formData);
    } else {
      setOrgProfile(formData);
      showToast(`Saved changes for ${formData.name}!`, 'success');
    }
  };

  return (
    <section className="app-view active" id="viewOrgProfile">
      <header className="content-header">
        <div className="header-title-group">
          <div className="header-icon-box">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div className="header-text-group">
            <h1 className="page-title">Organisation Profile</h1>
            <p className="page-subtitle">Manage legal entity details, official contacts, and compliance documents.</p>
          </div>
        </div>
        <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button className="btn-primary" id="btnSaveOrgProfile" onClick={handleSave}>
            <span>Save Profile</span>
          </button>
          <button
            type="button"
            className="btn-settings-logout-action"
            id="btnOrgProfileLogout"
            onClick={() => {
              setIsLoggedIn(false);
              showToast('Logged out of admin console');
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Log out</span>
          </button>
        </div>
      </header>

      <div className="form-card">
        <form onSubmit={handleSave}>
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Organisation Legal Name</label>
              <input
                type="text"
                className="form-input"
                id="profileOrgName"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Registration / Tax ID</label>
              <input
                type="text"
                className="form-input"
                id="profileRegNo"
                value={formData.taxId || formData.regNumber || ''}
                placeholder="e.g. GSTIN / CIN / Tax Registration"
                onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Official Email</label>
              <input
                type="email"
                className="form-input"
                id="profileEmail"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Contact Phone</label>
              <input
                type="text"
                className="form-input"
                id="profilePhone"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Headquarters Address</label>
            <input
              type="text"
              className="form-input"
              id="profileAddress"
              value={formData.headquarters || ''}
              onChange={(e) => setFormData({ ...formData, headquarters: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Organisation Bio &amp; Mission Statement</label>
            <textarea
              className="form-textarea"
              id="profileBio"
              rows="4"
              value={formData.bio || ''}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Compliance Documents (PDF)</label>
            <div className="file-dropzone">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <div style={{ fontSize: '13px', fontWeight: 500 }}>Certificate_of_Incorporation_2026.pdf (Uploaded)</div>
              <div style={{ fontSize: '11.5px', color: 'var(--neutral-500)' }}>Drag and drop replacement documents or click to browse</div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
