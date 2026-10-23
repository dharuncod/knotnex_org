import React from 'react';
import {
  SkeletonLine,
  SkeletonCircle,
  SkeletonPill
} from '../SkeletonPrimitives';

export default function AttendeesTableSkeleton({ rows = 6 }) {
  return (
    <div className="table-responsive-wrapper skeleton-fade-in" style={{ overflowX: 'auto' }}>
      <table className="recent-products-table">
        <thead>
          <tr>
            <th style={{ width: '40px' }}><SkeletonLine width="16px" height="12px" /></th>
            <th style={{ width: '20%' }}><SkeletonLine width="100px" height="12px" /></th>
            <th style={{ width: '16%' }}><SkeletonLine width="90px" height="12px" /></th>
            <th style={{ width: '12%' }}><SkeletonLine width="75px" height="12px" /></th>
            <th style={{ width: '10%' }}><SkeletonLine width="65px" height="12px" /></th>
            <th style={{ width: '11%' }}><SkeletonLine width="80px" height="12px" /></th>
            <th style={{ width: '10%' }}><SkeletonLine width="60px" height="12px" /></th>
            <th style={{ width: '10%' }}><SkeletonLine width="65px" height="12px" /></th>
            <th style={{ width: '11%' }}><SkeletonLine width="80px" height="12px" /></th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, idx) => (
            <tr key={idx} className="skeleton-table-row">
              <td><SkeletonLine width="18px" height="12px" /></td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <SkeletonCircle size={34} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <SkeletonLine width="120px" height="13px" />
                    <SkeletonLine width="80px" height="10px" />
                  </div>
                </div>
              </td>
              <td><SkeletonLine width="140px" height="12px" /></td>
              <td><SkeletonLine width="95px" height="12px" /></td>
              <td><SkeletonPill width={75} height={20} /></td>
              <td><SkeletonLine width="70px" height="12px" /></td>
              <td><SkeletonLine width="60px" height="12px" /></td>
              <td><SkeletonLine width="65px" height="12px" /></td>
              <td>
                <SkeletonPill width={80} height={24} style={{ borderRadius: '999px' }} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
