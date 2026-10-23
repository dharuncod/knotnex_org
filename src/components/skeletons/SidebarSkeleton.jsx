import React from 'react';
import { useApp } from '../../context/AppContext';
import { SkeletonLine, SkeletonCircle, SkeletonBox } from './SkeletonPrimitives';

export default function SidebarSkeleton() {
  const { isSidebarCollapsed } = useApp() || {};

  return (
    <aside
      className={`sidebar skeleton-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}
      id="skeletonSidebar"
      style={{ pointerEvents: 'none' }}
    >
      {/* Edge collapse button placeholder */}
      <div
        className="sidebar-edge-toggle-btn"
        style={{ pointerEvents: 'none', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <SkeletonCircle size={12} />
      </div>

      <div className="sidebar-scrollable-content" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Top Brand Logo Skeleton */}
        <div className="sidebar-brand-container" style={{ padding: '8px 10px 24px', display: 'flex', alignItems: 'center' }}>
          {!isSidebarCollapsed ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <SkeletonBox width="112px" height="28px" radius={6} />
              <SkeletonLine width="24px" height="14px" />
            </div>
          ) : (
            <SkeletonBox width="34px" height="34px" radius={8} />
          )}
        </div>

        <nav className="sidebar-nav-tree" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* Section 1: MAIN MENU */}
          <div className="nav-group-section" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {!isSidebarCollapsed && <SkeletonLine width="68px" height="10px" style={{ marginLeft: '10px' }} />}
            {/* Home pill */}
            <div
              style={{
                height: '42px',
                borderRadius: '9999px',
                background: 'rgba(99, 54, 235, 0.06)',
                border: '1px solid rgba(99, 54, 235, 0.12)',
                display: 'flex',
                alignItems: 'center',
                padding: isSidebarCollapsed ? '0' : '0 14px',
                justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
                gap: '12px'
              }}
            >
              <SkeletonCircle size={18} />
              {!isSidebarCollapsed && <SkeletonLine width="65px" height="13px" />}
            </div>
          </div>

          {/* Section 2: MANAGEMENTS */}
          <div className="nav-group-section" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {!isSidebarCollapsed && <SkeletonLine width="84px" height="10px" style={{ marginLeft: '10px' }} />}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {/* Events Item */}
              <div
                style={{
                  height: '40px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isSidebarCollapsed ? 'center' : 'space-between',
                  padding: isSidebarCollapsed ? '0' : '0 14px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <SkeletonCircle size={18} />
                  {!isSidebarCollapsed && <SkeletonLine width="68px" height="13px" />}
                </div>
                {!isSidebarCollapsed && <SkeletonBox width="8px" height="6px" radius={2} />}
              </div>

              {/* Careers Item */}
              <div
                style={{
                  height: '40px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isSidebarCollapsed ? 'center' : 'space-between',
                  padding: isSidebarCollapsed ? '0' : '0 14px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <SkeletonCircle size={18} />
                  {!isSidebarCollapsed && <SkeletonLine width="72px" height="13px" />}
                </div>
                {!isSidebarCollapsed && <SkeletonBox width="8px" height="6px" radius={2} />}
              </div>

              {/* Schemes Item */}
              <div
                style={{
                  height: '40px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isSidebarCollapsed ? 'center' : 'space-between',
                  padding: isSidebarCollapsed ? '0' : '0 14px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <SkeletonCircle size={18} />
                  {!isSidebarCollapsed && <SkeletonLine width="76px" height="13px" />}
                </div>
                {!isSidebarCollapsed && <SkeletonBox width="8px" height="6px" radius={2} />}
              </div>
            </div>
          </div>

          {/* Section 3: HELP & SUPPORT */}
          <div className="nav-group-section" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {!isSidebarCollapsed && <SkeletonLine width="90px" height="10px" style={{ marginLeft: '10px' }} />}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {/* Support */}
              <div
                style={{
                  height: '40px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
                  padding: isSidebarCollapsed ? '0' : '0 14px',
                  gap: '12px'
                }}
              >
                <SkeletonCircle size={18} />
                {!isSidebarCollapsed && <SkeletonLine width="85px" height="13px" />}
              </div>

              {/* Settings */}
              <div
                style={{
                  height: '40px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
                  padding: isSidebarCollapsed ? '0' : '0 14px',
                  gap: '12px'
                }}
              >
                <SkeletonCircle size={18} />
                {!isSidebarCollapsed && <SkeletonLine width="64px" height="13px" />}
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Bottom Support Card Box Skeleton */}
      {!isSidebarCollapsed && (
        <div
          className="sidebar-support-card"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '8px',
            padding: '16px 14px',
            marginTop: 'auto'
          }}
        >
          <SkeletonCircle size={40} />
          <SkeletonLine width="92px" height="14px" style={{ margin: '4px 0 2px' }} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', width: '100%' }}>
            <SkeletonLine width="138px" height="10px" />
            <SkeletonLine width="105px" height="10px" />
          </div>
          <SkeletonBox width="100%" height="34px" radius={9999} style={{ marginTop: '6px' }} />
        </div>
      )}
    </aside>
  );
}

