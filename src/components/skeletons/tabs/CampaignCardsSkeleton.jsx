import React from 'react';
import {
  SkeletonLine,
  SkeletonPill,
  SkeletonBtn,
  SkeletonBox
} from '../SkeletonPrimitives';

export default function CampaignCardsSkeleton({ count = 6 }) {
  return (
    <div className="content-grid-3 skeleton-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="content-card" style={{ background: '#FFFFFF', border: '1px solid var(--border-default)', borderRadius: '14px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ height: '110px', background: 'var(--neutral-100, #F3F4F6)', position: 'relative', padding: '12px' }}>
            <SkeletonBox width="100%" height="100%" radius={0} />
            <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
              <SkeletonPill width={70} height={22} style={{ borderRadius: '999px' }} />
            </div>
          </div>

          <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
            <SkeletonLine width="80%" height="16px" style={{ borderRadius: '4px' }} />
            <SkeletonLine width="50%" height="11px" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <SkeletonLine width="100%" height="12px" />
              <SkeletonLine width="90%" height="12px" />
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <SkeletonLine width="70px" height="11px" />
                <SkeletonLine width="40px" height="11px" />
              </div>
              <SkeletonBox width="100%" height="6px" radius={3} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border-subtle, #F2F4F7)' }}>
              <SkeletonLine width="80px" height="12px" />
              <SkeletonBtn width="75px" height="28px" style={{ borderRadius: '6px' }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
