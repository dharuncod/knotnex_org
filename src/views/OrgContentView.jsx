import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ContentGridSkeleton } from '../components/skeletons';

export default function OrgContentView() {
  const { contentPosts, openModal, showToast } = useApp();
  const [activeTab, setActiveTab] = useState('all');
  const [isTabLoading, setIsTabLoading] = useState(false);

  const handleTabChange = (newTab) => {
    if (newTab === activeTab) return;
    setIsTabLoading(true);
    setActiveTab(newTab);
    setTimeout(() => {
      setIsTabLoading(false);
    }, 260);
  };

  const filtered = contentPosts.filter(c => {
    if (activeTab === 'all') return true;
    if (activeTab === 'posts') return c.type === 'Article';
    if (activeTab === 'media') return c.type === 'Media';
    if (activeTab === 'announce') return c.type === 'Announcement';
    return true;
  });

  return (
    <section className="app-view active" id="viewOrgContent">
      <header className="content-header">
        <div className="header-title-group">
          <div className="header-icon-box">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </div>
          <div className="header-text-group">
            <h1 className="page-title">Organisation Content</h1>
            <p className="page-subtitle">Publish articles, manage media assets, and broadcast urgent announcements.</p>
          </div>
        </div>
        <div className="header-actions">
          <button
            className="btn-primary"
            id="btnOpenCreateContentModal"
            onClick={() => openModal('modalCreateContent')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Create Content</span>
          </button>
        </div>
      </header>

      <div className="segmented-tabs-wrapper">
        <button
          className={`segmented-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => handleTabChange('all')}
        >
          All Content ({contentPosts.length})
        </button>
        <button
          className={`segmented-tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
          id="tabContentPosts"
          onClick={() => handleTabChange('posts')}
        >
          Articles ({contentPosts.filter(c => c.type === 'Article').length})
        </button>
        <button
          className={`segmented-tab-btn ${activeTab === 'media' ? 'active' : ''}`}
          id="tabContentMedia"
          onClick={() => handleTabChange('media')}
        >
          Media Assets ({contentPosts.filter(c => c.type === 'Media').length})
        </button>
        <button
          className={`segmented-tab-btn ${activeTab === 'announce' ? 'active' : ''}`}
          id="tabContentAnnounce"
          onClick={() => handleTabChange('announce')}
        >
          Announcements ({contentPosts.filter(c => c.type === 'Announcement').length})
        </button>
      </div>

      {isTabLoading ? (
        <div style={{ padding: '16px 0' }}>
          <ContentGridSkeleton count={4} />
        </div>
      ) : (
        <div className="table-container" id="contentPostsContainer">
          <div className="table-scroll">
            <table className="data-table">
              <thead>
              <tr>
                <th>Title &amp; Summary</th>
                <th>Category</th>
                <th>Published By</th>
                <th>Date</th>
                <th>Status</th>
                <th className="action-cell" />
              </tr>
            </thead>
            <tbody id="contentPostsTableBody">
              {filtered.map(item => (
                <tr key={item.id}>
                  <td><strong>{item.title}</strong></td>
                  <td>
                    <span className={`status-badge ${item.type === 'Media' ? 'completed' : (item.type === 'Announcement' ? 'danger' : 'ongoing')}`}>
                      {item.type}
                    </span>
                  </td>
                  <td>{item.author}</td>
                  <td>{item.date}</td>
                  <td>
                    <span className="status-badge active">{item.status}</span>
                  </td>
                  <td className="action-cell">
                    <button
                      className="btn-row-action"
                      title="Content options"
                      onClick={() => showToast(`Options for ${item.title}`)}
                      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>more_vert</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )}
    </section>
  );
}
