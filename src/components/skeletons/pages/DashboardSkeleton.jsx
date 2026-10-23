import React from 'react';
import {
  SkeletonLine,
  SkeletonCircle,
  SkeletonPill,
  SkeletonBtn,
  SkeletonBox
} from '../SkeletonPrimitives';

export function HeroBannerSkeleton() {
  return (
    <div className="home-interactive-banner" id="skeletonHomeHeroBanner" style={{ marginBottom: '24px' }}>
      <div className="banner-ambient-glow" />
      <div className="banner-hex-pattern" />

      <div className="banner-slides-wrapper" style={{ minHeight: '140px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="banner-left-content" style={{ maxWidth: '640px', zIndex: 2 }}>
          {/* Pill Tag Skeleton */}
          <div className="banner-skeleton-pill" />

          {/* Headline Skeleton */}
          <div className="banner-skeleton-title" style={{ marginTop: '4px' }} />

          {/* Subtext Skeleton */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', margin: '4px 0 6px' }}>
            <div className="banner-skeleton-desc-line" style={{ width: '520px', maxWidth: '100%' }} />
            <div className="banner-skeleton-desc-line" style={{ width: '400px', maxWidth: '85%' }} />
          </div>

          {/* CTA Group Skeleton */}
          <div className="banner-cta-group" style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
            <div className="banner-skeleton-btn-white" />
            <div className="banner-skeleton-btn-ghost" />
          </div>
        </div>

        {/* Right Floating Media Cluster Skeleton */}
        <div className="banner-right-visual" style={{ zIndex: 2, paddingRight: '12px' }}>
          <div className="floating-media-cluster">
            <div className="banner-skeleton-bubble" style={{ width: '60px', height: '60px', zIndex: 1 }} />
            <div className="banner-skeleton-bubble" style={{ width: '96px', height: '96px', marginLeft: '-20px', zIndex: 4, border: '4px solid #FFFFFF' }} />
            <div className="banner-skeleton-bubble" style={{ width: '64px', height: '64px', marginLeft: '-20px', zIndex: 2 }} />
            <div className="banner-skeleton-bubble" style={{ width: '50px', height: '50px', marginLeft: '-16px', zIndex: 1 }} />
          </div>
        </div>
      </div>

      {/* Banner Navigation Dots Indicator Skeleton */}
      <div className="banner-dots-cluster" style={{ marginTop: '14px', zIndex: 3 }}>
        <div style={{ width: '24px', height: '8px', borderRadius: '999px', background: '#FFFFFF', opacity: 0.9 }} />
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.35)' }} />
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.35)' }} />
      </div>
    </div>
  );
}

export default function DashboardSkeleton() {
  return (
    <section className="app-view active skeleton-page-view" id="skeletonViewDashboard">
      {/* Quick Actions Section Skeleton */}
      <div className="home-quick-actions-section" style={{ marginBottom: '28px' }}>
        <div className="home-section-header" style={{ marginBottom: '14px' }}>
          <SkeletonLine width="160px" height="20px" style={{ borderRadius: '6px' }} />
        </div>

        <div className="qa-horizontal-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="qa-linear-card" style={{ padding: '16px 20px', background: '#FFFFFF', border: '1px solid var(--border-default)', borderRadius: '14px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                <SkeletonBox width="44px" height="44px" radius={12} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <SkeletonLine width="130px" height="15px" />
                  <SkeletonLine width="170px" height="11px" />
                </div>
              </div>
              <SkeletonBox width="88px" height="38px" radius={9999} />
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activities Section Skeleton */}
      <div className="home-recent-activities-section">
        <div className="home-section-header" style={{ marginBottom: '14px' }}>
          <SkeletonLine width="180px" height="20px" style={{ borderRadius: '6px' }} />
        </div>

        <div className="figma-recent-activities-card full-screen-width" style={{ background: '#FFFFFF', border: '1px solid var(--border-default)', borderRadius: '14px', padding: '20px' }}>
          {/* Top Bar */}
          <div className="recent-act-top-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <SkeletonLine width="36px" height="24px" style={{ borderRadius: '6px' }} />
                <SkeletonLine width="50px" height="12px" />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <SkeletonPill width={68} height={32} style={{ borderRadius: '8px' }} />
                <SkeletonPill width={85} height={32} style={{ borderRadius: '8px' }} />
                <SkeletonPill width={76} height={32} style={{ borderRadius: '8px' }} />
                <SkeletonPill width={90} height={32} style={{ borderRadius: '8px' }} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <SkeletonBox width="340px" height="42px" radius={9999} />
              <SkeletonBox width="88px" height="38px" radius={9999} />
            </div>
          </div>

          {/* Activity items table matching real columns (#, Item & Details, Type, Metric / Info, Date Posted, Status, Active) */}
          <div style={{ overflowX: 'auto' }}>
            <table className="recent-products-table">
              <colgroup>
                <col style={{ width: '44px' }} />
                <col style={{ width: '35%' }} />
                <col style={{ width: '11%' }} />
                <col style={{ width: '17%' }} />
                <col style={{ width: '14%' }} />
                <col style={{ width: '11%' }} />
                <col style={{ width: '90px' }} />
              </colgroup>
              <thead>
                <tr>
                  <th style={{ width: '44px' }}>
                    <SkeletonLine width="16px" height="12px" />
                  </th>
                  <th style={{ width: '35%' }}>
                    <SkeletonLine width="110px" height="12px" />
                  </th>
                  <th style={{ width: '11%' }}>
                    <SkeletonLine width="48px" height="12px" />
                  </th>
                  <th style={{ width: '17%' }}>
                    <SkeletonLine width="90px" height="12px" />
                  </th>
                  <th style={{ width: '14%' }}>
                    <SkeletonLine width="80px" height="12px" />
                  </th>
                  <th style={{ width: '11%' }}>
                    <SkeletonLine width="55px" height="12px" />
                  </th>
                  <th style={{ textAlign: 'center', width: '90px', paddingRight: '28px' }}>
                    <SkeletonLine width="42px" height="12px" style={{ margin: '0 auto', transform: 'translateX(-12px)' }} />
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 5 }).map((_, rIdx) => (
                  <tr key={rIdx}>
                    <td style={{ width: '44px' }}>
                      <SkeletonLine width="20px" height="12px" />
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <SkeletonBox width="42px" height="42px" radius={8} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                          <SkeletonLine width={`${160 + (rIdx % 3) * 35}px`} height="14px" />
                          <SkeletonLine width="180px" height="11px" />
                        </div>
                      </div>
                    </td>
                    <td>
                      <SkeletonPill width={55} height={22} style={{ borderRadius: '6px' }} />
                    </td>
                    <td>
                      <SkeletonLine width="130px" height="12px" />
                    </td>
                    <td>
                      <SkeletonLine width="90px" height="12px" />
                    </td>
                    <td>
                      <SkeletonPill width={78} height={22} style={{ borderRadius: '999px' }} />
                    </td>
                    <td style={{ textAlign: 'center', width: '90px', paddingRight: '28px' }}>
                      <SkeletonBox width="42px" height="24px" radius={9999} style={{ display: 'inline-block', transform: 'translateX(-12px)' }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

