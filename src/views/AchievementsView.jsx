import React from 'react';
import { useApp } from '../context/AppContext';

export default function AchievementsView() {
  const { achievements, openModal, showToast } = useApp();

  return (
    <section className="app-view active" id="viewAchievements">
      <header className="content-header">
        <div className="header-title-group">
          <div className="header-icon-box">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="7" />
              <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
            </svg>
          </div>
          <div className="header-text-group">
            <h1 className="page-title">Achievements &amp; Honors</h1>
            <p className="page-subtitle">Showcase milestones, awards, accreditations, and global recognition.</p>
          </div>
        </div>
        <div className="header-actions">
          <button
            className="btn-primary"
            id="btnOpenAddAchievementModal"
            onClick={() => openModal('modalAddAchievement')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Add Achievement</span>
          </button>
        </div>
      </header>

      <div className="content-grid-3" id="achievementsCardGrid">
        {achievements.map(ach => (
          <div key={ach.id} className="content-card">
            <div className="card-banner-wrapper achievement" style={{ height: '110px', background: 'linear-gradient(135deg, #FEF08A 0%, #FDE047 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#854D0E" strokeWidth="2">
                <circle cx="12" cy="8" r="7" />
                <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
              </svg>
              <span className="status-badge card-badge-top" style={{ position: 'absolute', top: '12px', right: '12px', background: '#FFFFFF', color: '#B54708', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>star</span>
                <span>{ach.date}</span>
              </span>
            </div>

            <div className="card-body" style={{ padding: '16px' }}>
              <div className="card-title" style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>
                {ach.title}
              </div>
              <div className="card-meta-row" style={{ fontSize: '12px', color: 'var(--neutral-500)', marginBottom: '8px' }}>
                <span>Awarded by: <strong>{ach.body}</strong></span>
              </div>
              <div className="card-description" style={{ fontSize: '12.5px', color: '#4B5563', lineHeight: 1.4 }}>
                {ach.desc}
              </div>
            </div>

            <div className="card-footer" style={{ padding: '12px 16px', borderTop: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11.5px', color: '#12B76A', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>verified</span>
                <span>Verified Citation</span>
              </span>
              <button
                className="btn-icon-square"
                style={{ width: '28px', height: '28px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                title="Share Certificate"
                onClick={() => showToast('Citation certificate copied to clipboard!', 'success')}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>share</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
