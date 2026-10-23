import React from 'react';
import {
  SkeletonLine,
  SkeletonCircle,
  SkeletonPill,
  SkeletonBtn,
  SkeletonBox,
  SkeletonHeader
} from '../SkeletonPrimitives';

export default function OrgProfileSkeleton() {
  return (
    <section className="app-view active skeleton-page-view" id="skeletonViewOrgProfile">
      <SkeletonHeader
        titleWidth="220px"
        subtitleWidth="440px"
        btnWidth="130px"
        hasSecondaryBtn={true}
      />

      <div style={{ background: '#FFFFFF', border: '1px solid var(--border-default)', borderRadius: '16px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '22px', marginTop: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <SkeletonLine width="160px" height="13px" />
            <SkeletonBox width="100%" height="42px" radius={8} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <SkeletonLine width="140px" height="13px" />
            <SkeletonBox width="100%" height="42px" radius={8} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <SkeletonLine width="110px" height="13px" />
            <SkeletonBox width="100%" height="42px" radius={8} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <SkeletonLine width="110px" height="13px" />
            <SkeletonBox width="100%" height="42px" radius={8} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <SkeletonLine width="120px" height="13px" />
            <SkeletonBox width="100%" height="42px" radius={8} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <SkeletonLine width="130px" height="13px" />
            <SkeletonBox width="100%" height="42px" radius={8} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <SkeletonLine width="160px" height="13px" />
          <SkeletonBox width="100%" height="90px" radius={8} />
        </div>
      </div>
    </section>
  );
}
