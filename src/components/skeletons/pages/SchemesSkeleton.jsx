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

export default function SchemesSkeleton() {
  return (
    <section className="app-view active skeleton-page-view" id="skeletonViewSchemes">
      <SkeletonHeader
        titleWidth="240px"
        subtitleWidth="440px"
        btnWidth="140px"
      />

      <SkeletonKpiGrid count={3} />

      {/* Tabs & Search Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 0 16px', gap: '14px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <SkeletonPill width={140} height={34} style={{ borderRadius: '8px' }} />
          <SkeletonPill width={170} height={34} style={{ borderRadius: '8px' }} />
        </div>
        <SkeletonBox width="260px" height="36px" radius={20} />
      </div>

      {/* Schemes Card List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} style={{ background: '#FFFFFF', border: '1px solid var(--border-default)', borderRadius: '14px', padding: '22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: '280px' }}>
              <SkeletonBox width="50px" height="50px" radius={10} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <SkeletonLine width="240px" height="17px" style={{ borderRadius: '4px' }} />
                  <SkeletonPill width={80} height={20} />
                </div>
                <SkeletonLine width="80%" height="12px" />
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <SkeletonLine width="110px" height="11px" />
                  <SkeletonLine width="90px" height="11px" />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                <SkeletonLine width="100px" height="16px" style={{ borderRadius: '4px' }} />
                <SkeletonLine width="65px" height="10px" />
              </div>
              <SkeletonBtn width="110px" height="38px" style={{ borderRadius: '8px' }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
