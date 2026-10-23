import React from 'react';
import {
  SkeletonLine,
  SkeletonBtn,
  SkeletonBox
} from '../SkeletonPrimitives';

export default function CreateOpportunitySkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 80px)', position: 'relative' }}>
      <section className="app-view active skeleton-page-view" id="skeletonViewCreateOpportunity" style={{ paddingBottom: '32px', flex: 1 }}>
        {/* Top Header: Back Button alone */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <SkeletonBtn width="72px" height="32px" style={{ borderRadius: '8px' }} />
        </div>

        {/* Main Container */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}
        >
          {/* Top: 2-Column Grid for Role Details & Requirements */}
          <div
            style={{
              width: '100%',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
              gap: '24px',
              alignItems: 'start'
            }}
          >
            {/* Left Column (Card 1): Role & Position Details */}
            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid var(--border-default)',
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '18px'
              }}
            >
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <SkeletonBox width="38px" height="38px" radius={10} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <SkeletonLine width="180px" height="15px" />
                  <SkeletonLine width="280px" height="12px" />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <SkeletonLine width="100px" height="12px" />
                <SkeletonBox width="100%" height="42px" radius={8} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <SkeletonLine width="90px" height="12px" />
                  <SkeletonBox width="100%" height="40px" radius={8} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <SkeletonLine width="110px" height="12px" />
                  <SkeletonBox width="100%" height="40px" radius={8} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <SkeletonLine width="100px" height="12px" />
                  <SkeletonBox width="100%" height="40px" radius={8} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <SkeletonLine width="100px" height="12px" />
                  <SkeletonBox width="100%" height="40px" radius={8} />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <SkeletonLine width="120px" height="12px" />
                <SkeletonBox width="100%" height="40px" radius={8} />
              </div>
            </div>

            {/* Right Column (Card 2): Requirements & Perks */}
            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid var(--border-default)',
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '18px'
              }}
            >
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <SkeletonBox width="38px" height="38px" radius={10} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <SkeletonLine width="170px" height="15px" />
                  <SkeletonLine width="300px" height="12px" />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <SkeletonLine width="160px" height="12px" />
                <SkeletonBox width="100%" height="140px" radius={10} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <SkeletonLine width="180px" height="12px" />
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <SkeletonBox width="120px" height="34px" radius={9999} />
                  <SkeletonBox width="160px" height="34px" radius={9999} />
                  <SkeletonBox width="170px" height="34px" radius={9999} />
                  <SkeletonBox width="140px" height="34px" radius={9999} />
                  <SkeletonBox width="110px" height="34px" radius={9999} />
                  <SkeletonBox width="150px" height="34px" radius={9999} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Bottom Bar Skeleton */}
      <div
        style={{
          position: 'sticky',
          bottom: 0,
          zIndex: 50,
          background: 'rgba(255, 255, 255, 0.98)',
          borderTop: '1px solid #E2E8F0',
          padding: '14px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.06)',
          boxSizing: 'border-box',
          width: '100%'
        }}
      >
        <SkeletonBtn width="140px" height="40px" style={{ borderRadius: '10px' }} />
        <SkeletonBtn width="190px" height="40px" style={{ borderRadius: '10px' }} />
      </div>
    </div>
  );
}
