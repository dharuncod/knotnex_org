import React from 'react';
import {
  SkeletonLine,
  SkeletonCircle,
  SkeletonPill,
  SkeletonBtn,
  SkeletonBox,
  SkeletonHeader
} from '../SkeletonPrimitives';

export default function SettingsSkeleton() {
  return (
    <section className="app-view active skeleton-page-view" id="skeletonViewSettings">
      <SkeletonHeader
        titleWidth="140px"
        subtitleWidth="440px"
        btnWidth="0px"
      />

      <div className="settings-layout" style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '24px', marginTop: '24px' }}>
        {/* Settings Navigation Nav */}
        <div className="settings-nav" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: i === 0 ? 'var(--neutral-100, #F3F4F6)' : 'transparent', borderRadius: '10px' }}>
              <SkeletonCircle size={18} />
              <SkeletonLine width={i === 2 ? '120px' : '90px'} height="13px" />
            </div>
          ))}
        </div>

        {/* Settings Content Panel */}
        <div className="settings-content" style={{ background: '#FFFFFF', border: '1px solid var(--border-default)', borderRadius: '16px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderBottom: '1px solid var(--border-default)', paddingBottom: '16px' }}>
            <SkeletonLine width="160px" height="20px" style={{ borderRadius: '6px' }} />
            <SkeletonLine width="260px" height="12px" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <SkeletonLine width="80px" height="11px" />
            {Array.from({ length: 4 }).map((_, idx) => (
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
      </div>
    </section>
  );
}
