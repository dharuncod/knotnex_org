import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import SchemeOverviewForm from './SchemeOverviewForm';
import SchemePortalSupportForm from './SchemePortalSupportForm';
import SchemeEligibilityProcess from './SchemeEligibilityProcess';

export default function CreateSchemeView() {
  const { navigateTo, addScheme, updateScheme, showToast, editingScheme, setEditingScheme } = useApp();

  // Multi-step state: 'overview' (Page 1) | 'eligibilityProcess' (Page 2)
  const [currentStep, setCurrentStep] = useState('overview');

  const changeStep = (nextStep) => {
    const resetScroll = () => {
      const mainArea = document.getElementById('mainContentArea');
      if (mainArea) mainArea.scrollTop = 0;
      window.scrollTo(0, 0);
    };
    resetScroll();
    setCurrentStep(nextStep);
    requestAnimationFrame(resetScroll);
    setTimeout(resetScroll, 50);
  };

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
  }, [currentStep]);

  // Page 1 - Left Component Details (Up to Financial Benefit)
  const [title, setTitle] = useState(() => editingScheme?.title || '');
  const [category, setCategory] = useState(() => editingScheme?.category || '');
  const [value, setValue] = useState(() => editingScheme?.value || '');
  const [deadline, setDeadline] = useState(() => editingScheme?.deadline || '');
  const [region, setRegion] = useState(() => editingScheme?.region || '');
  const [orgName, setOrgName] = useState(() => editingScheme?.orgName || '');
  const [orgType, setOrgType] = useState(() => editingScheme?.orgType || '');
  const [orgInitials, setOrgInitials] = useState(() => editingScheme?.orgInitials || '');

  // Page 1 - Right Component Details (About Scheme, Banner, Portal & Support)
  const [desc, setDesc] = useState(() => editingScheme?.desc || '');
  const [bannerUrl, setBannerUrl] = useState(() => editingScheme?.bannerUrl || '');
  const [portalUrl, setPortalUrl] = useState(() => editingScheme?.portalUrl || '');
  const [portalLabel] = useState(
    () => editingScheme?.portalLabel || 'Official Application Portal'
  );
  const [portalSubtitle] = useState(
    () => editingScheme?.portalSubtitle || 'Submit direct online application'
  );
  const [helpline, setHelpline] = useState(() => editingScheme?.helpline || '');
  const [emailSupport, setEmailSupport] = useState(() => editingScheme?.emailSupport || '');

  // Page 2 - Next Page Details (Eligibility, Documents, Steps & FAQs)
  const [eligibilityCriteria, setEligibilityCriteria] = useState(
    () => editingScheme?.eligibilityCriteria || []
  );
  const [requirements, setRequirements] = useState(
    () => editingScheme?.requirements || []
  );
  const [applicationSteps, setApplicationSteps] = useState(
    () => editingScheme?.applicationSteps || []
  );
  const [faqs, setFaqs] = useState(() => editingScheme?.faqs || []);

  // Sync state if editingScheme changes
  useEffect(() => {
    if (editingScheme) {
      setTitle(editingScheme.title || '');
      setCategory(editingScheme.category || '');
      setValue(editingScheme.value || '');
      setDeadline(editingScheme.deadline || '');
      setRegion(editingScheme.region || '');
      setOrgName(editingScheme.orgName || '');
      setOrgType(editingScheme.orgType || '');
      setOrgInitials(editingScheme.orgInitials || '');
      setDesc(editingScheme.desc || '');
      setBannerUrl(editingScheme.bannerUrl || '');
      setPortalUrl(editingScheme.portalUrl || '');
      setHelpline(editingScheme.helpline || '');
      setEmailSupport(editingScheme.emailSupport || '');
      setEligibilityCriteria(editingScheme.eligibilityCriteria || []);
      setRequirements(editingScheme.requirements || []);
      setApplicationSteps(editingScheme.applicationSteps || []);
      setFaqs(editingScheme.faqs || []);
    } else {
      setTitle('');
      setCategory('');
      setValue('');
      setDeadline('');
      setRegion('');
      setOrgName('');
      setOrgType('');
      setOrgInitials('');
      setDesc('');
      setBannerUrl('');
      setPortalUrl('');
      setHelpline('');
      setEmailSupport('');
      setEligibilityCriteria([]);
      setRequirements([]);
      setApplicationSteps([]);
      setFaqs([]);
    }
  }, [editingScheme]);

  // Publish / Save Scheme
  const handlePublish = () => {
    if (!title.trim()) {
      showToast('Please enter a scheme title', 'warning');
      changeStep('overview');
      return;
    }

    const payload = {
      ...(editingScheme || {}),
      id: editingScheme?.id || `sch-${Date.now()}`,
      title: title.trim(),
      category: category.trim() || 'General Scheme',
      value: value.trim() || 'Grant Assistance',
      deadline: deadline.trim() || 'Rolling',
      region: region.trim() || 'Pan India',
      orgName: orgName.trim() || 'Organization Body',
      orgType: orgType.trim() || 'Official Issuer',
      orgInitials: orgInitials.trim() || (orgName.slice(0, 2).toUpperCase() || 'SC'),
      bannerUrl: bannerUrl.trim(),
      desc: desc.trim(),
      portalUrl: portalUrl.trim(),
      portalLabel: portalLabel.trim() || 'Official Application Portal',
      portalSubtitle: portalSubtitle.trim() || 'Submit direct online application',
      helpline: helpline.trim(),
      emailSupport: emailSupport.trim(),
      eligibilityCriteria,
      requirements,
      applicationSteps,
      faqs,
      status: editingScheme?.status || 'active',
      applicantsCount: editingScheme?.applicantsCount || 0
    };

    if (editingScheme && updateScheme) {
      updateScheme(editingScheme.id, payload);
      showToast(`Scheme "${payload.title}" updated successfully!`, 'success');
      if (setEditingScheme) setEditingScheme(null);
    } else {
      addScheme(payload);
      showToast(`Scheme "${payload.title}" published successfully!`, 'success');
    }
    navigateTo('schemes');
  };

  // Page 2: Eligibility, Documents & Process
  if (currentStep === 'eligibilityProcess') {
    return (
      <SchemeEligibilityProcess
        eligibilityCriteria={eligibilityCriteria}
        setEligibilityCriteria={setEligibilityCriteria}
        requirements={requirements}
        setRequirements={setRequirements}
        applicationSteps={applicationSteps}
        setApplicationSteps={setApplicationSteps}
        faqs={faqs}
        setFaqs={setFaqs}
        onBackToOverview={() => changeStep('overview')}
        onPublishComplete={handlePublish}
        isEditing={!!editingScheme}
        showToast={showToast}
      />
    );
  }

  // Page 1: Split into Left Component (Scheme Overview) and Right Component (About Scheme, Banner, Portal & Support)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 80px)', position: 'relative' }}>
      <section
        className="app-view active"
        id="viewCreateScheme"
        style={{
          paddingBottom: '32px',
          flex: 1
        }}
      >
        {/* Main 2-Column Container: No back button, No top right path */}
        <div
          className="create-scheme-container"
          style={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 460px), 1fr))',
            gap: '24px',
            alignItems: 'start'
          }}
        >
          {/* ========================================================
              LEFT COMPONENT: Scheme & Ministry Overview
              (Up to Financial Benefit / Grant Coverage)
             ======================================================== */}
          <SchemeOverviewForm
            title={title}
            setTitle={setTitle}
            category={category}
            setCategory={setCategory}
            deadline={deadline}
            setDeadline={setDeadline}
            region={region}
            setRegion={setRegion}
            orgName={orgName}
            setOrgName={setOrgName}
            orgType={orgType}
            setOrgType={setOrgType}
            setOrgInitials={setOrgInitials}
            value={value}
            setValue={setValue}
            isEditing={!!editingScheme}
          />

          {/* ========================================================
              RIGHT COMPONENT: About Scheme, Portal & Support
              (About description, banner URL, portal link, helpline, email)
             ======================================================== */}
          <SchemePortalSupportForm
            desc={desc}
            setDesc={setDesc}
            bannerUrl={bannerUrl}
            setBannerUrl={setBannerUrl}
            category={category}
            portalUrl={portalUrl}
            setPortalUrl={setPortalUrl}
            helpline={helpline}
            setHelpline={setHelpline}
            emailSupport={emailSupport}
            setEmailSupport={setEmailSupport}
          />
        </div>
      </section>

      {/* ========================================================
          STICKY BOTTOM FOOTER BAR (PAGE 1)
         ======================================================== */}
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
          id="btnCancelScheme"
          onClick={() => {
            if (setEditingScheme) setEditingScheme(null);
            navigateTo('schemes');
          }}
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
          Cancel &amp; Discard
        </button>

        <button
          type="button"
          id="btnNextToEligibilityProcess"
          onClick={() => {
            if (!title.trim()) {
              showToast('Please enter a scheme title', 'warning');
              return;
            }
            changeStep('eligibilityProcess');
          }}
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
          <span>Next: Eligibility &amp; Process</span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14" />
            <path d="M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
