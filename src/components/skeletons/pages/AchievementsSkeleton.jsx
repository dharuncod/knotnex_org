import React from 'react';
import {
  SkeletonLine,
  SkeletonCircle,
  SkeletonPill,
  SkeletonBtn,
  SkeletonBox,
  SkeletonHeader
} from '../SkeletonPrimitives';

export default function AchievementsSkeleton() {
  return (
    <section className="app-view active skeleton-page-view" id="skeletonViewAchievements">
      <SkeletonHeader
        titleWidth="240px"
        subtitleWidth="420px"
        btnWidth="160px"
      />

      {/* 3-Column Grid of Achievement Cards */}
      <div className="content-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px', marginTop: '24px' }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="content-card" style={{ background: '#FFFFFF', border: '1px solid var(--border-default)', borderRadius: '14px', overflow: 'hidden' }}>
            <div style={{ height: '110px', background: 'var(--neutral-100, #F3F4F6)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <SkeletonCircle size={44} />
              <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                <SkeletonPill width={70} height={20} style={{ borderRadius: '999px' }} />
              </div>
            </div>

            <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <SkeletonLine width="85%" height="16px" style={{ borderRadius: '4px' }} />
              <SkeletonLine width="60%" height="12px" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '4px' }}>
                <SkeletonLine width="100%" height="12px" />
                <SkeletonLine width="90%" height="12px" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
