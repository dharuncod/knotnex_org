import React from 'react';
import {
  SkeletonLine,
  SkeletonCircle,
  SkeletonPill
} from '../SkeletonPrimitives';

export default function ContentGridSkeleton({ count = 6 }) {
  return (
    <div className="content-grid-3 skeleton-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
      {Array.from({ length: count }).map((_, i) => (
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
  );
}
