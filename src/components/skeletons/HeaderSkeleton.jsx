import React from 'react';
import { SkeletonLine, SkeletonCircle, SkeletonBox } from './SkeletonPrimitives';

export default function HeaderSkeleton() {
  return (
    <header className="appbar-header skeleton-appbar" id="skeletonHeader" style={{ pointerEvents: 'none' }}>
      {/* Mobile Drawer Trigger Placeholder (Mobile Only) */}
      <div
        className="appbar-mobile-menu-btn"
        style={{ pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <SkeletonCircle size={20} />
      </div>

      {/* Center: Search Pill Bar Skeleton */}
      <div className="appbar-center-search">
        <SkeletonBox width="480px" height="42px" radius={9999} />
      </div>

      {/* Right: Actions Cluster Skeleton */}
      <div className="appbar-right-actions" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Circular Notification Bell Skeleton */}
        <SkeletonCircle size={38} />

        {/* User Profile Badge Skeleton */}
        <div
          className="appbar-profile-badge"
          style={{ pointerEvents: 'none', display: 'flex', alignItems: 'center', gap: '10px', padding: '4px 10px 4px 6px' }}
        >
          <SkeletonCircle size={38} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <SkeletonLine width="84px" height="13px" />
            <SkeletonLine width="64px" height="10px" />
          </div>
          <SkeletonBox width="10px" height="6px" radius={2} style={{ marginLeft: '4px' }} />
        </div>
      </div>
    </header>
  );
}
