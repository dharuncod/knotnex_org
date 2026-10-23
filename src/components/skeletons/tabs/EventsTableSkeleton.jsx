import React from 'react';
import {
  SkeletonLine,
  SkeletonCircle,
  SkeletonPill,
  SkeletonBox,
  SkeletonCheckbox
} from '../SkeletonPrimitives';

export default function EventsTableSkeleton({ rows = 6 }) {
  return (
    <div className="table-responsive-wrapper skeleton-fade-in" style={{ overflowX: 'auto' }}>
      <table className="recent-products-table">
        <thead>
          <tr>
            <th style={{ width: '40px' }}><SkeletonCheckbox /></th>
            <th style={{ width: '28%' }}><SkeletonLine width="110px" height="12px" /></th>
            <th style={{ width: '16%' }}><SkeletonLine width="90px" height="12px" /></th>
            <th style={{ width: '18%' }}><SkeletonLine width="130px" height="12px" /></th>
            <th style={{ width: '12%' }}><SkeletonLine width="75px" height="12px" /></th>
            <th style={{ width: '14%' }}><SkeletonLine width="80px" height="12px" /></th>
            <th style={{ width: '60px', textAlign: 'right' }}><SkeletonLine width="30px" height="12px" style={{ marginLeft: 'auto' }} /></th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, idx) => (
            <tr key={idx} className="skeleton-table-row">
              <td><SkeletonCheckbox /></td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <SkeletonBox width="46px" height="46px" radius={8} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                    <SkeletonLine width={`${70 + (idx % 3) * 10}%`} height="14px" style={{ borderRadius: '4px' }} />
                    <SkeletonLine width={`${45 + (idx % 2) * 20}%`} height="11px" style={{ borderRadius: '3px' }} />
                  </div>
                </div>
              </td>
              <td>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <SkeletonPill width={82} height={22} />
                  <SkeletonLine width="80px" height="10px" />
                </div>
              </td>
              <td>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxWidth: '180px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <SkeletonLine width="80px" height="11px" />
                    <SkeletonLine width="30px" height="11px" />
                  </div>
                  <SkeletonBox width="100%" height="7px" radius={999} />
                </div>
              </td>
              <td>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <SkeletonLine width="65px" height="14px" />
                  <SkeletonLine width="45px" height="10px" />
                </div>
              </td>
              <td>
                <SkeletonPill width={85} height={24} style={{ borderRadius: '999px' }} />
              </td>
              <td style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                  <SkeletonCircle size={28} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
