import React from 'react';
import {
  SkeletonLine,
  SkeletonCircle,
  SkeletonPill,
  SkeletonBtn,
  SkeletonBox,
  SkeletonHeader
} from '../SkeletonPrimitives';

export default function OrgContentSkeleton() {
  return (
    <section className="app-view active skeleton-page-view" id="skeletonViewOrgContent">
      <SkeletonHeader
        titleWidth="220px"
        subtitleWidth="420px"
        btnWidth="140px"
      />

      {/* Segmented Tabs */}
      <div className="segmented-tabs-wrapper" style={{ display: 'flex', gap: '8px', margin: '20px 0', borderBottom: '1px solid var(--border-default)', paddingBottom: '10px' }}>
        <SkeletonPill width={110} height={34} style={{ borderRadius: '8px' }} />
        <SkeletonPill width={95} height={34} style={{ borderRadius: '8px' }} />
        <SkeletonPill width={85} height={34} style={{ borderRadius: '8px' }} />
        <SkeletonPill width={140} height={34} style={{ borderRadius: '8px' }} />
      </div>

      {/* Content Cards Grid */}
      <div className="content-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="content-card" style={{ background: '#FFFFFF', border: '1px solid var(--border-default)', borderRadius: '14px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <SkeletonPill width={75} height={22} />
              <SkeletonLine width="65px" height="11px" />
            </div>

            <SkeletonLine width="90%" height="18px" style={{ borderRadius: '4px' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <SkeletonCircle size={30} />
              <SkeletonLine width="110px" height="12px" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <SkeletonLine width="100%" height="12px" />
              <SkeletonLine width="85%" height="12px" />
            </div>

            <div style={{ display: 'flex', gap: '6px', marginTop: 'auto', paddingTop: '10px' }}>
              <SkeletonPill width={55} height={20} />
              <SkeletonPill width={65} height={20} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
