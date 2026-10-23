import React from 'react';

export default function SchemePortalSupportForm({
  desc,
  setDesc,
  bannerUrl,
  setBannerUrl,
  category,
  portalUrl,
  setPortalUrl,
  helpline,
  setHelpline,
  emailSupport,
  setEmailSupport
}) {
  return (
    <div
      className="studio-card scheme-portal-support-component"
      style={{
        overflow: 'visible',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        boxSizing: 'border-box'
      }}
    >
      {/* Header */}
      <div
        className="studio-card-header"
        style={{ borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}
      >
        <div className="studio-card-icon-box">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        </div>
        <div>
          <h3 className="studio-card-title">About Scheme, Portal &amp; Support</h3>
          <p className="studio-card-desc">Provide scheme objective, official application portal link and helpline details</p>
        </div>
      </div>

      <div
        className="studio-card-body"
        style={{
          padding: '22px',
          gap: '20px',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between',
          boxSizing: 'border-box'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
          {/* Field: About the Scheme */}
          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <label className="form-label" htmlFor="inpSchemeDesc">
              About the Scheme <span className="required-star">*</span>
            </label>
            <textarea
              id="inpSchemeDesc"
              rows={5}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Detailed summary and objective of the scheme..."
              style={{
                width: '100%',
                minHeight: '130px',
                flex: 1,
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1px solid #DDE2E9',
                background: '#FFFFFF',
                fontSize: '13px',
                lineHeight: 1.6,
                color: '#1E293B',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Field: Scheme Banner Image */}
          <div className="form-group">
            <label className="form-label" htmlFor="inpSchemeBanner">
              Banner Cover Image URL
            </label>
            <input
              type="text"
              id="inpSchemeBanner"
              className="form-input"
              value={bannerUrl}
              onChange={(e) => setBannerUrl(e.target.value)}
              placeholder="https://... (Optional banner URL)"
              style={{
                height: '42px',
                padding: '0 14px',
                borderRadius: '10px',
                border: '1px solid #DDE2E9',
                fontSize: '13px',
                width: '100%',
                boxSizing: 'border-box'
              }}
            />
            {bannerUrl && (
              <div style={{ marginTop: '10px', height: '110px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #E2E8F0', position: 'relative' }}>
                <img
                  src={bannerUrl}
                  alt="Scheme Preview Banner"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {category && (
                  <span
                    style={{
                      position: 'absolute',
                      top: 8,
                      left: 10,
                      background: '#6336EB',
                      color: '#FFF',
                      fontSize: '10.5px',
                      fontWeight: 750,
                      padding: '3px 9px',
                      borderRadius: '6px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.4px'
                    }}
                  >
                    {category}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section: Application Portal Link & Support */}
        <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="inpSchemePortalUrl">
              Official Application Portal Link
            </label>
            <input
              type="text"
              id="inpSchemePortalUrl"
              className="form-input"
              value={portalUrl}
              onChange={(e) => setPortalUrl(e.target.value)}
              placeholder="e.g. https://schemes.gov.in/apply"
              style={{
                height: '42px',
                padding: '0 14px',
                borderRadius: '10px',
                border: '1px solid #DDE2E9',
                fontSize: '13.5px',
                width: '100%',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="inpSchemeHelpline">
                Helpline Number
              </label>
              <input
                type="text"
                id="inpSchemeHelpline"
                className="form-input"
                value={helpline}
                onChange={(e) => setHelpline(e.target.value)}
                placeholder="e.g. 1800-111-555"
                style={{
                  height: '40px',
                  padding: '0 12px',
                  borderRadius: '10px',
                  border: '1px solid #DDE2E9',
                  fontSize: '13px',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="inpSchemeEmail">
                Email Support
              </label>
              <input
                type="text"
                id="inpSchemeEmail"
                className="form-input"
                value={emailSupport}
                onChange={(e) => setEmailSupport(e.target.value)}
                placeholder="e.g. support@schemes.gov.in"
                style={{
                  height: '40px',
                  padding: '0 12px',
                  borderRadius: '10px',
                  border: '1px solid #DDE2E9',
                  fontSize: '13px',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
