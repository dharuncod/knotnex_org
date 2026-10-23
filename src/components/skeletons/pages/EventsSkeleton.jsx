import React from 'react';
import {
  SkeletonLine,
  SkeletonCircle,
  SkeletonPill,
  SkeletonBtn,
  SkeletonBox,
  SkeletonCheckbox,
  SkeletonHeader,
  SkeletonKpiGrid
} from '../SkeletonPrimitives';

export default function EventsSkeleton() {
  return (
    <section className="app-view active skeleton-page-view" id="skeletonViewEvents">
      {/* Header */}
      <SkeletonHeader
        titleWidth="240px"
        subtitleWidth="420px"
        btnWidth="130px"
      />

      {/* 4 KPI Metric Cards */}
      <SkeletonKpiGrid count={4} />

      {/* Filter Tabs Bar + Search (matching EventsView) */}
      <div className="filter-toolbar skeleton-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 0 16px 0', gap: '16px', flexWrap: 'wrap' }}>
        <div className="filter-left-controls" style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <SkeletonPill width={72} height={34} style={{ borderRadius: '8px' }} />
          <SkeletonPill width={94} height={34} style={{ borderRadius: '8px' }} />
          <SkeletonPill width={88} height={34} style={{ borderRadius: '8px' }} />
          <SkeletonPill width={102} height={34} style={{ borderRadius: '8px' }} />
          <SkeletonPill width={78} height={34} style={{ borderRadius: '8px' }} />
        </div>
        <div className="filter-right-controls" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <SkeletonBox width="260px" height="36px" radius={20} />
          <SkeletonBtn width="36px" height="36px" style={{ borderRadius: '8px' }} />
        </div>
      </div>

      {/* Events Table matching user screenshot */}
      <div className="recent-products-card full-screen-width skeleton-table-card">
        <div className="table-responsive-wrapper" style={{ overflowX: 'auto' }}>
          <table className="recent-products-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}><SkeletonCheckbox /></th>
                <th style={{ width: '28%' }}><SkeletonLine width="110px" height="12px" /></th>
                <th style={{ width: '16%' }}><SkeletonLine width="90px" height="12px" /></th>
                <th style={{ width: '18%' }}><SkeletonLine width="130px" height="12px" /></th>
                <th style={{ width: '12%' }}><SkeletonLine width="75px" height="12px" /></th>
                <th style={{ width: '14%' }}><SkeletonLine width="80px" height="12px" /></th>
                <th style={{ width: '60px', textAlign: 'right' }}><SkeletonLine width="30px" height="12px" style={{ marginLeft: 'auto' }} /></th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 7 }).map((_, idx) => (
                <tr key={idx} className="skeleton-table-row">
                  <td><SkeletonCheckbox /></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <SkeletonBox width="46px" height="46px" radius={8} />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                        <SkeletonLine width={`${70 + (idx % 3) * 10}%`} height="14px" style={{ borderRadius: '4px' }} />
                        <SkeletonLine width={`${45 + (idx % 2) * 20}%`} height="11px" style={{ borderRadius: '3px' }} />
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <SkeletonPill width={82} height={22} />
                      <SkeletonLine width="80px" height="10px" />
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxWidth: '180px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <SkeletonLine width="80px" height="11px" />
                        <SkeletonLine width="30px" height="11px" />
                      </div>
                      <SkeletonBox width="100%" height="7px" radius={999} />
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <SkeletonLine width="65px" height="14px" />
                      <SkeletonLine width="45px" height="10px" />
                    </div>
                  </td>
                  <td>
                    <SkeletonPill width={85} height={24} style={{ borderRadius: '999px' }} />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                      <SkeletonCircle size={28} />
                    </div>
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
