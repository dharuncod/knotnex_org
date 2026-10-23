import React from 'react';
import {
  SkeletonLine,
  SkeletonCircle,
  SkeletonPill,
  SkeletonBtn,
  SkeletonBox,
  SkeletonHeader
} from '../SkeletonPrimitives';

export default function TicketsSkeleton() {
  return (
    <section className="app-view active skeleton-page-view" id="skeletonViewTickets">
      <SkeletonHeader
        titleWidth="180px"
        subtitleWidth="440px"
        btnWidth="150px"
      />

      <div className="sheets-console-card full-screen-width" style={{ background: '#FFFFFF', border: '1px solid var(--border-default)', borderRadius: '14px', padding: '20px', marginTop: '20px' }}>
        {/* Top Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <SkeletonLine width="36px" height="24px" style={{ borderRadius: '6px' }} />
            <SkeletonLine width="110px" height="13px" />
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <SkeletonPill width={85} height={32} style={{ borderRadius: '8px' }} />
            <SkeletonPill width={120} height={32} style={{ borderRadius: '8px' }} />
            <SkeletonPill width={120} height={32} style={{ borderRadius: '8px' }} />
            <SkeletonPill width={100} height={32} style={{ borderRadius: '8px' }} />
            <SkeletonPill width={85} height={32} style={{ borderRadius: '8px' }} />
          </div>

          <SkeletonBox width="240px" height="36px" radius={8} />
        </div>

        {/* Tickets Table */}
        <div className="table-responsive-wrapper" style={{ overflowX: 'auto' }}>
          <table className="recent-products-table">
            <thead>
              <tr>
                <th style={{ width: '12%' }}><SkeletonLine width="65px" height="12px" /></th>
                <th style={{ width: '22%' }}><SkeletonLine width="100px" height="12px" /></th>
                <th style={{ width: '22%' }}><SkeletonLine width="110px" height="12px" /></th>
                <th style={{ width: '14%' }}><SkeletonLine width="80px" height="12px" /></th>
                <th style={{ width: '12%' }}><SkeletonLine width="65px" height="12px" /></th>
                <th style={{ width: '12%' }}><SkeletonLine width="65px" height="12px" /></th>
                <th style={{ width: '6%', textAlign: 'right' }}><SkeletonLine width="30px" height="12px" style={{ marginLeft: 'auto' }} /></th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 6 }).map((_, idx) => (
                <tr key={idx} className="skeleton-table-row">
                  <td><SkeletonLine width="65px" height="13px" /></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <SkeletonCircle size={32} />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <SkeletonLine width="110px" height="13px" />
                        <SkeletonLine width="75px" height="10px" />
                      </div>
                    </div>
                  </td>
                  <td><SkeletonLine width="150px" height="13px" /></td>
                  <td><SkeletonPill width={75} height={20} /></td>
                  <td><SkeletonPill width={60} height={20} /></td>
                  <td><SkeletonPill width={75} height={22} style={{ borderRadius: '999px' }} /></td>
                  <td style={{ textAlign: 'right' }}>
                    <SkeletonCircle size={28} style={{ marginLeft: 'auto' }} />
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
