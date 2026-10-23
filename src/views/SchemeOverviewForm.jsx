import React from 'react';

const SCHEME_CATEGORY_OPTIONS = [
  'Welfare Scheme',
  'Skill Development',
  'Education Grant',
  'Healthcare & Medical',
  'Agriculture & Rural',
  'Technology & Innovation'
];

export default function SchemeOverviewForm({
  title,
  setTitle,
  category,
  setCategory,
  deadline,
  setDeadline,
  region,
  setRegion,
  orgName,
  setOrgName,
  orgType,
  setOrgType,
  setOrgInitials,
  value,
  setValue,
  isEditing
}) {
  return (
    <div
      className="studio-card scheme-overview-component"
      style={{
        overflow: 'visible',
        display: 'flex',
        flexDirection: 'column',
        width: '100%'
      }}
    >
      {/* Header */}
      <div
        className="studio-card-header"
        style={{ borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}
      >
        <div className="studio-card-icon-box">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <div>
          <h3 className="studio-card-title">Scheme &amp; Ministry Overview</h3>
          <p className="studio-card-desc">Specify the scheme title, category badge, ministry, region and deadline</p>
        </div>
      </div>

      <div
        className="studio-card-body"
        style={{
          padding: '22px',
          gap: '20px',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Field: Scheme Title */}
        <div className="form-group">
          <label className="form-label" htmlFor="inpSchemeTitle">
            Scheme Title <span className="required-star">*</span>
          </label>
          <input
            type="text"
            id="inpSchemeTitle"
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. PM Skill Voucher Scheme"
            style={{
              height: '42px',
              padding: '0 14px',
              borderRadius: '10px',
              border: '1px solid #DDE2E9',
              fontSize: '13.5px',
              fontWeight: 600,
              color: '#111827',
              width: '100%',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Field: Category Badge */}
        <div className="form-group">
          <label className="form-label" style={{ marginBottom: '8px' }}>
            Scheme Category Badge
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
            {SCHEME_CATEGORY_OPTIONS.map((cat) => {
              const isSelected = category.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '7px 16px',
                    borderRadius: '9999px',
                    fontSize: '12.5px',
                    fontWeight: 550,
                    background: isSelected ? '#FFFFFF' : '#F9FAFB',
                    border: isSelected ? '1.5px solid #6336EB' : '1.5px solid #E2E8F0',
                    color: isSelected ? '#4F46E5' : '#64748B',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    userSelect: 'none'
                  }}
                >
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Or type a custom category badge..."
            style={{
              height: '36px',
              padding: '0 12px',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
              fontSize: '12.5px',
              width: '100%',
              boxSizing: 'border-box',
              background: '#FFF'
            }}
          />
        </div>

        {/* Row: Deadline & Region */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="inpSchemeDeadline">
              Application Deadline <span className="required-star">*</span>
            </label>
            <input
              type="text"
              id="inpSchemeDeadline"
              className="form-input"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              placeholder="e.g. Dec 31, 2026"
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

          <div className="form-group">
            <label className="form-label" htmlFor="inpSchemeRegion">
              Coverage / Region
            </label>
            <input
              type="text"
              id="inpSchemeRegion"
              className="form-input"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="e.g. Pan India"
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
        </div>

        {/* Row: Organisation Name & Subtitle */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="inpSchemeOrgName">
              Organisation / Ministry <span className="required-star">*</span>
            </label>
            <input
              type="text"
              id="inpSchemeOrgName"
              className="form-input"
              value={orgName}
              onChange={(e) => {
                setOrgName(e.target.value);
                if (!isEditing && setOrgInitials) {
                  setOrgInitials(e.target.value.slice(0, 2).toUpperCase() || '');
                }
              }}
              placeholder="e.g. MSDE, Govt. of India"
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

          <div className="form-group">
            <label className="form-label" htmlFor="inpSchemeOrgType">
              Organisation Type
            </label>
            <input
              type="text"
              id="inpSchemeOrgType"
              className="form-input"
              value={orgType}
              onChange={(e) => setOrgType(e.target.value)}
              placeholder="e.g. Official Government Body"
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
        </div>

        {/* Field: Financial Benefit / Value */}
        <div className="form-group">
          <label className="form-label" htmlFor="inpSchemeValue">
            Financial Benefit / Grant Coverage
          </label>
          <input
            type="text"
            id="inpSchemeValue"
            className="form-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="e.g. 100% Course Fee Subsidy (₹25,00,000 Cap)"
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
      </div>
    </div>
  );
}
