import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getJobPoster, getUserAvatar } from '../data/initialData';
import { JobCardsSkeleton, ApplicationsTableSkeleton } from '../components/skeletons';
import SearchBar from '../components/common/SearchBar';
import { downloadCSV } from '../utils/csvExport';
import { downloadCandidateResume } from '../utils/resumeDownload';

export default function CareersView() {
  const { jobs, applications, activeSubAction, navigateTo, showToast, selectJob, updateJob } = useApp();

  const handleToggleJobActive = (job) => {
    const nextStatus = job.status === 'active' ? 'closed' : 'active';
    if (updateJob) {
      updateJob(job.id, { status: nextStatus });
    }
    showToast(`Role "${job.title}" set to ${nextStatus === 'active' ? 'Active' : 'Inactive'}`, nextStatus === 'active' ? 'success' : 'info');
  };

  const [activeTab, setActiveTab] = useState(activeSubAction === 'applications' ? 'applications' : 'jobs');
  const [searchTerm, setSearchTerm] = useState('');
  const [jobFilter, setJobFilter] = useState('all');
  const [isTabLoading, setIsTabLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setIsTabLoading(true);
    setTimeout(() => {
      setIsTabLoading(false);
      setIsRefreshing(false);
      showToast('Careers database refreshed successfully!', 'success');
    }, 400);
  };

  const handleTabChange = (newTab) => {
    if (newTab === activeTab) return;
    setIsTabLoading(true);
    setActiveTab(newTab);
    setTimeout(() => {
      setIsTabLoading(false);
    }, 280);
  };

  const handleExportCSV = () => {
    if (activeTab === 'jobs') {
      const headers = ['#', 'Position Title', 'Department', 'Location', 'Employment Type', 'Compensation', 'Applicants', 'Status'];
      const rows = filteredJobs.map((j, idx) => [
        String(idx + 1).padStart(2, '0'),
        j.title || 'Untitled Role',
        j.dept || 'General',
        j.location || 'Remote',
        j.type || 'Full-time',
        j.salary || 'Competitive',
        j.applicantsCount ?? 0,
        (j.status || 'Active').toUpperCase()
      ]);
      downloadCSV('knotnex_job_opportunities.csv', headers, rows);
      showToast('Downloaded knotnex_job_opportunities.csv', 'success');
    } else {
      const headers = ['#', 'Candidate Name', 'Role Applied', 'Email', 'Experience', 'Stage', 'Rating', 'Applied Date'];
      const rows = filteredApps.map((a, idx) => [
        String(idx + 1).padStart(2, '0'),
        a.candidate || a.name || 'Candidate',
        a.role || a.jobTitle || 'Role',
        a.email || 'N/A',
        a.exp || 'N/A',
        a.stage || a.status || 'Screening',
        a.rating ? `${a.rating}/5` : 'N/A',
        a.date || a.appliedAt || 'Recent'
      ]);
      downloadCSV('knotnex_job_applications.csv', headers, rows);
      showToast('Downloaded knotnex_job_applications.csv', 'success');
    }
  };

  const activeJobsCount = jobs.filter(j => j.status === 'active').length;
  const completedJobsCount = jobs.filter(j => j.status === 'closed' || j.status === 'completed').length;
  const totalAppsCount = applications.length;

  const filteredJobs = jobs.filter(j => {
    if (jobFilter === 'active' && j.status !== 'active') return false;
    if (jobFilter === 'completed' && j.status !== 'closed' && j.status !== 'completed') return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const match = j.title.toLowerCase().includes(q) ||
        (j.dept && j.dept.toLowerCase().includes(q)) ||
        (j.location && j.location.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  const filteredApps = applications.filter(a => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const match = (a.candidate || a.name || '').toLowerCase().includes(q) ||
        (a.role || a.jobTitle || '').toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <section className="app-view active" id="viewCareers">
      <header className="content-header">
        <div className="header-title-group">
          <div className="header-icon-box">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="7" width="20" height="14" rx="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </div>
          <div className="header-text-group">
            <h1 className="page-title">Careers &amp; Opportunities</h1>
            <p className="page-subtitle">Publish job openings and manage incoming candidate applications.</p>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn-primary" id="btnOpenCreateJobModal" onClick={() => navigateTo('createOpportunity')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Create Opportunity</span>
          </button>
        </div>
      </header>

      {/* KPI Stats */}
      <div className="module-stat-grid">
        <div className="module-stat-card" id="cardCareersActiveRoles" title="Total open positions">
          <div className="module-stat-card-top">
            <div className="module-stat-icon-wrap blue">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </div>
            <span className="badge-trend-pos" style={{ background: 'rgba(99, 54, 235, 0.08)', color: '#6336EB' }}>
              <span>{activeJobsCount} Active</span>
            </span>
          </div>
          <div className="module-stat-info">
            <span className="module-stat-label">Active Job Openings</span>
            <div className="module-stat-value-row">
              <span className="module-stat-value" id="careersMetricActiveRoles">{jobs.length}</span>
              <span className="module-stat-unit">Roles</span>
            </div>
            <div className="module-stat-subtext">Across Design, Eng &amp; Operations</div>
          </div>
        </div>

        <div className="module-stat-card" id="cardCareersApplications" title="Candidates in funnel">
          <div className="module-stat-card-top">
            <div className="module-stat-icon-wrap green">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
              </svg>
            </div>
            <span className="badge-trend-pos">
              <span>+18.4%</span>
            </span>
          </div>
          <div className="module-stat-info">
            <span className="module-stat-label">Total Applications</span>
            <div className="module-stat-value-row">
              <span className="module-stat-value" id="careersMetricApplications">{totalAppsCount}</span>
              <span className="module-stat-unit">Candidates</span>
            </div>
            <div className="module-stat-subtext">Filtered with verified portfolio links</div>
          </div>
        </div>

        <div className="module-stat-card" id="cardCareersShortlisted" title="Candidates in interview">
          <div className="module-stat-card-top">
            <div className="module-stat-icon-wrap emerald">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <span className="badge-trend-pos" style={{ background: '#F0FDF4', color: '#16A34A' }}>
              <span>Stage 2</span>
            </span>
          </div>
          <div className="module-stat-info">
            <span className="module-stat-label">Shortlisted Candidates</span>
            <div className="module-stat-value-row">
              <span className="module-stat-value" id="careersMetricShortlisted">18</span>
              <span className="module-stat-unit">Interviews</span>
            </div>
            <div className="module-stat-subtext">Technical &amp; culture rounds active</div>
          </div>
        </div>

        <div className="module-stat-card" id="cardCareersTimeToHire" title="Average recruitment cycle">
          <div className="module-stat-card-top">
            <div className="module-stat-icon-wrap amber">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <span className="badge-trend-pos" style={{ background: 'rgba(247,144,9,0.1)', color: '#B54708' }}>
              <span>Fast Track</span>
            </span>
          </div>
          <div className="module-stat-info">
            <span className="module-stat-label">Avg. Time-to-Hire</span>
            <div className="module-stat-value-row">
              <span className="module-stat-value" id="careersMetricTimeToHire">14</span>
              <span className="module-stat-unit">Days</span>
            </div>
            <div className="module-stat-subtext">From application to final offer letter</div>
          </div>
        </div>
      </div>

      {/* Main Careers Console Card */}
      <div className="sheets-console-card full-screen-width">
        <div className="sheets-console-top-bar">
          <div className="sheets-count-cluster">
            <span className="sheets-count-number">
              {activeTab === 'jobs' ? filteredJobs.length : filteredApps.length}
            </span>
            <span className="sheets-count-label">
              {activeTab === 'jobs' ? 'Job Opportunities' : 'Applications'}
            </span>
          </div>

          {activeTab === 'jobs' && (
            <div className="sheets-status-filter-pills">
              <button
                type="button"
                className={`sheets-filter-pill-btn ${jobFilter === 'all' ? 'active' : ''}`}
                id="filterJobAll"
                onClick={() => setJobFilter('all')}
              >
                All ({jobs.length})
              </button>
              <button
                type="button"
                className={`sheets-filter-pill-btn ${jobFilter === 'active' ? 'active' : ''}`}
                id="filterJobActive"
                onClick={() => setJobFilter('active')}
              >
                Active ({activeJobsCount})
              </button>
              <button
                type="button"
                className={`sheets-filter-pill-btn ${jobFilter === 'completed' ? 'active' : ''}`}
                id="filterJobCompleted"
                onClick={() => setJobFilter('completed')}
              >
                Completed ({completedJobsCount})
              </button>
            </div>
          )}

          <div className="sheets-console-actions">
            <SearchBar
              id="careersSearchInput"
              placeholder={activeTab === 'jobs' ? "Search roles, departments, locations..." : "Search candidates, roles..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              width="280px"
            />
            <button
              className="circle-action-btn"
              id="btnRefreshCareersTable"
              title="Refresh careers stream"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{
                  animation: isRefreshing ? 'spin 0.6s linear infinite' : 'none',
                  transition: 'transform 0.2s ease'
                }}
              >
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
            </button>
            <button
              className="btn-secondary"
              id="btnExportCareersCsv"
              title="Export CSV"
              onClick={handleExportCSV}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>CSV</span>
            </button>
          </div>
        </div>

        {isTabLoading ? (
          <div style={{ padding: '20px' }}>
            {activeTab === 'jobs' ? <JobCardsSkeleton count={4} /> : <ApplicationsTableSkeleton rows={5} />}
          </div>
        ) : (
          <>
            {/* Tab 1: Open Roles */}
            {activeTab === 'jobs' && (
          <div style={{ overflowX: 'auto' }}>
            <table className="recent-products-table">
              <colgroup>
                <col style={{ width: '48px' }} />
                <col style={{ width: '30%' }} />
                <col style={{ width: '16%' }} />
                <col style={{ width: '18%' }} />
                <col style={{ width: '14%' }} />
                <col style={{ width: '85px' }} />
                <col style={{ width: '90px' }} />
              </colgroup>
              <thead>
                <tr>
                  <th className="col-center" style={{ width: '48px', color: 'var(--neutral-400)', fontSize: '11px' }}>#</th>
                  <th>Position &amp; Poster</th>
                  <th>Department</th>
                  <th>Location &amp; Type</th>
                  <th>Applicants</th>
                  <th className="col-center" style={{ width: '85px', minWidth: '85px', textAlign: 'center' }}>Action</th>
                  <th className="col-center" style={{ width: '90px', minWidth: '90px', textAlign: 'center' }}>Active</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map((j, idx) => (
                  <tr
                    key={j.id || idx}
                    style={{ cursor: 'pointer' }}
                    onClick={() => selectJob(j.id)}
                  >
                    <td className="col-center" style={{ color: 'var(--neutral-400)', fontWeight: 600, fontSize: '12px' }}>
                      {(idx + 1).toString().padStart(2, '0')}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={getJobPoster(j)}
                          alt=""
                          style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #ECECEC' }}
                        />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '13.5px', color: 'var(--text-primary)' }}>
                            {j.title}
                          </div>
                          <div style={{ fontSize: '11.5px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                            {j.experience || '2+ years exp'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="status-badge-minimal" style={{ background: '#F4F3FF', color: '#5925DC', fontSize: '11px', padding: '2px 8px', borderRadius: '9999px', fontWeight: 600 }}>
                        {j.dept}
                      </span>
                    </td>
                    <td style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                      {j.location} · {j.type || 'Full-time'}
                    </td>
                    <td style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {j.applicantsCount || 0} candidates
                    </td>
                    <td className="col-center" style={{ width: '85px' }} onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <button
                          className="btn-secondary"
                          style={{ height: '30px', padding: '0 12px', fontSize: '12px' }}
                          onClick={() => selectJob(j.id)}
                        >
                          View
                        </button>
                      </div>
                    </td>
                    <td className="col-center" style={{ width: '90px', minWidth: '90px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                      <label
                        className="active-toggle-ios"
                        title={j.status === 'active' ? 'Active (Click to Deactivate)' : 'Inactive (Click to Activate)'}
                      >
                        <input
                          type="checkbox"
                          checked={j.status === 'active'}
                          onChange={() => handleToggleJobActive(j)}
                        />
                        <span className="active-toggle-slider" />
                      </label>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Candidate Applications */}
        {activeTab === 'applications' && (
          <div style={{ overflowX: 'auto' }}>
            <table className="recent-products-table">
              <colgroup>
                <col style={{ width: '48px' }} />
                <col style={{ width: '27%' }} />
                <col style={{ width: '27%' }} />
                <col style={{ width: '16%' }} />
                <col style={{ width: '16%' }} />
                <col style={{ width: '14%' }} />
              </colgroup>
              <thead>
                <tr>
                  <th className="col-center" style={{ width: '48px', color: 'var(--neutral-400)', fontSize: '11px' }}>#</th>
                  <th>Candidate</th>
                  <th>Applied Position</th>
                  <th>Date Applied</th>
                  <th>Status</th>
                  <th className="col-right">Resume</th>
                </tr>
              </thead>
              <tbody>
                {filteredApps.map((a, idx) => (
                  <tr key={a.id || idx}>
                    <td className="col-center" style={{ color: 'var(--neutral-400)', fontWeight: 600, fontSize: '12px' }}>
                      {(idx + 1).toString().padStart(2, '0')}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img
                          src={getUserAvatar(a, idx)}
                          alt=""
                          style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>
                            {a.candidate || a.name}
                          </div>
                          <div style={{ fontSize: '11.5px', color: 'var(--text-tertiary)' }}>
                            {a.email || 'candidate@knotnex.org'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>
                      {a.role || a.jobTitle}
                    </td>
                    <td style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                      {a.date || '3 days ago'}
                    </td>
                    <td>
                      <span
                        className="status-badge"
                        style={{
                          background: a.status === 'Shortlisted' ? '#ECFDF3' : (a.status === 'Interview' ? '#EFF8FF' : '#FFFBEB'),
                          color: a.status === 'Shortlisted' ? '#12B76A' : (a.status === 'Interview' ? '#175CD3' : '#B54708'),
                          fontSize: '11px',
                          padding: '2px 8px',
                          borderRadius: '9999px'
                        }}
                      >
                        ● {a.status || 'Under Review'}
                      </span>
                    </td>
                    <td className="col-right">
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <button
                          className="btn-secondary"
                          style={{
                            height: '30px',
                            padding: '0 12px',
                            fontSize: '12px',
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}
                          onClick={() => {
                            const filename = downloadCandidateResume(a);
                            showToast(`Downloaded resume: ${filename}`, 'success');
                          }}
                          title={`Download ${a.candidate || a.name}'s resume`}
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                          </svg>
                          <span>Resume</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </>
    )}
  </div>
</section>
  );
}
