import React from 'react';
import {
  SkeletonLine,
  SkeletonCircle,
  SkeletonPill,
  SkeletonBtn
} from '../SkeletonPrimitives';

export default function PassesTableSkeleton({ rows = 6 }) {
  return (
    <div className="table-responsive-wrapper skeleton-fade-in" style={{ overflowX: 'auto' }}>
      <table className="recent-products-table">
        <thead>
          <tr>
            <th style={{ width: '48px' }}><SkeletonLine width="16px" height="12px" /></th>
            <th style={{ width: '22%' }}><SkeletonLine width="90px" height="12px" /></th>
            <th style={{ width: '16%' }}><SkeletonLine width="75px" height="12px" /></th>
            <th style={{ width: '22%' }}><SkeletonLine width="110px" height="12px" /></th>
            <th style={{ width: '14%' }}><SkeletonLine width="65px" height="12px" /></th>
            <th style={{ width: '12%' }}><SkeletonLine width="60px" height="12px" /></th>
            <th style={{ width: '14%' }}><SkeletonLine width="60px" height="12px" /></th>
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
                    <SkeletonLine width="110px" height="12px" />
                    <SkeletonLine width="80px" height="10px" />
                  </div>
                </div>
              </td>
              <td><SkeletonPill width={75} height={20} style={{ borderRadius: '6px' }} /></td>
              <td><SkeletonLine width="140px" height="12px" /></td>
              <td><SkeletonPill width={75} height={20} style={{ borderRadius: '999px' }} /></td>
              <td><SkeletonPill width={70} height={20} style={{ borderRadius: '999px' }} /></td>
              <td>
                <SkeletonBtn width="75px" height="30px" style={{ borderRadius: '6px' }} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
