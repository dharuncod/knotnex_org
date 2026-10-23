import React from 'react';
import {
  SkeletonLine,
  SkeletonCircle,
  SkeletonPill,
  SkeletonBtn,
  SkeletonBox
} from '../SkeletonPrimitives';

export function JobCardsSkeleton({ count = 4 }) {
  return (
    <div className="skeleton-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} style={{ background: '#FFFFFF', border: '1px solid var(--border-default)', borderRadius: '14px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <SkeletonBox width="52px" height="52px" radius={10} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <SkeletonLine width="200px" height="16px" style={{ borderRadius: '4px' }} />
                <SkeletonPill width={70} height={20} />
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <SkeletonLine width="110px" height="11px" />
                <SkeletonLine width="90px" height="11px" />
                <SkeletonLine width="80px" height="11px" />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
              <SkeletonLine width="90px" height="13px" />
              <SkeletonLine width="60px" height="10px" />
            </div>
            <SkeletonBtn width="100px" height="36px" style={{ borderRadius: '8px' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ApplicationsTableSkeleton({ rows = 5 }) {
  return (
    <div className="table-responsive-wrapper skeleton-fade-in" style={{ background: '#FFFFFF', border: '1px solid var(--border-default)', borderRadius: '14px', overflowX: 'auto' }}>
      <table className="recent-products-table">
        <thead>
          <tr>
            <th style={{ width: '25%' }}><SkeletonLine width="90px" height="12px" /></th>
            <th style={{ width: '25%' }}><SkeletonLine width="110px" height="12px" /></th>
            <th style={{ width: '18%' }}><SkeletonLine width="75px" height="12px" /></th>
            <th style={{ width: '16%' }}><SkeletonLine width="80px" height="12px" /></th>
            <th style={{ width: '16%', textAlign: 'right' }}><SkeletonLine width="60px" height="12px" style={{ marginLeft: 'auto' }} /></th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, idx) => (
            <tr key={idx} className="skeleton-table-row">
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <SkeletonCircle size={36} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <SkeletonLine width="120px" height="13px" />
                    <SkeletonLine width="80px" height="10px" />
                  </div>
                </div>
              </td>
              <td><SkeletonLine width="140px" height="13px" /></td>
              <td><SkeletonLine width="80px" height="12px" /></td>
              <td><SkeletonPill width={75} height={22} style={{ borderRadius: '999px' }} /></td>
              <td style={{ textAlign: 'right' }}>
                <SkeletonBtn width="80px" height="30px" style={{ borderRadius: '6px', marginLeft: 'auto' }} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
