import React from 'react';
import {
  SkeletonLine,
  SkeletonCircle,
  SkeletonPill,
  SkeletonBtn,
  SkeletonBox
} from '../SkeletonPrimitives';

export function SchemesListSkeleton({ count = 4 }) {
  return (
    <div className="skeleton-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} style={{ background: '#FFFFFF', border: '1px solid var(--border-default)', borderRadius: '14px', padding: '22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: '280px' }}>
            <SkeletonBox width="50px" height="50px" radius={10} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <SkeletonLine width="240px" height="17px" style={{ borderRadius: '4px' }} />
                <SkeletonPill width={80} height={20} />
              </div>
              <SkeletonLine width="80%" height="12px" />
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <SkeletonLine width="110px" height="11px" />
                <SkeletonLine width="90px" height="11px" />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
              <SkeletonLine width="100px" height="16px" style={{ borderRadius: '4px' }} />
              <SkeletonLine width="65px" height="10px" />
            </div>
            <SkeletonBtn width="110px" height="38px" style={{ borderRadius: '8px' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SchemeApplicationsSkeleton({ rows = 5 }) {
  return (
    <div className="table-responsive-wrapper skeleton-fade-in" style={{ background: '#FFFFFF', border: '1px solid var(--border-default)', borderRadius: '14px', overflowX: 'auto' }}>
      <table className="recent-products-table">
        <thead>
          <tr>
            <th style={{ width: '22%' }}><SkeletonLine width="90px" height="12px" /></th>
            <th style={{ width: '24%' }}><SkeletonLine width="120px" height="12px" /></th>
            <th style={{ width: '16%' }}><SkeletonLine width="80px" height="12px" /></th>
            <th style={{ width: '14%' }}><SkeletonLine width="75px" height="12px" /></th>
            <th style={{ width: '10%', textAlign: 'center' }}><SkeletonLine width="45px" height="12px" style={{ margin: '0 auto' }} /></th>
            <th style={{ width: '14%', textAlign: 'right' }}><SkeletonLine width="60px" height="12px" style={{ marginLeft: 'auto' }} /></th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, idx) => (
            <tr key={idx} className="skeleton-table-row">
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <SkeletonCircle size={34} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <SkeletonLine width="110px" height="13px" />
                    <SkeletonLine width="75px" height="10px" />
                  </div>
                </div>
              </td>
              <td><SkeletonLine width="160px" height="13px" /></td>
              <td><SkeletonLine width="90px" height="12px" /></td>
              <td><SkeletonPill width={80} height={22} style={{ borderRadius: '999px' }} /></td>
              <td style={{ textAlign: 'center' }}>
                <SkeletonBtn width="55px" height="26px" style={{ borderRadius: '6px', margin: '0 auto' }} />
              </td>
              <td style={{ textAlign: 'right' }}>
                <SkeletonBtn width="75px" height="28px" style={{ borderRadius: '6px', marginLeft: 'auto' }} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
