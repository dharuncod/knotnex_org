import React from 'react';
import {
  SkeletonLine,
  SkeletonCircle,
  SkeletonPill,
  SkeletonBtn,
  SkeletonBox
} from '../SkeletonPrimitives';

export default function CreateEventSkeleton() {
  return (
    <section className="app-view active skeleton-page-view" id="skeletonViewCreateEvent">
      {/* Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
        <SkeletonLine width="80px" height="12px" />
        <span style={{ color: 'var(--neutral-400)' }}>/</span>
        <SkeletonLine width="60px" height="12px" />
        <span style={{ color: 'var(--neutral-400)' }}>/</span>
        <SkeletonLine width="120px" height="12px" />
        <SkeletonPill width={70} height={20} style={{ marginLeft: '8px' }} />
      </div>

      {/* 3-Step Progress Stepper Skeleton */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', maxWidth: '680px', margin: '0 auto 28px', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <SkeletonCircle size={32} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <SkeletonLine width="85px" height="13px" />
            <SkeletonLine width="55px" height="10px" />
          </div>
        </div>
        <SkeletonBox width="60px" height="2px" radius={1} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <SkeletonCircle size={32} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <SkeletonLine width="85px" height="13px" />
            <SkeletonLine width="55px" height="10px" />
          </div>
        </div>
        <SkeletonBox width="60px" height="2px" radius={1} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <SkeletonCircle size={32} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <SkeletonLine width="95px" height="13px" />
            <SkeletonLine width="55px" height="10px" />
          </div>
        </div>
      </div>

      {/* Main Form Card Skeleton */}
      <div style={{ background: '#FFFFFF', border: '1px solid var(--border-default)', borderRadius: '16px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
        {/* Row 1: Event Name */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <SkeletonLine width="140px" height="13px" />
          <SkeletonBox width="100%" height="42px" radius={8} />
        </div>

        {/* Row 2: Date & Time, Location */}
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

        {/* Row 3: Category, Capacity, Ticket Price */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <SkeletonLine width="90px" height="13px" />
            <SkeletonBox width="100%" height="42px" radius={8} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <SkeletonLine width="100px" height="13px" />
            <SkeletonBox width="100%" height="42px" radius={8} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <SkeletonLine width="100px" height="13px" />
            <SkeletonBox width="100%" height="42px" radius={8} />
          </div>
        </div>

        {/* Row 4: Cover Image Dropzone */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <SkeletonLine width="150px" height="13px" />
          <div style={{ height: '140px', border: '2px dashed var(--border-default)', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <SkeletonCircle size={44} />
            <SkeletonLine width="200px" height="13px" />
            <SkeletonLine width="140px" height="11px" />
          </div>
        </div>

        {/* Row 5: Description */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <SkeletonLine width="120px" height="13px" />
          <SkeletonBox width="100%" height="80px" radius={8} />
        </div>

        {/* Footer Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '16px', borderTop: '1px solid var(--border-default)' }}>
          <SkeletonBtn width="100px" height="40px" />
          <SkeletonBtn width="140px" height="40px" />
        </div>
      </div>
    </section>
  );
}
