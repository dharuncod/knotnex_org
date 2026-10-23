import React, { useRef } from 'react';

/**
 * Reusable, professional Knotnex search bar component.
 * Features symmetrical both-sides expansion animation on focus (cubic-bezier transition),
 * clean white focused state, icon micro-animation, and clear button.
 */
export default function SearchBar({
  value = '',
  onChange,
  onClear,
  placeholder = 'Search...',
  id,
  className = '',
  style = {},
  width,
  expandWidth,
  autoComplete = 'off',
  kbdShortcut,
  ...props
}) {
  const inputRef = useRef(null);

  const handleChange = (e) => {
    if (onChange) onChange(e);
  };

  const handleClear = () => {
    if (onClear) {
      onClear();
    } else if (onChange) {
      onChange({ target: { value: '' } });
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleContainerClick = (e) => {
    if (!e.target.closest('.knotnex-search-clear') && inputRef.current) {
      inputRef.current.focus();
    }
  };

  const baseW = width || '320px';
  let expW = expandWidth;
  if (!expW) {
    const num = parseInt(baseW, 10);
    if (!isNaN(num)) {
      expW = `${num + 50}px`;
    } else {
      expW = '370px';
    }
  }

  const animationStyles = {
    '--base-width': baseW,
    '--expand-width': expW,
  };

  return (
    <div
      className={`knotnex-search-wrapper ${className}`}
      style={{
        ...animationStyles,
        ...style
      }}
    >
      <div
        className="knotnex-search-bar"
        onClick={handleContainerClick}
      >
        <svg
          className="knotnex-search-icon"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          className="knotnex-search-input"
          placeholder={placeholder}
          id={id}
          autoComplete={autoComplete}
          value={value}
          onChange={handleChange}
          {...props}
        />
        {value && (
          <button
            type="button"
            className="knotnex-search-clear"
            aria-label="Clear search"
            onClick={handleClear}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
