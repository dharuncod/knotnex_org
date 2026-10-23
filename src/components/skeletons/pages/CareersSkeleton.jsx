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

export default function CareersSkeleton() {
  return (
    <section className="app-view active skeleton-page-view" id="skeletonViewCareers">
      <SkeletonHeader
        titleWidth="220px"
        subtitleWidth="400px"
        btnWidth="150px"
      />

      <SkeletonKpiGrid count={3} />

      {/* Tabs & Search Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 0 16px', gap: '14px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <SkeletonPill width={130} height={34} style={{ borderRadius: '8px' }} />
          <SkeletonPill width={150} height={34} style={{ borderRadius: '8px' }} />
        </div>
        <SkeletonBox width="260px" height="36px" radius={20} />
      </div>

      {/* Job Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} style={{ background: '#FFFFFF', border: '1px solid var(--border-default)', borderRadius: '14px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <SkeletonBox width="52px" height="52px" radius={10} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <SkeletonLine width="200px" height="16px" style={{ borderRadius: '4px' }} />
                  <SkeletonPill width={70} height={20} />
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <SkeletonLine width="110px" height="11px" />
                  <SkeletonLine width="90px" height="11px" />
                  <SkeletonLine width="80px" height="11px" />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                <SkeletonLine width="90px" height="13px" />
                <SkeletonLine width="60px" height="10px" />
              </div>
              <SkeletonBtn width="100px" height="36px" style={{ borderRadius: '8px' }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
