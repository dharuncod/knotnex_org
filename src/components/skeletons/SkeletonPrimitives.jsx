import React from 'react';

export function SkeletonLine({ width, height, className = '', style = {} }) {
  const customStyle = { ...style };
  if (width) customStyle.width = width;
  if (height) customStyle.height = height;

  return (
    <div
      className={`skeleton-line ${className}`}
      style={customStyle}
      aria-hidden="true"
    />
  );
}

export function SkeletonCircle({ size = 36, className = '', style = {} }) {
  const customStyle = {
    width: size,
    height: size,
    minWidth: size,
    minHeight: size,
    ...style
  };

  return (
    <div
      className={`skeleton-circle ${className}`}
      style={customStyle}
      aria-hidden="true"
    />
  );
}

export function SkeletonPill({ width = 72, height = 24, className = '', style = {} }) {
  const customStyle = {
    width,
    height,
    ...style
  };

  return (
    <div
      className={`skeleton-pill ${className}`}
      style={customStyle}
      aria-hidden="true"
    />
  );
}

export function SkeletonBtn({ width = 100, height = 36, className = '', style = {} }) {
  const customStyle = {
    width,
    height,
    ...style
  };

  return (
    <div
      className={`skeleton-btn ${className}`}
      style={customStyle}
      aria-hidden="true"
    />
  );
}

export function SkeletonBox({ width = '100%', height = '100px', radius = 8, className = '', style = {} }) {
  const customStyle = {
    width,
    height,
    borderRadius: radius,
    ...style
  };

  return (
    <div
      className={`skeleton-box ${className}`}
      style={customStyle}
      aria-hidden="true"
    />
  );
}

export function SkeletonCheckbox({ size = 18, className = '', style = {} }) {
  const customStyle = {
    width: size,
    height: size,
    minWidth: size,
    borderRadius: 4,
    ...style
  };

  return (
    <div
      className={`skeleton-box ${className}`}
      style={customStyle}
      aria-hidden="true"
    />
  );
}

export function SkeletonHeader({
  hasIcon = true,
  titleWidth = '220px',
  subtitleWidth = '380px',
  btnWidth = '130px',
  hasSecondaryBtn = false
}) {
  return (
    <header className="content-header skeleton-view-header">
      <div className="header-title-group" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {hasIcon && <SkeletonBox width="42px" height="42px" radius={10} />}
        <div className="header-text-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <SkeletonLine width={titleWidth} height="22px" style={{ borderRadius: '6px' }} />
          <SkeletonLine width={subtitleWidth} height="13px" style={{ borderRadius: '4px' }} />
        </div>
      </div>
      <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {hasSecondaryBtn && <SkeletonBtn width="100px" height="38px" />}
        <SkeletonBtn width={btnWidth} height="38px" />
      </div>
    </header>
  );
}

export function SkeletonKpiGrid({ count = 4 }) {
  return (
    <div className="module-stat-grid skeleton-kpi-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="module-stat-card skeleton-stat-card">
          <div className="module-stat-card-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <SkeletonCircle size={40} style={{ borderRadius: '10px' }} />
            <SkeletonPill width={56} height={20} />
          </div>
          <div className="module-stat-info" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <SkeletonLine width="110px" height="12px" />
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
              <SkeletonLine width="130px" height="24px" style={{ borderRadius: '6px' }} />
              <SkeletonLine width="50px" height="14px" />
            </div>
            <SkeletonLine width="180px" height="11px" style={{ marginTop: '4px' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 6, cols = 6 }) {
  return (
    <div className="table-responsive-wrapper skeleton-table-container">
      <table className="recent-products-table">
        <thead>
          <tr>
            <th style={{ width: '40px' }}><SkeletonCheckbox /></th>
            <th><SkeletonLine width="100px" height="12px" /></th>
            <th><SkeletonLine width="80px" height="12px" /></th>
            <th><SkeletonLine width="90px" height="12px" /></th>
            <th><SkeletonLine width="70px" height="12px" /></th>
            <th><SkeletonLine width="60px" height="12px" /></th>
            <th style={{ textAlign: 'right' }}><SkeletonLine width="40px" height="12px" style={{ marginLeft: 'auto' }} /></th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rIdx) => (
            <tr key={rIdx} className="skeleton-table-row">
              <td><SkeletonCheckbox /></td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <SkeletonBox width="42px" height="42px" radius={8} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 }}>
                    <SkeletonLine width={`${65 + (rIdx % 3) * 12}%`} height="14px" />
                    <SkeletonLine width={`${45 + (rIdx % 2) * 15}%`} height="11px" />
                  </div>
                </div>
              </td>
              <td><SkeletonPill width={70} height={22} /></td>
              <td>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <SkeletonLine width="90px" height="12px" />
                  <SkeletonBox width="100%" height="6px" radius={3} />
                </div>
              </td>
              <td><SkeletonLine width="65px" height="14px" /></td>
              <td><SkeletonPill width={75} height={22} /></td>
              <td style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                  <SkeletonCircle size={28} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
