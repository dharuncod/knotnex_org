import React, { useState, useRef, useEffect } from 'react';
import PencilIcon from './PencilIcon';

export default function ClockTimePicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const [hour, setHour] = useState('09');
  const [minute, setMinute] = useState('00');
  const [period, setPeriod] = useState('AM');

  useEffect(() => {
    if (value) {
      const match = value.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
      if (match) {
        setHour(match[1].padStart(2, '0'));
        setMinute(match[2]);
        if (match[3]) setPeriod(match[3].toUpperCase());
      }
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const applyTime = (h, m, p) => {
    const formatted = `${h}:${m} ${p}`;
    onChange(formatted);
    setOpen(false);
  };

  const hoursList = ['09', '10', '11', '12', '01', '02', '03', '04', '05', '06', '07', '08'];
  const minutesList = ['00', '15', '30', '45'];

  const quickSlots = [
    { label: '09:00 AM', h: '09', m: '00', p: 'AM' },
    { label: '10:00 AM', h: '10', m: '00', p: 'AM' },
    { label: '11:30 AM', h: '11', m: '30', p: 'AM' },
    { label: '02:00 PM', h: '02', m: '00', p: 'PM' },
    { label: '04:00 PM', h: '04', m: '00', p: 'PM' },
    { label: '06:30 PM', h: '06', m: '30', p: 'PM' }
  ];

  return (
    <div style={{ position: 'relative' }} ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          background: '#F8F9FB',
          border: open ? '1.5px solid #6336EB' : '1px solid #E2E8F0',
          borderRadius: 20,
          padding: '7px 16px',
          fontSize: 13,
          fontWeight: 500,
          color: '#1E1B4B',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          boxShadow: open ? '0 0 0 3px rgba(99,54,235,0.1)' : 'none'
        }}
        onMouseEnter={(e) => { if (!open) e.currentTarget.style.borderColor = '#6336EB'; }}
        onMouseLeave={(e) => { if (!open) e.currentTarget.style.borderColor = '#E2E8F0'; }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6336EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
        <span>{value || <span style={{ color: '#94A3B8' }}>Add Time</span>}</span>
        <PencilIcon size={12} />
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            zIndex: 1000,
            width: 280,
            background: '#FFFFFF',
            borderRadius: 16,
            border: '1px solid #E2E8F0',
            boxShadow: '0 12px 36px rgba(0,0,0,0.12), 0 4px 12px rgba(99,54,235,0.06)',
            padding: '16px',
            animation: 'createDropdownSlideIn 0.2s cubic-bezier(0.16,1,0.3,1)',
            userSelect: 'none'
          }}
        >
          {/* Clock Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontSize: 20, fontWeight: 800, color: '#1E1B4B', fontFamily: 'monospace' }}>
                {hour}:{minute}
              </span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#6336EB' }}>
                {period}
              </span>
            </div>
            {/* AM / PM Toggle */}
            <div style={{ display: 'flex', background: '#F1F5F9', padding: 2, borderRadius: 8 }}>
              {['AM', 'PM'].map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPeriod(p)}
                  style={{
                    border: 'none',
                    background: period === p ? '#6336EB' : 'transparent',
                    color: period === p ? '#FFFFFF' : '#64748B',
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: 6,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Hour Selector Grid */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', marginBottom: 6, textTransform: 'uppercase' }}>
              Hour
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 4 }}>
              {hoursList.map(h => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setHour(h)}
                  style={{
                    height: 28,
                    border: 'none',
                    borderRadius: 6,
                    background: hour === h ? '#6336EB' : '#F8FAFC',
                    color: hour === h ? '#FFFFFF' : '#334155',
                    fontSize: 12,
                    fontWeight: hour === h ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.12s ease'
                  }}
                >
                  {parseInt(h, 10)}
                </button>
              ))}
            </div>
          </div>

          {/* Minute Selector */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', marginBottom: 6, textTransform: 'uppercase' }}>
              Minute
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
              {minutesList.map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMinute(m)}
                  style={{
                    height: 28,
                    border: 'none',
                    borderRadius: 6,
                    background: minute === m ? '#6336EB' : '#F8FAFC',
                    color: minute === m ? '#FFFFFF' : '#334155',
                    fontSize: 12,
                    fontWeight: minute === m ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.12s ease'
                  }}
                >
                  :{m}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Common Slots */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', marginBottom: 6, textTransform: 'uppercase' }}>
              Quick Slots
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {quickSlots.map(slot => (
                <button
                  key={slot.label}
                  type="button"
                  onClick={() => applyTime(slot.h, slot.m, slot.p)}
                  style={{
                    border: '1px solid #E2E8F0',
                    background: '#FFFFFF',
                    color: '#475569',
                    fontSize: 11,
                    fontWeight: 600,
                    padding: '3px 7px',
                    borderRadius: 6,
                    cursor: 'pointer'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#6336EB'; e.currentTarget.style.color = '#6336EB'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.color = '#475569'; }}
                >
                  {slot.label}
                </button>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F1F5F9', paddingTop: 10 }}>
            {value ? (
              <button
                type="button"
                onClick={() => { onChange(''); setOpen(false); }}
                style={{ background: 'none', border: 'none', fontSize: 12, fontWeight: 600, color: '#EF4444', cursor: 'pointer' }}
              >
                Clear
              </button>
            ) : <span />}
            <button
              type="button"
              onClick={() => applyTime(hour, minute, period)}
              style={{
                background: '#6336EB',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 8,
                padding: '6px 14px',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Set Time
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
