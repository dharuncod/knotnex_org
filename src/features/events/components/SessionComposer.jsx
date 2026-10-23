import React, { useState } from 'react';

export default function SessionComposer({ initial, onSave, onCancel, defaultDate = '' }) {
  const [form, setForm] = useState(
    initial || {
      category: 'Keynote',
      title: '',
      time: '',
      date: defaultDate || '',
      speaker: '',
      location: '',
      description: ''
    }
  );
  const [errors, setErrors] = useState({});

  const categories = [
    'Keynote',
    'Workshop',
    'Panel Discussion',
    'Presentation',
    'Break & Networking',
    'Q&A Session'
  ];

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k]) setErrors(errs => ({ ...errs, [k]: null }));
  };

  const handleQuickCategory = (cat) => {
    set('category', cat);
    if (!form.title.trim()) {
      if (cat === 'Break & Networking') set('title', 'Networking & Coffee Break');
      else if (cat === 'Keynote') set('title', 'Opening Keynote');
      else if (cat === 'Panel Discussion') set('title', 'Industry Panel Discussion');
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const newErrors = {};
    if (!form.title || !form.title.trim()) newErrors.title = 'Session title is required';
    if (!form.time || !form.time.trim()) newErrors.time = 'Time is required';
    if (!form.date || !form.date.trim()) newErrors.date = 'Date is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      category: form.category || 'Keynote',
      title: form.title.trim(),
      time: form.time.trim(),
      date: form.date.trim(),
      speaker: (form.speaker || '').trim(),
      location: (form.location || '').trim(),
      description: (form.description || '').trim()
    });
  };

  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: 14,
      border: '1.5px solid #6336EB',
      boxShadow: '0 8px 24px rgba(99, 54, 235, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05)',
      padding: '18px 20px',
      marginBottom: 14,
      transition: 'all 0.18s ease'
    }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, paddingBottom: 10, borderBottom: '1px solid #F1F5F9' }}>
        <div>
          <span style={{ fontSize: 13.5, fontWeight: 700, color: '#1E1B4B' }}>
            {initial && initial.id ? 'Edit Session' : 'Add New Session'}
          </span>
          <span style={{ fontSize: 12, color: '#64748B', marginLeft: 10 }}>
            {initial && initial.id ? 'Modify schedule slot details inline' : 'Configure schedule slot details inline'}
          </span>
        </div>
        <button
          type="button"
          onClick={onCancel}
          style={{
            background: 'none',
            border: 'none',
            color: '#64748B',
            fontSize: 12.5,
            fontWeight: 600,
            cursor: 'pointer',
            padding: '3px 8px',
            borderRadius: 6
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#1E1B4B'}
          onMouseLeave={e => e.currentTarget.style.color = '#64748B'}
        >
          Cancel
        </button>
      </div>

      {/* Format Selector Pills (pure text, NO icons) */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 7 }}>
          Format
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {categories.map(cat => {
            const isActive = form.category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleQuickCategory(cat)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: isActive ? 700 : 500,
                  background: isActive ? '#6336EB' : '#F8FAFC',
                  color: isActive ? '#FFFFFF' : '#475569',
                  border: `1.5px solid ${isActive ? '#6336EB' : '#E2E8F0'}`,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Session Title (pure text input, NO icons) */}
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
          Session Title <span style={{ color: '#EF4444' }}>*</span>
        </label>
        <input
          type="text"
          value={form.title}
          onChange={e => set('title', e.target.value)}
          placeholder="e.g. Welcome Note & Keynote Session"
          style={{
            width: '100%',
            height: 38,
            borderRadius: 8,
            border: `1.5px solid ${errors.title ? '#EF4444' : '#E2E8F0'}`,
            padding: '0 12px',
            fontSize: 13,
            color: '#0F172A',
            background: '#FFFFFF',
            boxSizing: 'border-box',
            outline: 'none'
          }}
          onFocus={e => e.target.style.borderColor = '#6336EB'}
          onBlur={e => e.target.style.borderColor = errors.title ? '#EF4444' : '#E2E8F0'}
        />
        {errors.title && <div style={{ fontSize: 11.5, color: '#EF4444', marginTop: 4 }}>{errors.title}</div>}
      </div>

      {/* Date & Time Row (pure text inputs, NO icons) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
            Date <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <input
            type="text"
            value={form.date}
            onChange={e => set('date', e.target.value)}
            placeholder="e.g. Oct 6, 2026"
            style={{
              width: '100%',
              height: 38,
              borderRadius: 8,
              border: `1.5px solid ${errors.date ? '#EF4444' : '#E2E8F0'}`,
              padding: '0 12px',
              fontSize: 13,
              color: '#0F172A',
              background: '#FFFFFF',
              boxSizing: 'border-box',
              outline: 'none'
            }}
            onFocus={e => e.target.style.borderColor = '#6336EB'}
            onBlur={e => e.target.style.borderColor = errors.date ? '#EF4444' : '#E2E8F0'}
          />
          {errors.date && <div style={{ fontSize: 11.5, color: '#EF4444', marginTop: 4 }}>{errors.date}</div>}
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
            Time / Slot <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <input
            type="text"
            value={form.time}
            onChange={e => set('time', e.target.value)}
            placeholder="e.g. 10:00 AM - 11:30 AM"
            style={{
              width: '100%',
              height: 38,
              borderRadius: 8,
              border: `1.5px solid ${errors.time ? '#EF4444' : '#E2E8F0'}`,
              padding: '0 12px',
              fontSize: 13,
              color: '#0F172A',
              background: '#FFFFFF',
              boxSizing: 'border-box',
              outline: 'none'
            }}
            onFocus={e => e.target.style.borderColor = '#6336EB'}
            onBlur={e => e.target.style.borderColor = errors.time ? '#EF4444' : '#E2E8F0'}
          />
          {errors.time && <div style={{ fontSize: 11.5, color: '#EF4444', marginTop: 4 }}>{errors.time}</div>}
        </div>
      </div>

      {/* Speaker & Location Row (pure text inputs, NO icons) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
            Speaker / Host <span style={{ fontSize: 11, fontWeight: 400, color: '#94A3B8' }}>(optional)</span>
          </label>
          <input
            type="text"
            value={form.speaker || ''}
            onChange={e => set('speaker', e.target.value)}
            placeholder="e.g. Priya Nair"
            style={{
              width: '100%',
              height: 38,
              borderRadius: 8,
              border: '1.5px solid #E2E8F0',
              padding: '0 12px',
              fontSize: 13,
              color: '#0F172A',
              background: '#FFFFFF',
              boxSizing: 'border-box',
              outline: 'none'
            }}
            onFocus={e => e.target.style.borderColor = '#6336EB'}
            onBlur={e => e.target.style.borderColor = '#E2E8F0'}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
            Room / Hall / Track <span style={{ fontSize: 11, fontWeight: 400, color: '#94A3B8' }}>(optional)</span>
          </label>
          <input
            type="text"
            value={form.location || ''}
            onChange={e => set('location', e.target.value)}
            placeholder="e.g. Main Auditorium"
            style={{
              width: '100%',
              height: 38,
              borderRadius: 8,
              border: '1.5px solid #E2E8F0',
              padding: '0 12px',
              fontSize: 13,
              color: '#0F172A',
              background: '#FFFFFF',
              boxSizing: 'border-box',
              outline: 'none'
            }}
            onFocus={e => e.target.style.borderColor = '#6336EB'}
            onBlur={e => e.target.style.borderColor = '#E2E8F0'}
          />
        </div>
      </div>

      {/* Description textarea */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
          Description <span style={{ fontSize: 11, fontWeight: 400, color: '#94A3B8' }}>(optional)</span>
        </label>
        <textarea
          value={form.description || ''}
          onChange={e => set('description', e.target.value)}
          placeholder="Brief overview of agenda topics, key takeaways, or session notes..."
          rows={3}
          style={{
            width: '100%',
            borderRadius: 8,
            border: '1.5px solid #E2E8F0',
            padding: '9px 12px',
            fontSize: 13,
            color: '#0F172A',
            background: '#FFFFFF',
            boxSizing: 'border-box',
            outline: 'none',
            resize: 'none',
            fontFamily: 'inherit',
            lineHeight: 1.5
          }}
          onFocus={e => e.target.style.borderColor = '#6336EB'}
          onBlur={e => e.target.style.borderColor = '#E2E8F0'}
        />
      </div>

      {/* Action Buttons (pure text, NO icons) */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 10 }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            height: 36,
            padding: '0 16px',
            borderRadius: 8,
            border: '1.5px solid #E2E8F0',
            background: '#FFFFFF',
            color: '#475569',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          style={{
            height: 36,
            padding: '0 20px',
            borderRadius: 8,
            border: 'none',
            background: '#6336EB',
            color: '#FFFFFF',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(99, 54, 235, 0.25)'
          }}
        >
          {initial && initial.id ? 'Save Changes' : 'Add to Schedule'}
        </button>
      </div>
    </div>
  );
}
