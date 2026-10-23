import React from 'react';
import {
  SkeletonLine,
  SkeletonCircle,
  SkeletonPill,
  SkeletonBox
} from '../SkeletonPrimitives';

export default function ActivitiesStreamSkeleton({ count = 5 }) {
  return (
    <div className="skeleton-fade-in" style={{ overflowX: 'auto' }}>
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
          {Array.from({ length: count }).map((_, rIdx) => (
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
  );
}
