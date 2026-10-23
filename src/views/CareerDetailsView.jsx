import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import BackButton from '../components/common/BackButton';
import { getJobPoster, getUserAvatar } from '../data/initialData';
import { AttendeesTableSkeleton } from '../components/skeletons';
import SearchBar from '../components/common/SearchBar';
import { downloadCSV } from '../utils/csvExport';
import { downloadCandidateResume } from '../utils/resumeDownload';
import jobsApi from '../api/jobsApi';




export default function CareerDetailsView() {
  const {
    selectedJob,
    navigateTo,
    showToast,
    startEditJob,
    deleteJob
  } = useApp();

  const [candidateList, setCandidateList] = useState([]);
  const [candidateSearch, setCandidateSearch] = useState('');
  const [candidateFilter, setCandidateFilter] = useState('all');
  const [isTabLoading, setIsTabLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (selectedJob?.id) {
      jobsApi.getJobApplications(selectedJob.id).then(apps => {
        if (isMounted) {
          const mapped = (apps || []).map((a, idx) => ({
            id: String(a.id || `app-${idx + 1}`),
            appId: `#APP-${String(a.id || idx + 1001).substring(0, 6).toUpperCase()}`,
            name: a.user_name || a.full_name || a.name || 'Candidate',
            email: a.user_email || a.email || 'N/A',
            phone: a.phone || '+91 98765 43210',
            headline: a.headline || a.qualification || 'Applicant',
            resume: a.resume_url || 'Resume Document',
            city: a.location || a.city || 'India',
            appliedDate: a.created_at ? new Date(a.created_at).toLocaleDateString() : 'Recent',
            stage: a.stage || a.status || 'Applied',
            avatar: getUserAvatar(a, idx)
          }));
          setCandidateList(mapped);
        }
      }).catch(() => {
        if (isMounted) setCandidateList([]);
      });
    } else {
      setCandidateList([]);
    }
    return () => { isMounted = false; };
  }, [selectedJob?.id]);

  const handleFilterChange = (newFilter) => {
    if (newFilter === candidateFilter) return;
    setIsTabLoading(true);
    setCandidateFilter(newFilter);
    setTimeout(() => {
      setIsTabLoading(false);
    }, 260);
  };

  if (!selectedJob) {
    return (
      <section className="app-view active" id="viewCareerDetails">
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h2>No career opportunity selected</h2>
          <div style={{ marginTop: '16px' }}>
            <BackButton onClick={() => navigateTo('careers')} />
          </div>
        </div>
      </section>
    );
  }

  const job = selectedJob;
  const poster = getJobPoster(job);
  const totalApplicants = Number(job.applicantsCount || job.applications) || candidateList.length;
  const capacity = Number(job.capacity) || 25;
  const pct = capacity > 0 ? Math.min(100, Math.round((totalApplicants / capacity) * 100)) : 72;

  const shortlistedCount = candidateList.filter(c => c.stage === 'Shortlisted').length;
  const interviewCount = candidateList.filter(c => c.stage === 'Interviewing').length;
  const reviewCount = candidateList.filter(c => c.stage === 'In Review').length;
  const offeredCount = candidateList.filter(c => c.stage === 'Offered').length;

  const handleToggleStage = (candidateId) => {
    setCandidateList(prev =>
      prev.map(c => {
        if (c.id === candidateId) {
          let nextStage = 'Shortlisted';
          if (c.stage === 'Shortlisted') nextStage = 'Interviewing';
          else if (c.stage === 'Interviewing') nextStage = 'Offered';
          else if (c.stage === 'Offered') nextStage = 'In Review';
          else nextStage = 'Shortlisted';

          showToast(`Candidate ${c.name} moved to ${nextStage}!`, 'success');
          return { ...c, stage: nextStage };
        }
        return c;
      })
    );
  };

  const handleExportCSV = () => {
    const headers = ['#', 'Applicant', 'Current Role', 'Email', 'Phone', 'Application ID', 'Resume', 'City / State', 'Applied Date', 'Stage'];
    const rows = filteredCandidates.map((c, idx) => [
      String(idx + 1).padStart(2, '0'),
      c.name,
      c.headline,
      c.email,
      c.phone,
      c.appId,
      c.resume,
      c.city,
      c.appliedDate,
      c.stage
    ]);
    downloadCSV(`${job.title.toLowerCase().replace(/\s+/g, '_')}_applicants.csv`, headers, rows);
    showToast(`Exported ${job.title} applicant roster!`, 'success');
  };

  const filteredCandidates = candidateList.filter(cand => {
    if (candidateFilter === 'shortlisted' && cand.stage !== 'Shortlisted') return false;
    if (candidateFilter === 'interview' && cand.stage !== 'Interviewing') return false;
    if (candidateFilter === 'review' && cand.stage !== 'In Review') return false;
    if (candidateFilter === 'offered' && cand.stage !== 'Offered') return false;

    if (candidateSearch) {
      const q = candidateSearch.toLowerCase();
      const match = (cand.name || '').toLowerCase().includes(q) ||
        (cand.headline || '').toLowerCase().includes(q) ||
        (cand.email || '').toLowerCase().includes(q) ||
        (cand.phone || '').toLowerCase().includes(q) ||
        (cand.appId || '').toLowerCase().includes(q) ||
        (cand.city || '').toLowerCase().includes(q) ||
        (cand.resume || '').toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <section className="app-view active" id="viewCareerDetails">
      <div className="event-details-wrapper">

        {/* 1. Breadcrumb Navigation */}
        <nav className="event-breadcrumb-bar" aria-label="Breadcrumb">
          <span className="breadcrumb-link" id="bcCareersHome" onClick={() => navigateTo("dashboard")}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            </svg>
            <span>Dashboard</span>
          </span>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-link" id="bcManageCareers" onClick={() => navigateTo("careers")}>Careers</span>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current" id="bcCurrentJobTitle">{job.title}</span>
        </nav>

        {/* 2. Top Header Toolbar */}
        <header className="event-header-top">
          <div className="event-title-cluster">
            <button
              className="btn-back-circle"
              id="btnBackToCareers"
              onClick={() => navigateTo("careers")}
              title="Back to Careers"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <div className="event-detail-poster-wrap" id="indJobPosterWrap" title="Role Poster">
              <img src={poster} id="indJobPosterImg" alt={job.title} className="event-detail-poster-img" />
            </div>
            <div className="event-heading-text">
              <div className="event-main-title">
                <span id="indJobTitle">{job.title}</span>
              </div>
              <p className="event-sub-desc" id="indJobSubtitle">
                {job.tagline || job.description || "Lead end-to-end user experience, design systems, and interaction architectures."}
              </p>
            </div>
          </div>

          <div className="event-header-actions-group">
            <button
              className="btn-header-action secondary"
              id="btnExportJobApplicants"
              onClick={handleExportCSV}
              title="Export candidate roster"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span>Export</span>
            </button>
            <button
              className="btn-header-action secondary"
              id="btnOpenEditJobModal"
              onClick={() => {
                if (startEditJob) {
                  startEditJob(job);
                } else {
                  navigateTo('createOpportunity');
                }
              }}
              title="Edit opportunity parameters"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
              <span>Edit Opportunity</span>
            </button>
            <button
              className="btn-header-action secondary"
              style={{ color: '#E11D48', borderColor: '#FECDD3' }}
              id="btnDeleteJob"
              onClick={async () => {
                if (window.confirm(`Are you sure you want to delete "${job.title}"? This action cannot be undone.`)) {
                  if (deleteJob) {
                    await deleteJob(job.id);
                  }
                  navigateTo('careers');
                }
              }}
              title="Delete this opportunity"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
              <span>Delete</span>
            </button>
          </div>
        </header>

        {/* 3. Hero Banner Card */}
        <div className="event-hero-banner-card">
          <div className="event-hero-content">
            <div className="event-hero-top-row">
              <div className="event-hero-main-info">
                <div className="event-hero-meta-chips">
                  <span className="hero-meta-chip category">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                      <polyline points="2 17 12 22 22 17"></polyline>
                      <polyline points="2 12 12 17 22 12"></polyline>
                    </svg>
                    <span id="indJobHeroDept">{job.dept || 'Engineering'}</span>
                  </span>
                  <span className="hero-meta-chip">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="3"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                      <path d="M9 16l2 2 4-4"></path>
                    </svg>
                    <span id="indJobHeroExp">{job.experience || '4+ Yrs Exp'} · {job.postedDate || 'Sep 2026'}</span>
                  </span>
                  <span className="hero-meta-chip">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 21c-4.5-4.5-7-8.5-7-12a7 7 0 1 1 14 0c0 3.5-2.5 7.5-7 12z"></path>
                      <circle cx="12" cy="9" r="2.5"></circle>
                    </svg>
                    <span id="indJobHeroLoc">{job.location || 'Remote / Hybrid'}</span>
                  </span>
                  <span className="hero-meta-chip">
                    <span style={{ fontWeight: "700", color: "#6336EB" }}>{job.salary || '₹28 - 36 LPA'}</span>
                    <span style={{ color: "var(--neutral-500)", fontSize: "11px" }}>/ {job.type || 'Full-time'}</span>
                  </span>
                </div>

                <p className="event-hero-description" id="indJobDesc">
                  {job.description || "The flagship opening leading end-to-end architecture, technical implementation, and high-impact distributed systems across Knotbox civic intelligence platforms."}
                </p>
              </div>

              <div className="event-hero-capacity-box">
                <div className="hero-capacity-header">
                  <span className="hero-capacity-title">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6336EB" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                    </svg>
                    <span>Capacity Fill</span>
                  </span>
                  <span className="hero-capacity-pct" id="heroJobCapacityPctText">{pct}%</span>
                </div>
                <div className="hero-capacity-bar-track">
                  <div className="hero-capacity-bar-fill" id="heroJobCapacityBarFill" style={{ width: `${pct}%` }}></div>
                </div>
                <div className="hero-capacity-footer">
                  <span className="hero-capacity-seats" id="heroJobCapacitySeatsText">{totalApplicants.toLocaleString()} / {capacity.toLocaleString()} Seats</span>
                  <span id="heroJobRemainingSeatsText">{Math.max(0, capacity - totalApplicants).toLocaleString()} Left</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Metric / KPI Stat Grid */}
        <div className="module-stat-grid">
          <div className="module-stat-card" id="cardJobTotalApplicants" title="Total registered candidates">
            <div className="module-stat-card-top">
              <div className="module-stat-icon-wrap brand">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
            </div>
            <div className="module-stat-info">
              <span className="module-stat-label">Total Applicants</span>
              <div className="module-stat-value-row">
                <span className="module-stat-value" id="jobMetricTotalRegistrations">{totalApplicants.toLocaleString()}</span>
                <span className="module-stat-unit">Candidates</span>
              </div>
              <div className="module-stat-subtext" id="jobSubtextReg">{pct}% of {capacity.toLocaleString()} total candidate pool</div>
            </div>
          </div>

          <div className="module-stat-card" id="cardJobTotalComp" title="Compensation budget">
            <div className="module-stat-card-top">
              <div className="module-stat-icon-wrap brand">
                <span style={{ fontSize: "18px", fontWeight: "700", lineHeight: "1" }}>₹</span>
              </div>
            </div>
            <div className="module-stat-info">
              <span className="module-stat-label">Compensation Range</span>
              <div className="module-stat-value-row">
                <span className="module-stat-value" id="jobMetricTotalRevenue">{job.salary || '₹28 - 36 LPA'}</span>
              </div>
              <div className="module-stat-subtext" id="jobSubtextRev">Fixed + performance incentive</div>
            </div>
          </div>

          <div className="module-stat-card" id="cardJobTurnout" title="Screening turnout & interviews">
            <div className="module-stat-card-top">
              <div className="module-stat-icon-wrap amber">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
            </div>
            <div className="module-stat-info">
              <span className="module-stat-label">Shortlisted Candidates</span>
              <div className="module-stat-value-row">
                <span className="module-stat-value" id="jobMetricTurnout">{shortlistedCount}</span>
                <span className="module-stat-unit">Profiles</span>
              </div>
              <div className="module-stat-subtext" id="jobSubtextTurnout">Passed initial recruiter screening</div>
            </div>
          </div>

          <div className="module-stat-card" id="cardJobInquiries" title="Candidate interviews">
            <div className="module-stat-card-top">
              <div className="module-stat-icon-wrap blue">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" />
                  <path d="M16 21V5a2 2 0 0 1-2-2h-4a2 2 0 0 1-2 2v16" />
                </svg>
              </div>
            </div>
            <div className="module-stat-info">
              <span className="module-stat-label">Interviews Active</span>
              <div className="module-stat-value-row">
                <span className="module-stat-value" id="jobMetricInquiries">{interviewCount}</span>
                <span className="module-stat-unit">Rounds</span>
              </div>
              <div className="module-stat-subtext">Technical &amp; culture assessment</div>
            </div>
          </div>
        </div>

        {/* 5. Applicant Roster Console */}
        <div className="attendee-console-card">
          <div className="attendee-console-top-bar">
            <div className="attendee-count-cluster">
              <span className="attendee-count-number" id="indApplicantsCount">{candidateList.length}</span>
              <span className="attendee-count-label">Job Applicants</span>
            </div>

            <div className="attendee-status-filter-pills">
              <button
                className={`attendee-filter-pill-btn ${candidateFilter === 'all' ? 'active' : ''}`}
                onClick={() => handleFilterChange('all')}
              >
                All ({candidateList.length})
              </button>
              <button
                className={`attendee-filter-pill-btn ${candidateFilter === 'shortlisted' ? 'active' : ''}`}
                onClick={() => handleFilterChange('shortlisted')}
              >
                Shortlisted ({shortlistedCount})
              </button>
              <button
                className={`attendee-filter-pill-btn ${candidateFilter === 'review' ? 'active' : ''}`}
                onClick={() => handleFilterChange('review')}
              >
                In Review ({reviewCount})
              </button>
              <button
                className={`attendee-filter-pill-btn ${candidateFilter === 'interview' ? 'active' : ''}`}
                onClick={() => handleFilterChange('interview')}
              >
                Interviewing ({interviewCount})
              </button>
              <button
                className={`attendee-filter-pill-btn ${candidateFilter === 'offered' ? 'active' : ''}`}
                onClick={() => handleFilterChange('offered')}
              >
                Offered ({offeredCount})
              </button>
            </div>

            <div className="attendee-console-actions">
              <SearchBar
                id="indJobCandidateSearch"
                placeholder="Search candidates by name, email, role..."
                value={candidateSearch}
                onChange={(e) => setCandidateSearch(e.target.value)}
                width="340px"
              />
            </div>
          </div>

          <div className="table-responsive-wrapper" style={{ overflowX: "auto" }}>
            {isTabLoading ? (
              <AttendeesTableSkeleton rows={6} />
            ) : (
              <table className="recent-products-table" id="indJobCandidatesTable">
                <colgroup>
                  <col style={{ width: "48px" }} />
                  <col style={{ width: "27%" }} />
                  <col style={{ width: "27%" }} />
                  <col style={{ width: "16%" }} />
                  <col style={{ width: "16%" }} />
                  <col style={{ width: "14%" }} />
                </colgroup>
                <thead>
                  <tr>
                    <th className="col-center" style={{ width: "48px", color: "var(--neutral-400)", fontSize: "11px" }}>#</th>
                    <th>Candidate</th>
                    <th>Applied Position</th>
                    <th>Date Applied</th>
                    <th>Status</th>
                    <th className="col-right">Resume</th>
                  </tr>
                </thead>
                <tbody id="indJobCandidatesTableBody">
                  {filteredCandidates.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center", padding: "36px", color: "var(--neutral-500)" }}>
                        No candidates found matching the current search or filter.
                      </td>
                    </tr>
                  ) : (
                    filteredCandidates.map((cand, idx) => {
                      return (
                        <tr key={cand.id || idx}>
                          <td className="col-center" style={{ textAlign: "center", color: "var(--neutral-400)", fontWeight: 600, fontSize: "12px" }}>
                            {(idx + 1).toString().padStart(2, '0')}
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <img
                                src={getUserAvatar(cand, idx)}
                                alt={cand.name}
                                style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }}
                              />
                              <div>
                                <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>
                                  {cand.name}
                                </div>
                                <div style={{ fontSize: '11.5px', color: 'var(--text-tertiary)' }}>
                                  {cand.email || 'candidate@knotnex.org'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>
                            {cand.role || cand.appliedPosition || job.title}
                          </td>
                          <td style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                            {cand.appliedDate || cand.date || 'Recent'}
                          </td>
                          <td>
                            <span
                              className="status-badge"
                              style={{
                                background: (cand.stage || cand.status || '').toLowerCase().includes('shortlist') ? '#ECFDF3' : ((cand.stage || cand.status || '').toLowerCase().includes('interview') ? '#EFF8FF' : '#FFFBEB'),
                                color: (cand.stage || cand.status || '').toLowerCase().includes('shortlist') ? '#12B76A' : ((cand.stage || cand.status || '').toLowerCase().includes('interview') ? '#175CD3' : '#B54708'),
                                fontSize: '11px',
                                padding: '2px 8px',
                                borderRadius: '9999px',
                                fontWeight: 500
                              }}
                            >
                              ● {cand.stage || cand.status || 'Under Review'}
                            </span>
                          </td>
                          <td className="col-right" style={{ verticalAlign: "middle" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                              <button
                                type="button"
                                className="btn-secondary"
                                style={{
                                  height: "30px",
                                  padding: "0 12px",
                                  fontSize: "12px",
                                  fontWeight: 600,
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "6px",
                                  cursor: "pointer"
                                }}
                                onClick={() => {
                                  const filename = downloadCandidateResume(cand);
                                  showToast(`Downloaded resume: ${filename}`, 'success');
                                }}
                                title={`Download ${cand.name}'s resume`}
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
                      );
                    })
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
