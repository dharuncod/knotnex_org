import React, { useEffect } from 'react';
import BackButton from '../components/common/BackButton';
import SchemeEligibilityCriteriaCard from './SchemeEligibilityCriteriaCard';
import SchemeRequiredDocsCard from './SchemeRequiredDocsCard';
import SchemeProcessStepsCard from './SchemeProcessStepsCard';
import SchemeFaqsCard from './SchemeFaqsCard';

export default function SchemeEligibilityProcess({
  eligibilityCriteria = [],
  setEligibilityCriteria,
  requirements = [],
  setRequirements,
  applicationSteps = [],
  setApplicationSteps,
  faqs = [],
  setFaqs,
  onBackToOverview,
  onPublishComplete,
  isEditing,
  showToast
}) {
  // Always scroll to top when mounting Page 2
  useEffect(() => {
    const resetScroll = () => {
      const mainArea = document.getElementById('mainContentArea');
      if (mainArea) mainArea.scrollTop = 0;
      window.scrollTo(0, 0);
    };
    resetScroll();
    requestAnimationFrame(resetScroll);
    const t = setTimeout(resetScroll, 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 80px)', position: 'relative' }}>
      <section
        className="app-view active"
        id="viewSchemeEligibilityProcess"
        style={{
          paddingBottom: '20px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Top Header: Back Button to return to Scheme Details */}
        <div style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <BackButton
            id="btnBackToOverviewFromEligibility"
            onClick={onBackToOverview}
          />
        </div>

        {/* 2x2 Quadrant Grid: 4 Separate Cards Filling the Page Fully Without Moving */}
        <div
          className="scheme-eligibility-quad-grid"
        >
          {/* Quadrant 1 (Top-Left): Eligibility Criteria */}
          <SchemeEligibilityCriteriaCard
            eligibilityCriteria={eligibilityCriteria}
            setEligibilityCriteria={setEligibilityCriteria}
            showToast={showToast}
          />

          {/* Quadrant 2 (Top-Right): How to Apply (Process Steps) */}
          <SchemeProcessStepsCard
            applicationSteps={applicationSteps}
            setApplicationSteps={setApplicationSteps}
            showToast={showToast}
          />

          {/* Quadrant 3 (Bottom-Left): Required Documents */}
          <SchemeRequiredDocsCard
            requirements={requirements}
            setRequirements={setRequirements}
            showToast={showToast}
          />

          {/* Quadrant 4 (Bottom-Right): Frequently Asked Questions */}
          <SchemeFaqsCard
            faqs={faqs}
            setFaqs={setFaqs}
            showToast={showToast}
          />
        </div>
      </section>

      {/* Sticky Bottom Bar on Page 2 (Step 2) */}
      <div
        style={{
          position: 'sticky',
          bottom: 0,
          zIndex: 50,
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderTop: '1px solid #E2E8F0',
          padding: '14px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.06)',
          boxSizing: 'border-box',
          width: '100%'
        }}
      >
        <button
          type="button"
          id="btnBackToSchemeDetails"
          onClick={onBackToOverview}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '40px',
            padding: '0 20px',
            borderRadius: '10px',
            background: '#FFFFFF',
            border: '1.5px solid #E2E8F0',
            color: '#1E1B4B',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#6336EB';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#E2E8F0';
          }}
        >
          Back to Scheme Details
        </button>

        <button
          type="button"
          id="btnPublishSchemeFromEligibility"
          onClick={onPublishComplete}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            height: '40px',
            padding: '0 26px',
            borderRadius: '10px',
            border: 'none',
            background: 'linear-gradient(135deg, #6336EB, #4D25C9)',
            color: '#FFFFFF',
            fontSize: '13.5px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(99, 54, 235, 0.25)',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.92'; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
        >
          <span>{isEditing ? 'Save Changes' : 'Publish Scheme'}</span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
