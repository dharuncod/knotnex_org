import React from 'react';
import {
  SkeletonLine,
  SkeletonPill,
  SkeletonBtn,
  SkeletonBox
} from '../SkeletonPrimitives';

export default function SettingsSectionSkeleton({ rows = 4 }) {
  return (
    <div className="skeleton-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderBottom: '1px solid var(--border-default)', paddingBottom: '16px' }}>
        <SkeletonLine width="160px" height="20px" style={{ borderRadius: '6px' }} />
        <SkeletonLine width="260px" height="12px" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <SkeletonLine width="80px" height="11px" />
        {Array.from({ length: rows }).map((_, idx) => (
          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--border-subtle, #F2F4F7)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <SkeletonLine width="140px" height="14px" />
              <SkeletonLine width="240px" height="11px" />
            </div>
            {idx % 2 === 0 ? (
              <SkeletonBtn width="60px" height="30px" style={{ borderRadius: '6px' }} />
            ) : (
              <SkeletonBox width="42px" height="24px" radius={12} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
