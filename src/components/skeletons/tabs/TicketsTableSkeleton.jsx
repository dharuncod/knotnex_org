import React from 'react';
import {
  SkeletonLine,
  SkeletonCircle,
  SkeletonPill
} from '../SkeletonPrimitives';

export default function TicketsTableSkeleton({ rows = 5 }) {
  return (
    <div className="table-responsive-wrapper skeleton-fade-in" style={{ overflowX: 'auto' }}>
      <table className="recent-products-table" id="ticketsTableSkeleton" style={{ width: '100%', tableLayout: 'fixed' }}>
        <colgroup>
          <col style={{ width: '48px' }} />
          <col style={{ width: '14%' }} />
          <col style={{ width: '18%' }} />
          <col style={{ width: '18%' }} />
          <col style={{ width: '25%' }} />
          <col style={{ width: '11%' }} />
          <col style={{ width: '14%' }} />
        </colgroup>
        <thead>
          <tr>
            <th className="col-center" style={{ width: '48px' }}><SkeletonLine width="20px" height="12px" /></th>
            <th><SkeletonLine width="80px" height="12px" /></th>
            <th><SkeletonLine width="100px" height="12px" /></th>
            <th><SkeletonLine width="95px" height="12px" /></th>
            <th><SkeletonLine width="110px" height="12px" /></th>
            <th style={{ paddingLeft: '36px' }}><SkeletonLine width="55px" height="12px" /></th>
            <th className="col-right"><SkeletonLine width="45px" height="12px" /></th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, idx) => (
            <tr key={idx} className="skeleton-table-row">
              <td className="col-center"><SkeletonLine width="20px" height="13px" /></td>
              <td>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <SkeletonLine width="60px" height="13px" />
                  <SkeletonPill width={50} height={18} />
                </div>
              </td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <SkeletonCircle size={32} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <SkeletonLine width="100px" height="13px" />
                    <SkeletonLine width="60px" height="10px" />
                  </div>
                </div>
              </td>
              <td>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <SkeletonLine width="90px" height="13px" />
                  <SkeletonLine width="120px" height="10px" />
                </div>
              </td>
              <td>
                <SkeletonLine width="90%" height="13px" />
              </td>
              <td style={{ paddingLeft: '36px' }}>
                <SkeletonLine width="45px" height="13px" />
              </td>
              <td className="col-right">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <SkeletonPill width={55} height={32} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
