import React, { useState, useRef, useEffect } from 'react';
import PencilIcon from './PencilIcon';

export default function CitySearchLocationPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef(null);

  const popularCities = [
    { city: 'Bengaluru', state: 'Karnataka', type: 'Tech Capital' },
    { city: 'Mumbai', state: 'Maharashtra', type: 'Financial Hub' },
    { city: 'Delhi NCR', state: 'New Delhi', type: 'Metro' },
    { city: 'Chennai', state: 'Tamil Nadu', type: 'Metro Hub' },
    { city: 'Hyderabad', state: 'Telangana', type: 'HITEC City' },
    { city: 'Pune', state: 'Maharashtra', type: 'IT Hub' },
    { city: 'Kolkata', state: 'West Bengal', type: 'Metro' },
    { city: 'Ahmedabad', state: 'Gujarat', type: 'Business Hub' },
    { city: 'Kochi', state: 'Kerala', type: 'Coastal Hub' },
    { city: 'Coimbatore', state: 'Tamil Nadu', type: 'Tier-2 Hub' },
    { city: 'San Francisco', state: 'California, US', type: 'Global' },
    { city: 'London', state: 'United Kingdom', type: 'Global' },
    { city: 'Singapore', state: 'Singapore', type: 'Global' },
    { city: 'Online / Virtual', state: 'Remote', type: 'Worldwide' }
  ];

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

  const filtered = popularCities.filter(c =>
    c.city.toLowerCase().includes(query.toLowerCase()) ||
    c.state.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelectCity = (c) => {
    const full = c.type === 'Worldwide' ? c.city : `${c.city}, ${c.state}`;
    onChange(full);
    setOpen(false);
    setQuery('');
  };

  const handleCustomSubmit = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      onChange(query.trim());
      setOpen(false);
      setQuery('');
    }
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
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
        <span>{value || <span style={{ color: '#94A3B8' }}>Add Location</span>}</span>
        <PencilIcon size={12} />
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            zIndex: 1000,
            width: 310,
            background: '#FFFFFF',
            borderRadius: 16,
            border: '1px solid #E2E8F0',
            boxShadow: '0 12px 36px rgba(0,0,0,0.12), 0 4px 12px rgba(99,54,235,0.06)',
            padding: '14px',
            animation: 'createDropdownSlideIn 0.2s cubic-bezier(0.16,1,0.3,1)',
            userSelect: 'none'
          }}
        >
          {/* Search Input Box */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: '#F8FAFC',
            border: '1.5px solid #E2E8F0',
            borderRadius: 10,
            padding: '0 10px',
            height: 36,
            marginBottom: 10
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleCustomSubmit}
              placeholder="Search city or type venue..."
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: 12.5,
                color: '#1E1B4B',
                width: '100%'
              }}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#94A3B8', fontSize: 14 }}
              >
                ×
              </button>
            )}
          </div>

          {/* Cities List */}
          <div style={{ maxHeight: 220, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {filtered.length > 0 ? (
              filtered.map((c) => (
                <div
                  key={c.city}
                  onClick={() => handleSelectCity(c)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: 8,
                    cursor: 'pointer',
                    transition: 'background 0.12s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(99,54,235,0.06)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6336EB" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#1E1B4B' }}>{c.city}</div>
                      <div style={{ fontSize: 11, color: '#64748B' }}>{c.state}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: 10, background: '#F1F5F9', color: '#64748B', padding: '2px 6px', borderRadius: 4, fontWeight: 500 }}>
                    {c.type}
                  </span>
                </div>
              ))
            ) : (
              <div
                onClick={() => { onChange(query.trim()); setOpen(false); setQuery(''); }}
                style={{
                  padding: '10px',
                  borderRadius: 8,
                  background: 'rgba(99,54,235,0.06)',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: 12.5, fontWeight: 600, color: '#6336EB' }}>
                  Use "{query}" as Location
                </div>
                <div style={{ fontSize: 11, color: '#64748B' }}>Press Enter or click here</div>
              </div>
            )}
          </div>

          {/* Footer with Clear */}
          {value && (
            <div style={{ borderTop: '1px solid #F1F5F9', marginTop: 8, paddingTop: 8, textAlign: 'right' }}>
              <button
                type="button"
                onClick={() => { onChange(''); setOpen(false); }}
                style={{ background: 'none', border: 'none', fontSize: 12, fontWeight: 600, color: '#EF4444', cursor: 'pointer' }}
              >
                Clear Location
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
