import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CampaignCardsSkeleton } from '../components/skeletons';
import SearchBar from '../components/common/SearchBar';

export default function CampaignsView() {
  const { campaigns, openModal, showToast } = useApp();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isTabLoading, setIsTabLoading] = useState(false);

  const handleFilterChange = (newFilter) => {
    if (newFilter === filter) return;
    setIsTabLoading(true);
    setFilter(newFilter);
    setTimeout(() => {
      setIsTabLoading(false);
    }, 260);
  };

  const filtered = campaigns.filter(c => {
    if (filter !== 'all' && c.status !== filter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const match = c.title.toLowerCase().includes(q) ||
        (c.audience && c.audience.toLowerCase().includes(q)) ||
        (c.desc && c.desc.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  return (
    <section className="app-view active" id="viewCampaigns">
      <header className="content-header">
        <div className="header-title-group">
          <div className="header-icon-box">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
          <div className="header-text-group">
            <h1 className="page-title">Campaigns</h1>
            <p className="page-subtitle">Track organizational fundraising, outreach targets, and community initiatives.</p>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn-primary" id="btnOpenCreateCampaignModal" onClick={() => openModal('modalCreateCampaign')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Create Campaign</span>
          </button>
        </div>
      </header>

      <div className="filter-toolbar">
        <div className="filter-left-controls">
          <button
            className={`filter-chip-btn ${filter === 'all' ? 'active-dropdown' : ''}`}
            onClick={() => handleFilterChange('all')}
          >
            All Campaigns ({campaigns.length})
          </button>
          <button
            className={`filter-chip-btn ${filter === 'active' ? 'active-dropdown' : ''}`}
            onClick={() => handleFilterChange('active')}
          >
            Active ({campaigns.filter(c => c.status === 'active').length})
          </button>
          <button
            className={`filter-chip-btn ${filter === 'completed' ? 'active-dropdown' : ''}`}
            onClick={() => handleFilterChange('completed')}
          >
            Completed ({campaigns.filter(c => c.status === 'completed').length})
          </button>
        </div>
        <div className="filter-right-controls">
          <SearchBar
            id="campaignsSearchInput"
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            width="320px"
          />
        </div>
      </div>

      {isTabLoading ? (
        <CampaignCardsSkeleton count={6} />
      ) : (
        <div className="content-grid-3" id="campaignsCardGrid">
          {filtered.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: 'var(--neutral-500)' }}>
              No campaigns found matching your criteria.
            </div>
          ) : (
          filtered.map(c => {
            const raised = c.raised || 0;
            const goal = c.goal || 10000;
            const pct = Math.min(100, Math.round((raised / goal) * 100));
            return (
              <div key={c.id} className="content-card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="card-banner-wrapper" style={{ height: '110px', background: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '42px', color: '#6336EB' }}>campaign</span>
                  <span
                    className="status-badge card-badge-top"
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: c.status === 'active' ? '#ECFDF3' : '#F2F4F7',
                      color: c.status === 'active' ? '#12B76A' : '#475467'
                    }}
                  >
                    ● {c.status}
                  </span>
                </div>

                <div className="card-body" style={{ padding: '16px', flex: 1 }}>
                  <div className="card-title" style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '6px' }}>
                    {c.title}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--neutral-500)', marginBottom: '10px' }}>
                    Target Audience: <strong>{c.audience}</strong>
                  </div>
                  <div className="card-description" style={{ fontSize: '12.5px', color: '#4B5563', lineHeight: 1.4, marginBottom: '16px' }}>
                    {c.desc}
                  </div>

                  {/* Progress bar */}
                  <div style={{ marginTop: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                      <span style={{ color: '#12B76A' }}>${raised.toLocaleString()} raised</span>
                      <span style={{ color: 'var(--neutral-500)' }}>${goal.toLocaleString()}</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: '#F2F4F7', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: '#6336EB', borderRadius: '9999px' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: 'var(--neutral-400)', marginTop: '6px' }}>
                      <span>{c.supporters || 0} Supporters</span>
                      <span>{pct}% Funded</span>
                    </div>
                  </div>
                </div>

                <div className="card-footer" style={{ padding: '12px 16px', borderTop: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button
                    className="btn-secondary"
                    style={{ height: '30px', padding: '0 10px', fontSize: '12px' }}
                    onClick={() => showToast(`Opening donation & campaign manager for ${c.title}`)}
                  >
                    Manage
                  </button>
                  <button
                    className="btn-icon-square"
                    style={{ width: '30px', height: '30px' }}
                    title="Share Campaign"
                    onClick={() => showToast(`Campaign link for ${c.title} copied!`)}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>share</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    )}
    </section>
  );
}
