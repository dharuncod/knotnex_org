import React from 'react';
import {
  SkeletonLine,
  SkeletonCircle,
  SkeletonPill,
  SkeletonBtn,
  SkeletonBox,
  SkeletonHeader,
  SkeletonKpiGrid
} from '../SkeletonPrimitives';

export default function EventPassesSkeleton() {
  return (
    <section className="app-view active skeleton-page-view" id="skeletonViewEventPasses">
      <SkeletonHeader
        titleWidth="180px"
        subtitleWidth="440px"
        btnWidth="120px"
        hasSecondaryBtn={true}
      />

      <SkeletonKpiGrid count={4} />

      {/* Filter toolbar & search */}
      <div className="filter-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 0 16px', gap: '14px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <SkeletonPill width={70} height={32} style={{ borderRadius: '8px' }} />
          <SkeletonPill width={75} height={32} style={{ borderRadius: '8px' }} />
          <SkeletonPill width={75} height={32} style={{ borderRadius: '8px' }} />
          <SkeletonPill width={80} height={32} style={{ borderRadius: '8px' }} />
        </div>
        <SkeletonBox width="260px" height="36px" radius={20} />
      </div>

      {/* Passes table */}
      <div className="recent-products-card full-screen-width" style={{ background: '#FFFFFF', border: '1px solid var(--border-default)', borderRadius: '14px', overflow: 'hidden' }}>
        <div className="table-responsive-wrapper" style={{ overflowX: 'auto' }}>
          <table className="recent-products-table">
            <thead>
              <tr>
                <th style={{ width: '15%' }}><SkeletonLine width="80px" height="12px" /></th>
                <th style={{ width: '25%' }}><SkeletonLine width="110px" height="12px" /></th>
                <th style={{ width: '22%' }}><SkeletonLine width="95px" height="12px" /></th>
                <th style={{ width: '12%' }}><SkeletonLine width="65px" height="12px" /></th>
                <th style={{ width: '14%' }}><SkeletonLine width="75px" height="12px" /></th>
                <th style={{ width: '12%', textAlign: 'right' }}><SkeletonLine width="60px" height="12px" style={{ marginLeft: 'auto' }} /></th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 6 }).map((_, idx) => (
                <tr key={idx} className="skeleton-table-row">
                  <td><SkeletonPill width={80} height={22} style={{ borderRadius: '6px' }} /></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <SkeletonCircle size={36} />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <SkeletonLine width="130px" height="13px" />
                        <SkeletonLine width="85px" height="10px" />
                      </div>
                    </div>
                  </td>
                  <td><SkeletonLine width="160px" height="13px" /></td>
                  <td><SkeletonPill width={70} height={22} /></td>
                  <td><SkeletonPill width={80} height={22} style={{ borderRadius: '999px' }} /></td>
                  <td style={{ textAlign: 'right' }}>
                    <SkeletonBtn width="85px" height="30px" style={{ borderRadius: '6px', marginLeft: 'auto' }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
