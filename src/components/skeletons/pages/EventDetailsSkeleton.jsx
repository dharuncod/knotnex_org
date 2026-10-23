import React from 'react';
import {
  SkeletonLine,
  SkeletonCircle,
  SkeletonPill,
  SkeletonBtn,
  SkeletonBox,
  SkeletonKpiGrid
} from '../SkeletonPrimitives';

export default function EventDetailsSkeleton() {
  return (
    <section className="app-view active skeleton-page-view" id="skeletonViewEventDetails">
      <div className="event-details-wrapper">
        {/* Breadcrumb Navigation Skeleton */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <SkeletonLine width="75px" height="12px" />
          <span style={{ color: 'var(--neutral-400)' }}>/</span>
          <SkeletonLine width="60px" height="12px" />
          <span style={{ color: 'var(--neutral-400)' }}>/</span>
          <SkeletonLine width="160px" height="12px" />
        </div>

        {/* Page Header Skeleton */}
        <header className="content-header" style={{ marginBottom: '20px' }}>
          <div className="header-title-group" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <SkeletonBox width="42px" height="42px" radius={10} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <SkeletonLine width="280px" height="24px" style={{ borderRadius: '6px' }} />
                <SkeletonPill width={75} height={22} />
              </div>
              <SkeletonLine width="200px" height="12px" />
            </div>
          </div>
          <div className="header-actions" style={{ display: 'flex', gap: '10px' }}>
            <SkeletonBtn width="90px" height="38px" />
            <SkeletonBtn width="110px" height="38px" />
          </div>
        </header>

        {/* Event Hero Banner Card Skeleton */}
        <div className="event-hero-banner-card" style={{ background: '#FFFFFF', border: '1px solid var(--border-default)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <SkeletonPill width={95} height={26} />
                <SkeletonPill width={140} height={26} />
                <SkeletonPill width={160} height={26} />
                <SkeletonPill width={85} height={26} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <SkeletonLine width="100%" height="13px" />
                <SkeletonLine width="92%" height="13px" />
                <SkeletonLine width="75%" height="13px" />
              </div>
            </div>

            {/* Capacity Box */}
            <div style={{ width: '260px', padding: '16px', background: '#F9FAFB', border: '1px solid var(--border-default)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <SkeletonLine width="90px" height="13px" />
                <SkeletonLine width="36px" height="16px" style={{ borderRadius: '4px' }} />
              </div>
              <SkeletonBox width="100%" height="8px" radius={4} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <SkeletonLine width="110px" height="11px" />
                <SkeletonLine width="55px" height="11px" />
              </div>
            </div>
          </div>
        </div>

        {/* 4 KPI Metric Cards */}
        <SkeletonKpiGrid count={4} />

        {/* Attendee Roster Console Card Skeleton */}
        <div className="attendee-console-card" style={{ background: '#FFFFFF', border: '1px solid var(--border-default)', borderRadius: '14px', padding: '20px', marginTop: '24px' }}>
          {/* Top Bar with Filter Pills & Search */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <SkeletonLine width="40px" height="24px" style={{ borderRadius: '6px' }} />
              <SkeletonLine width="120px" height="13px" />
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <SkeletonPill width={60} height={32} style={{ borderRadius: '8px' }} />
              <SkeletonPill width={98} height={32} style={{ borderRadius: '8px' }} />
              <SkeletonPill width={90} height={32} style={{ borderRadius: '8px' }} />
              <SkeletonPill width={70} height={32} style={{ borderRadius: '8px' }} />
              <SkeletonPill width={92} height={32} style={{ borderRadius: '8px' }} />
            </div>

            <SkeletonBox width="280px" height="36px" radius={8} />
          </div>

          {/* Attendee Table Rows */}
          <div className="table-responsive-wrapper" style={{ overflowX: 'auto' }}>
            <table className="recent-products-table">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}><SkeletonLine width="16px" height="12px" /></th>
                  <th style={{ width: '22%' }}><SkeletonLine width="100px" height="12px" /></th>
                  <th style={{ width: '18%' }}><SkeletonLine width="90px" height="12px" /></th>
                  <th style={{ width: '13%' }}><SkeletonLine width="75px" height="12px" /></th>
                  <th style={{ width: '11%' }}><SkeletonLine width="65px" height="12px" /></th>
                  <th style={{ width: '12%' }}><SkeletonLine width="80px" height="12px" /></th>
                  <th style={{ width: '10%' }}><SkeletonLine width="60px" height="12px" /></th>
                  <th style={{ width: '14%', textAlign: 'right' }}><SkeletonLine width="80px" height="12px" style={{ marginLeft: 'auto' }} /></th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 6 }).map((_, idx) => (
                  <tr key={idx} className="skeleton-table-row">
                    <td><SkeletonLine width="18px" height="12px" /></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <SkeletonCircle size={34} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <SkeletonLine width="120px" height="13px" />
                          <SkeletonLine width="80px" height="10px" />
                        </div>
                      </div>
                    </td>
                    <td><SkeletonLine width="140px" height="12px" /></td>
                    <td><SkeletonLine width="95px" height="12px" /></td>
                    <td><SkeletonPill width={75} height={20} /></td>
                    <td><SkeletonLine width="70px" height="12px" /></td>
                    <td><SkeletonLine width="60px" height="12px" /></td>
                    <td style={{ textAlign: 'right' }}>
                      <SkeletonPill width={80} height={24} style={{ borderRadius: '999px', marginLeft: 'auto' }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
