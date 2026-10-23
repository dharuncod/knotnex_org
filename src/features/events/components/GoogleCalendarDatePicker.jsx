import React, { useState, useRef, useEffect } from 'react';
import PencilIcon from './PencilIcon';

export default function GoogleCalendarDatePicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const today = new Date();
  const [viewDate, setViewDate] = useState(() => {
    if (value) {
      const parsed = new Date(value);
      if (!isNaN(parsed.getTime())) return parsed;
    }
    return today;
  });

  const [selectedDate, setSelectedDate] = useState(() => {
    if (value) {
      const parsed = new Date(value);
      if (!isNaN(parsed.getTime())) return parsed;
    }
    return null;
  });

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

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const prevMonthTotalDays = new Date(year, month, 0).getDate();

  const prevMonthDays = [];
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    prevMonthDays.push({ day: prevMonthTotalDays - i, isCurrentMonth: false, prev: true });
  }

  const currentMonthDays = [];
  for (let i = 1; i <= totalDays; i++) {
    currentMonthDays.push({ day: i, isCurrentMonth: true });
  }

  const remainingCells = 42 - (prevMonthDays.length + currentMonthDays.length);
  const nextMonthDays = [];
  for (let i = 1; i <= remainingCells; i++) {
    nextMonthDays.push({ day: i, isCurrentMonth: false, next: true });
  }

  const allCells = [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];

  const handlePrevMonth = (e) => {
    e.stopPropagation();
    setViewDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    setViewDate(new Date(year, month + 1, 1));
  };

  const handleSelectDay = (cell) => {
    let targetYear = year;
    let targetMonth = month;
    if (cell.prev) {
      targetMonth = month - 1;
      if (targetMonth < 0) { targetMonth = 11; targetYear--; }
    } else if (cell.next) {
      targetMonth = month + 1;
      if (targetMonth > 11) { targetMonth = 0; targetYear++; }
    }

    const newDate = new Date(targetYear, targetMonth, cell.day);
    setSelectedDate(newDate);
    const formatted = `${monthNames[targetMonth]} ${cell.day}, ${targetYear}`;
    onChange(formatted);
    setOpen(false);
  };

  const isToday = (dayNum, isCur) => {
    return isCur &&
      today.getDate() === dayNum &&
      today.getMonth() === month &&
      today.getFullYear() === year;
  };

  const isSelected = (dayNum, isCur) => {
    if (!selectedDate || !isCur) return false;
    return (
      selectedDate.getDate() === dayNum &&
      selectedDate.getMonth() === month &&
      selectedDate.getFullYear() === year
    );
  };

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
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <span>{value || <span style={{ color: '#94A3B8' }}>Add Date</span>}</span>
        <PencilIcon size={12} />
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            zIndex: 1000,
            width: 290,
            background: '#FFFFFF',
            borderRadius: 16,
            border: '1px solid #E2E8F0',
            boxShadow: '0 12px 36px rgba(0,0,0,0.12), 0 4px 12px rgba(99,54,235,0.06)',
            padding: '16px',
            animation: 'createDropdownSlideIn 0.2s cubic-bezier(0.16,1,0.3,1)',
            userSelect: 'none'
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#1E1B4B' }}>
              {monthNames[month]} {year}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <button
                type="button"
                onClick={handlePrevMonth}
                title="Previous month"
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  border: 'none',
                  background: 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#475569',
                  transition: 'background 0.15s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#F1F5F9')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                title="Next month"
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  border: 'none',
                  background: 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#475569',
                  transition: 'background 0.15s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#F1F5F9')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
            </div>
          </div>

          {/* Weekday Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', marginBottom: 6 }}>
            {daysOfWeek.map((d, idx) => (
              <span key={idx} style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', padding: '4px 0' }}>
                {d}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, textAlign: 'center' }}>
            {allCells.map((cell, idx) => {
              const selected = isSelected(cell.day, cell.isCurrentMonth);
              const todayDay = isToday(cell.day, cell.isCurrentMonth);

              return (
                <div
                  key={idx}
                  onClick={() => handleSelectDay(cell)}
                  style={{
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    fontSize: 12.5,
                    cursor: 'pointer',
                    fontWeight: selected ? 700 : todayDay ? 700 : 500,
                    color: selected ? '#FFFFFF' : cell.isCurrentMonth ? '#1E1B4B' : '#CBD5E1',
                    background: selected ? '#6336EB' : 'transparent',
                    border: todayDay && !selected ? '1.5px solid #6336EB' : 'none',
                    transition: 'all 0.12s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!selected) {
                      e.currentTarget.style.background = 'rgba(99,54,235,0.08)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!selected) {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  {cell.day}
                </div>
              );
            })}
          </div>

          {/* Quick Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F1F5F9', marginTop: 10, paddingTop: 10 }}>
            <button
              type="button"
              onClick={() => {
                const now = new Date();
                const formatted = `${monthNames[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
                onChange(formatted);
                setSelectedDate(now);
                setViewDate(now);
                setOpen(false);
              }}
              style={{
                background: 'none',
                border: 'none',
                fontSize: 12,
                fontWeight: 600,
                color: '#6336EB',
                cursor: 'pointer',
                padding: '2px 6px',
                borderRadius: 4
              }}
            >
              Today
            </button>
            {value && (
              <button
                type="button"
                onClick={() => {
                  onChange('');
                  setSelectedDate(null);
                  setOpen(false);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#EF4444',
                  cursor: 'pointer',
                  padding: '2px 6px',
                  borderRadius: 4
                }}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
