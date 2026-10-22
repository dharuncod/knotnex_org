import React from 'react';
import {
  SkeletonLine,
  SkeletonBox,
  SkeletonHeader
} from '../SkeletonPrimitives';

export default function HelpCenterSkeleton() {
  return (
    <section className="app-view active skeleton-page-view" id="skeletonViewHelpCenter">
      <SkeletonHeader
        titleWidth="140px"
        subtitleWidth="360px"
      />

      {/* Support Form Card Skeleton */}
      <div style={{ background: '#FFFFFF', border: '1px solid var(--border-default)', borderRadius: '16px', padding: '32px', margin: '20px 0 28px', maxWidth: '840px' }}>
        <SkeletonLine width="240px" height="22px" style={{ marginBottom: '8px' }} />
        <SkeletonLine width="420px" height="13px" style={{ marginBottom: '28px' }} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <SkeletonLine width="80px" height="12px" style={{ marginBottom: '8px' }} />
            <SkeletonBox width="100%" height="42px" radius={8} />
          </div>
          <div>
            <SkeletonLine width="90px" height="12px" style={{ marginBottom: '8px' }} />
            <SkeletonBox width="100%" height="42px" radius={8} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <SkeletonLine width="100px" height="12px" style={{ marginBottom: '8px' }} />
            <SkeletonBox width="100%" height="42px" radius={8} />
          </div>
          <div>
            <SkeletonLine width="60px" height="12px" style={{ marginBottom: '8px' }} />
            <SkeletonBox width="100%" height="42px" radius={8} />
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <SkeletonLine width="110px" height="12px" style={{ marginBottom: '8px' }} />
          <SkeletonBox width="100%" height="42px" radius={8} />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <SkeletonLine width="130px" height="12px" style={{ marginBottom: '8px' }} />
          <SkeletonBox width="100%" height="110px" radius={8} />
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <SkeletonBox width="130px" height="40px" radius={8} />
          <SkeletonBox width="90px" height="40px" radius={8} />
        </div>
      </div>
    </section>
  );
}
