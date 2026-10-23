import React, { useState, useRef, useEffect } from 'react';
import BackButton from '../../../components/common/BackButton';

export default function CoverCropScreen({ imageSrc, initialEventName, onApply, onCancel, onUploadNew }) {
  const [currentSrc, setCurrentSrc] = useState(imageSrc);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgNaturalSize, setImgNaturalSize] = useState({ width: 0, height: 0 });
  const [renderedRect, setRenderedRect] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [cropBox, setCropBox] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [activeDrag, setActiveDrag] = useState(null); // null | 'move' | 'tl' | 'tr' | 'bl' | 'br'
  const [dragStart, setDragStart] = useState({ mouseX: 0, mouseY: 0, boxX: 0, boxY: 0, boxW: 0, boxH: 0 });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showLivePreview, setShowLivePreview] = useState(false);

  const containerRef = useRef(null);
  const imgRef = useRef(null);
  const CROP_RATIO = 4.8; // Aspect ratio of event banner header (~1200 / 250)

  // Sync currentSrc if imageSrc prop changes
  useEffect(() => {
    setCurrentSrc(imageSrc);
  }, [imageSrc]);

  // Measure rendered image and initialize crop selection box
  const measureAndInit = () => {
    const container = containerRef.current;
    const img = imgRef.current;
    if (!container || !img) return;

    // Available workspace dimensions with comfortable padding
    const padding = 36;
    const cw = container.clientWidth || 900;
    const ch = container.clientHeight || 550;
    const maxW = Math.max(200, cw - padding * 2);
    const maxH = Math.max(200, ch - padding * 2);

    const nw = img.naturalWidth || 1200;
    const nh = img.naturalHeight || 400;
    setImgNaturalSize({ width: nw, height: nh });

    let rw, rh, rx, ry;
    if (nw / nh > maxW / maxH) {
      rw = maxW;
      rh = maxW / (nw / nh);
      rx = (cw - rw) / 2;
      ry = (ch - rh) / 2;
    } else {
      rh = maxH;
      rw = maxH * (nw / nh);
      rx = (cw - rw) / 2;
      ry = (ch - rh) / 2;
    }

    const rRect = { x: rx, y: ry, width: rw, height: rh };
    setRenderedRect(rRect);

    // Initial crop box fitting within renderedRect with CROP_RATIO (4.8:1)
    let bw, bh, bx, by;
    if (rw / rh >= CROP_RATIO) {
      bh = rh;
      bw = rh * CROP_RATIO;
      bx = rx + (rw - bw) / 2;
      by = ry;
    } else {
      bw = rw;
      bh = rw / CROP_RATIO;
      bx = rx;
      by = ry + (rh - bh) / 2;
    }

    setCropBox({ x: bx, y: by, width: bw, height: bh });
    setImgLoaded(true);
  };

  const handleImageLoad = () => {
    measureAndInit();
  };

  // Re-measure on window resize or when image loads/changes
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      measureAndInit();
    }
  }, [currentSrc]);

  useEffect(() => {
    window.addEventListener('resize', measureAndInit);
    return () => window.removeEventListener('resize', measureAndInit);
  }, []);

  // Generate live banner preview when cropBox changes
  useEffect(() => {
    if (!imgLoaded || !imgRef.current || cropBox.width <= 0 || renderedRect.width <= 0) return;
    const timer = setTimeout(() => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 600;
        canvas.height = Math.round(600 / CROP_RATIO);
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const scaleX = imgNaturalSize.width / renderedRect.width;
        const scaleY = imgNaturalSize.height / renderedRect.height;
        const sx = Math.max(0, (cropBox.x - renderedRect.x) * scaleX);
        const sy = Math.max(0, (cropBox.y - renderedRect.y) * scaleY);
        const sw = Math.min(imgNaturalSize.width - sx, cropBox.width * scaleX);
        const sh = Math.min(imgNaturalSize.height - sy, cropBox.height * scaleY);

        ctx.drawImage(imgRef.current, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
        setPreviewUrl(canvas.toDataURL('image/jpeg', 0.85));
      } catch (err) {
        console.error('Preview crop error:', err);
      }
    }, 40);
    return () => clearTimeout(timer);
  }, [cropBox, imgLoaded, renderedRect, imgNaturalSize, currentSrc]);

  // Rotate 90 degrees clockwise using offscreen canvas
  const handleRotate = () => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = img.height;
      c.height = img.width;
      const ctx = c.getContext('2d');
      ctx.translate(c.width / 2, c.height / 2);
      ctx.rotate((90 * Math.PI) / 180);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      setCurrentSrc(c.toDataURL('image/jpeg', 0.95));
      setImgLoaded(false);
    };
    img.src = currentSrc;
  };

  // Reset to default center position
  const handleReset = () => {
    measureAndInit();
  };

  // Start drag (move or corner resize)
  const handleStartDrag = (type, e) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveDrag(type);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setDragStart({
      mouseX: clientX,
      mouseY: clientY,
      boxX: cropBox.x,
      boxY: cropBox.y,
      boxW: cropBox.width,
      boxH: cropBox.height
    });
  };

  // Global mouse/touch move listener for smooth WhatsApp-style drag & resize
  useEffect(() => {
    if (!activeDrag) return;

    const handleMouseMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const dx = clientX - dragStart.mouseX;
      const dy = clientY - dragStart.mouseY;

      const imgX = renderedRect.x;
      const imgY = renderedRect.y;
      const imgW = renderedRect.width;
      const imgH = renderedRect.height;
      const minW = 140;

      if (activeDrag === 'move') {
        const minX = imgX;
        const maxX = Math.max(minX, imgX + imgW - dragStart.boxW);
        const minY = imgY;
        const maxY = Math.max(minY, imgY + imgH - dragStart.boxH);

        const newX = Math.max(minX, Math.min(maxX, dragStart.boxX + dx));
        const newY = Math.max(minY, Math.min(maxY, dragStart.boxY + dy));
        setCropBox(prev => ({ ...prev, x: newX, y: newY }));
      } else if (activeDrag === 'br') {
        const anchorX = dragStart.boxX;
        const anchorY = dragStart.boxY;
        const maxW = Math.min(imgX + imgW - anchorX, (imgY + imgH - anchorY) * CROP_RATIO);
        const clampedW = Math.max(minW, Math.min(maxW, dragStart.boxW + dx));
        const clampedH = clampedW / CROP_RATIO;
        setCropBox({ x: anchorX, y: anchorY, width: clampedW, height: clampedH });
      } else if (activeDrag === 'tl') {
        const anchorX = dragStart.boxX + dragStart.boxW;
        const anchorY = dragStart.boxY + dragStart.boxH;
        const maxW = Math.min(anchorX - imgX, (anchorY - imgY) * CROP_RATIO);
        const clampedW = Math.max(minW, Math.min(maxW, dragStart.boxW - dx));
        const clampedH = clampedW / CROP_RATIO;
        setCropBox({ x: anchorX - clampedW, y: anchorY - clampedH, width: clampedW, height: clampedH });
      } else if (activeDrag === 'tr') {
        const anchorX = dragStart.boxX;
        const anchorY = dragStart.boxY + dragStart.boxH;
        const maxW = Math.min(imgX + imgW - anchorX, (anchorY - imgY) * CROP_RATIO);
        const clampedW = Math.max(minW, Math.min(maxW, dragStart.boxW + dx));
        const clampedH = clampedW / CROP_RATIO;
        setCropBox({ x: anchorX, y: anchorY - clampedH, width: clampedW, height: clampedH });
      } else if (activeDrag === 'bl') {
        const anchorX = dragStart.boxX + dragStart.boxW;
        const anchorY = dragStart.boxY;
        const maxW = Math.min(anchorX - imgX, (imgY + imgH - anchorY) * CROP_RATIO);
        const clampedW = Math.max(minW, Math.min(maxW, dragStart.boxW - dx));
        const clampedH = clampedW / CROP_RATIO;
        setCropBox({ x: anchorX - clampedW, y: anchorY, width: clampedW, height: clampedH });
      }
    };

    const handleMouseUp = () => setActiveDrag(null);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleMouseMove);
    window.addEventListener('touchend', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [activeDrag, dragStart, renderedRect]);

  // Snap position helpers
  const snapTo = (pos) => {
    if (!renderedRect.height || !cropBox.height) return;
    const minY = renderedRect.y;
    const maxY = Math.max(minY, renderedRect.y + renderedRect.height - cropBox.height);
    const minX = renderedRect.x;
    const maxX = Math.max(minX, renderedRect.x + renderedRect.width - cropBox.width);

    if (pos === 'top') setCropBox(c => ({ ...c, y: minY }));
    else if (pos === 'center') setCropBox(c => ({ ...c, y: minY + (maxY - minY) / 2, x: minX + (maxX - minX) / 2 }));
    else if (pos === 'bottom') setCropBox(c => ({ ...c, y: maxY }));
    else if (pos === 'left') setCropBox(c => ({ ...c, x: minX }));
    else if (pos === 'right') setCropBox(c => ({ ...c, x: maxX }));
  };

  // Final apply: Crop to 1200x250 canvas
  const handleApply = () => {
    if (!imgRef.current || cropBox.width <= 0 || renderedRect.width <= 0) {
      onApply(currentSrc);
      return;
    }
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = Math.round(1200 / CROP_RATIO); // 250px
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        onApply(currentSrc);
        return;
      }

      const scaleX = imgNaturalSize.width / renderedRect.width;
      const scaleY = imgNaturalSize.height / renderedRect.height;
      const sx = Math.max(0, (cropBox.x - renderedRect.x) * scaleX);
      const sy = Math.max(0, (cropBox.y - renderedRect.y) * scaleY);
      const sw = Math.min(imgNaturalSize.width - sx, cropBox.width * scaleX);
      const sh = Math.min(imgNaturalSize.height - sy, cropBox.height * scaleY);

      ctx.drawImage(imgRef.current, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
      const finalCroppedUrl = canvas.toDataURL('image/jpeg', 0.95);
      onApply(finalCroppedUrl);
    } catch (err) {
      console.error('Final crop error:', err);
      onApply(currentSrc);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: 'calc(100vh - 80px)',
        height: 'calc(100vh - 80px)',
        background: '#FFFFFF',
        color: '#1E1B4B',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* 1. Top Header Bar */}
      <div
        style={{
          height: 64,
          padding: '0 24px',
          background: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 20
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <BackButton
            onClick={onCancel}
            title="Cancel and return to event form"
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: '#F8FAFC',
              border: '1.5px solid #CBD5E1',
              borderRadius: 10,
              padding: '8px 16px',
              color: '#334155',
              fontSize: 12.5,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#F1F5F9'; e.currentTarget.style.borderColor = '#6336EB'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.borderColor = '#CBD5E1'; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Change Photo
            <input type="file" accept="image/*" onChange={onUploadNew} style={{ display: 'none' }} />
          </label>
        </div>
      </div>

      {/* 2. Main Workspace: Shows the image alone on white canvas with WhatsApp DP Crop Frame */}
      <div
        ref={containerRef}
        style={{
          flex: 1,
          position: 'relative',
          background: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          userSelect: 'none'
        }}
      >
        <img
          ref={imgRef}
          src={currentSrc}
          alt="Cover Crop Source"
          onLoad={handleImageLoad}
          style={{
            maxWidth: 'calc(100% - 60px)',
            maxHeight: 'calc(100% - 60px)',
            objectFit: 'contain',
            display: 'block',
            pointerEvents: 'none',
            userSelect: 'none',
            filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.12))'
          }}
        />

        {/* WhatsApp DP Crop Window */}
        {imgLoaded && cropBox.width > 0 && (
          <div
            onMouseDown={(e) => handleStartDrag('move', e)}
            onTouchStart={(e) => handleStartDrag('move', e)}
            style={{
              position: 'absolute',
              left: cropBox.x,
              top: cropBox.y,
              width: cropBox.width,
              height: cropBox.height,
              boxShadow: '0 0 0 9999px rgba(15, 23, 42, 0.58)',
              border: '2px solid #FFFFFF',
              outline: '2px solid #6336EB',
              cursor: activeDrag === 'move' ? 'grabbing' : 'grab',
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10
            }}
          >
            {/* Rule-of-Thirds Grid Lines (3x3 grid) */}
            <div style={{ position: 'absolute', left: '33.33%', top: 0, bottom: 0, width: 1, background: 'rgba(255, 255, 255, 0.45)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', left: '66.66%', top: 0, bottom: 0, width: 1, background: 'rgba(255, 255, 255, 0.45)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: '33.33%', left: 0, right: 0, height: 1, background: 'rgba(255, 255, 255, 0.45)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: '66.66%', left: 0, right: 0, height: 1, background: 'rgba(255, 255, 255, 0.45)', pointerEvents: 'none' }} />

            {/* WhatsApp Corner Brackets (L-shaped handles) */}
            {/* Top-Left */}
            <div
              onMouseDown={(e) => handleStartDrag('tl', e)}
              onTouchStart={(e) => handleStartDrag('tl', e)}
              title="Drag corner to resize"
              style={{
                position: 'absolute',
                top: -5,
                left: -5,
                width: 28,
                height: 28,
                cursor: 'nwse-resize',
                zIndex: 15,
                display: 'flex'
              }}
            >
              <div style={{ width: 18, height: 18, borderTop: '4px solid #FFFFFF', borderLeft: '4px solid #FFFFFF', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))' }} />
            </div>

            {/* Top-Right */}
            <div
              onMouseDown={(e) => handleStartDrag('tr', e)}
              onTouchStart={(e) => handleStartDrag('tr', e)}
              title="Drag corner to resize"
              style={{
                position: 'absolute',
                top: -5,
                right: -5,
                width: 28,
                height: 28,
                cursor: 'nesw-resize',
                zIndex: 15,
                display: 'flex',
                justifyContent: 'flex-end'
              }}
            >
              <div style={{ width: 18, height: 18, borderTop: '4px solid #FFFFFF', borderRight: '4px solid #FFFFFF', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))' }} />
            </div>

            {/* Bottom-Left */}
            <div
              onMouseDown={(e) => handleStartDrag('bl', e)}
              onTouchStart={(e) => handleStartDrag('bl', e)}
              title="Drag corner to resize"
              style={{
                position: 'absolute',
                bottom: -5,
                left: -5,
                width: 28,
                height: 28,
                cursor: 'nesw-resize',
                zIndex: 15,
                display: 'flex',
                alignItems: 'flex-end'
              }}
            >
              <div style={{ width: 18, height: 18, borderBottom: '4px solid #FFFFFF', borderLeft: '4px solid #FFFFFF', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))' }} />
            </div>

            {/* Bottom-Right */}
            <div
              onMouseDown={(e) => handleStartDrag('br', e)}
              onTouchStart={(e) => handleStartDrag('br', e)}
              title="Drag corner to resize"
              style={{
                position: 'absolute',
                bottom: -5,
                right: -5,
                width: 28,
                height: 28,
                cursor: 'nwse-resize',
                zIndex: 15,
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'flex-end'
              }}
            >
              <div style={{ width: 18, height: 18, borderBottom: '4px solid #FFFFFF', borderRight: '4px solid #FFFFFF', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))' }} />
            </div>

            {/* Center Indicator Pill */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.88)',
                backdropFilter: 'blur(8px)',
                color: '#FFF',
                padding: '6px 16px',
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
                pointerEvents: 'none',
                userSelect: 'none'
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="8 18 12 22 16 18"/><polyline points="8 6 12 2 16 6"/><line x1="12" y1="3" x2="12" y2="22"/></svg>
              <span>{activeDrag === 'move' ? 'Moving portion...' : (activeDrag ? 'Resizing frame...' : 'Drag frame or corner brackets')}</span>
            </div>
          </div>
        )}

        {/* Floating Quick Controls Bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#FFFFFF',
            border: '1.5px solid #E2E8F0',
            borderRadius: 16,
            padding: '8px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            zIndex: 30,
            boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}
        >
          {/* Rotate 90 deg */}
          <button
            type="button"
            onClick={handleRotate}
            title="Rotate 90 degrees clockwise"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: '#F8FAFC',
              border: '1px solid #CBD5E1',
              borderRadius: 8,
              padding: '6px 12px',
              color: '#1E1B4B',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#6336EB'; e.currentTarget.style.color = '#6336EB'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#CBD5E1'; e.currentTarget.style.color = '#1E1B4B'; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
            Rotate 90°
          </button>

          <div style={{ width: 1, height: 18, background: '#CBD5E1' }} />

          {/* Quick Snaps */}
          {[
            { label: 'Top', key: 'top', show: (renderedRect.height - cropBox.height > 6) },
            { label: 'Center', key: 'center', show: true },
            { label: 'Bottom', key: 'bottom', show: (renderedRect.height - cropBox.height > 6) },
            { label: 'Left', key: 'left', show: (renderedRect.width - cropBox.width > 6) },
            { label: 'Right', key: 'right', show: (renderedRect.width - cropBox.width > 6) }
          ].filter(b => b.show).map(b => (
            <button
              key={b.key}
              type="button"
              onClick={() => snapTo(b.key)}
              style={{
                background: '#F8FAFC',
                border: '1px solid #CBD5E1',
                borderRadius: 8,
                padding: '6px 12px',
                color: '#334155',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#6336EB'; e.currentTarget.style.color = '#6336EB'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#CBD5E1'; e.currentTarget.style.color = '#334155'; }}
            >
              {b.label}
            </button>
          ))}

          <div style={{ width: 1, height: 18, background: '#CBD5E1' }} />

          {/* Reset */}
          <button
            type="button"
            onClick={handleReset}
            title="Reset crop selection to center"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#64748B',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              padding: '6px 8px'
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#1E1B4B'}
            onMouseLeave={e => e.currentTarget.style.color = '#64748B'}
          >
            Reset
          </button>

          {/* Live Preview Toggle */}
          <button
            type="button"
            onClick={() => setShowLivePreview(!showLivePreview)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: showLivePreview ? '#6336EB' : '#F8FAFC',
              border: showLivePreview ? '1px solid #6336EB' : '1px solid #CBD5E1',
              borderRadius: 8,
              padding: '6px 12px',
              color: showLivePreview ? '#FFF' : '#334155',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="2"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
            {showLivePreview ? 'Hide Preview' : 'Live Header Preview'}
          </button>
        </div>

        {/* Floating Live Header Preview Flyout */}
        {showLivePreview && previewUrl && (
          <div
            style={{
              position: 'absolute',
              top: 20,
              right: 24,
              width: 320,
              background: '#FFFFFF',
              border: '1.5px solid #E2E8F0',
              borderRadius: 16,
              padding: 14,
              boxShadow: '0 12px 36px rgba(0,0,0,0.12)',
              zIndex: 40,
              animation: 'fadeIn 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#6336EB', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Event Header Preview
              </span>
              <button
                type="button"
                onClick={() => setShowLivePreview(false)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: 14 }}
              >
                ✕
              </button>
            </div>
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: 80,
                borderRadius: 10,
                overflow: 'hidden',
                background: '#0F172A',
                border: '1px solid #E2E8F0'
              }}
            >
              <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.85) 0%, transparent 60%)' }} />
              <div style={{ position: 'absolute', bottom: 8, left: 12, fontSize: 13, fontWeight: 800, color: '#FFF' }}>
                {initialEventName || 'Your Event Name'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Bottom Action Bar (Content in Center Removed) */}
      <div
        style={{
          height: 60,
          padding: '0 24px',
          background: '#FFFFFF',
          borderTop: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 20
        }}
      >
        <button
          type="button"
          onClick={onCancel}
          style={{
            background: 'none',
            border: 'none',
            color: '#64748B',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer'
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#1E1B4B'}
          onMouseLeave={e => e.currentTarget.style.color = '#64748B'}
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleApply}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'linear-gradient(135deg, #6336EB, #4D25C9)',
            border: 'none',
            borderRadius: 10,
            padding: '9px 24px',
            color: '#FFF',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(99, 54, 235, 0.35)'
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          Done &amp; Set as Cover
        </button>
      </div>
    </div>
  );
}
