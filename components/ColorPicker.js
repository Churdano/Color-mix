import React, { useRef, useState, useEffect } from 'react';

const ColorPicker = ({ onColorSelect }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const magnifierCanvasRef = useRef(null);
  
  const [image, setImage] = useState(null);
  const [currentSelection, setCurrentSelection] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const MAGNIFIER_SIZE = 120;
  const MAGNIFIER_ZOOM = 3;
  const MAGNIFIER_OFFSET_Y = 90;

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          setImage(img);
          setCurrentSelection(null);
        };
        img.src = e.target?.result;
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (image && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const maxWidth = containerRef.current?.clientWidth || 300;
        const scale = Math.min(maxWidth / image.width, 500 / image.height);
        canvas.width = image.width * scale;
        canvas.height = image.height * scale;
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      }
    }
  }, [image]);

  const rgbToHex = (r, g, b) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
  };

  const updateSelection = (clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    let visualX = clientX - rect.left;
    let visualY = clientY - rect.top;
    visualX = Math.max(0, Math.min(visualX, rect.width));
    visualY = Math.max(0, Math.min(visualY, rect.height));
    const internalX = Math.floor(visualX * scaleX);
    const internalY = Math.floor(visualY * scaleY);
    const safeInternalX = Math.max(0, Math.min(internalX, canvas.width - 1));
    const safeInternalY = Math.max(0, Math.min(internalY, canvas.height - 1));
    const pixel = ctx.getImageData(safeInternalX, safeInternalY, 1, 1).data;
    const color = {
      r: pixel[0],
      g: pixel[1],
      b: pixel[2],
      hex: rgbToHex(pixel[0], pixel[1], pixel[2]),
      x: visualX,
      y: visualY
    };
    setCurrentSelection(color);
    if (magnifierCanvasRef.current && image) {
      const magCtx = magnifierCanvasRef.current.getContext('2d');
      if (magCtx) {
          magCtx.clearRect(0, 0, MAGNIFIER_SIZE, MAGNIFIER_SIZE);
          const sWidth = MAGNIFIER_SIZE / MAGNIFIER_ZOOM;
          const sHeight = MAGNIFIER_SIZE / MAGNIFIER_ZOOM;
          const sx = safeInternalX - (sWidth / 2);
          const sy = safeInternalY - (sHeight / 2);
          magCtx.imageSmoothingEnabled = false;
          magCtx.fillStyle = '#0c0a09';
          magCtx.fillRect(0,0, MAGNIFIER_SIZE, MAGNIFIER_SIZE);
          magCtx.drawImage(canvas, sx, sy, sWidth, sHeight, 0, 0, MAGNIFIER_SIZE, MAGNIFIER_SIZE);
          magCtx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
          magCtx.lineWidth = 1;
          magCtx.beginPath();
          magCtx.moveTo(MAGNIFIER_SIZE/2, 0);
          magCtx.lineTo(MAGNIFIER_SIZE/2, MAGNIFIER_SIZE);
          magCtx.moveTo(0, MAGNIFIER_SIZE/2);
          magCtx.lineTo(MAGNIFIER_SIZE, MAGNIFIER_SIZE/2);
          magCtx.stroke();
          magCtx.strokeStyle = '#f97316';
          magCtx.lineWidth = 4;
          magCtx.strokeRect(0,0, MAGNIFIER_SIZE, MAGNIFIER_SIZE);
      }
    }
  };

  const handlePointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    updateSelection(e.clientX, e.clientY);
  };

  const handlePointerMove = (e) => {
    if (isDragging) updateSelection(e.clientX, e.clientY);
  };

  const handlePointerUp = (e) => {
    setIsDragging(false);
    if (currentSelection) onColorSelect(currentSelection);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return React.createElement('div', { className: "w-full flex flex-col items-center space-y-6", ref: containerRef },
    !image && React.createElement('div', { className: "glass-panel w-full p-10 border-2 border-dashed border-stone-600/50 rounded-2xl text-center hover:border-orange-500/50 hover:bg-white/5 transition-all group cursor-pointer" },
      React.createElement('label', { htmlFor: "image-upload", className: "cursor-pointer flex flex-col items-center" },
        React.createElement('div', { className: "bg-orange-500/10 p-5 rounded-full mb-5 group-hover:scale-110 transition-transform duration-300 border border-orange-500/20" },
          React.createElement('svg', { className: "h-10 w-10 text-orange-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
            React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" })
          )
        ),
        React.createElement('span', { className: "text-xl font-bold text-stone-200 mb-2" }, "Cargar Referencia"),
        React.createElement('span', { className: "text-sm text-stone-500" }, "Toca para subir una foto de tu miniatura o arte conceptual"),
        React.createElement('input', { id: "image-upload", type: "file", accept: "image/*", onChange: handleImageUpload, className: "hidden" })
      )
    ),
    image && React.createElement(React.Fragment, null,
      React.createElement('div', { className: "w-full flex justify-end" },
        React.createElement('label', { htmlFor: "image-reupload", className: "text-xs font-medium text-orange-300 cursor-pointer hover:text-white flex items-center bg-white/5 px-4 py-2 rounded-lg border border-white/10 hover:bg-white/10 transition-all shadow-sm" },
          React.createElement('svg', { className: "h-3 w-3 mr-2", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
            React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" })
          ),
          "Cambiar imagen"
        ),
        React.createElement('input', { id: "image-reupload", type: "file", accept: "image/*", onChange: handleImageUpload, className: "hidden" })
      ),
      React.createElement('div', { className: "w-full flex justify-center animate-fade-in-up" },
        React.createElement('div', { 
          className: "relative touch-none select-none rounded-xl shadow-2xl border-4 border-stone-800 bg-stone-900 cursor-crosshair overflow-hidden ring-1 ring-white/10",
          style: { width: 'fit-content', maxWidth: '100%' },
          onPointerDown: handlePointerDown,
          onPointerMove: handlePointerMove,
          onPointerUp: handlePointerUp
        },
          React.createElement('canvas', { ref: canvasRef, className: "block" }),
          currentSelection && !isDragging && React.createElement('div', { 
            className: "absolute w-8 h-8 border-2 border-white rounded-full shadow-[0_0_15px_rgba(0,0,0,0.8)] pointer-events-none transform -translate-x-1/2 -translate-y-1/2 z-10 animate-pulse-glow",
            style: { left: currentSelection.x, top: currentSelection.y }
          },
            React.createElement('div', { className: "w-full h-full border border-black rounded-full opacity-60" }),
            React.createElement('div', { className: "absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-orange-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 box-border border border-white shadow-[0_0_5px_orange]" })
          ),
          isDragging && currentSelection && React.createElement('div', { 
            className: "absolute rounded-full border-4 border-stone-200 shadow-[0_10px_30px_rgba(0,0,0,0.8)] overflow-hidden pointer-events-none z-20 bg-stone-900",
            style: { 
                width: MAGNIFIER_SIZE, 
                height: MAGNIFIER_SIZE,
                left: currentSelection.x - MAGNIFIER_SIZE / 2, 
                top: currentSelection.y - MAGNIFIER_OFFSET_Y - MAGNIFIER_SIZE / 2
            }
          },
            React.createElement('canvas', { ref: magnifierCanvasRef, width: MAGNIFIER_SIZE, height: MAGNIFIER_SIZE, className: "block" }),
            React.createElement('div', { className: "absolute bottom-3 left-0 right-0 text-center" },
              React.createElement('span', { className: "bg-stone-900/90 text-orange-200 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold tracking-wider border border-orange-500/30" }, currentSelection.hex)
            )
          )
        )
      )
    ),
    currentSelection && React.createElement('div', { className: "flex items-center space-x-6 p-6 glass-panel rounded-2xl w-full shadow-2xl border border-white/5 animate-fade-in-up" },
      React.createElement('div', { className: "relative group" },
        React.createElement('div', { className: "absolute -inset-0.5 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500" }),
        React.createElement('div', { className: "relative w-24 h-24 rounded-2xl border-4 border-stone-800 shadow-inner flex-shrink-0", style: { backgroundColor: currentSelection.hex } }),
        React.createElement('div', { className: "absolute -bottom-3 -right-3 bg-stone-900 rounded-full p-1.5 border border-stone-700 shadow-lg" },
          React.createElement('svg', { className: "h-5 w-5 text-green-500", viewBox: "0 0 20 20", fill: "currentColor" },
            React.createElement('path', { fillRule: "evenodd", d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z", clipRule: "evenodd" })
          )
        )
      ),
      React.createElement('div', { className: "flex-grow" },
        React.createElement('p', { className: "text-orange-400 text-xs uppercase tracking-widest font-bold mb-1" }, "Color Objetivo Seleccionado"),
        React.createElement('p', { className: "text-4xl font-black font-mono text-white tracking-wide drop-shadow-md" }, currentSelection.hex),
        React.createElement('div', { className: "flex items-center space-x-3 mt-3" },
          [
            { label: 'RED', val: currentSelection.r, border: 'border-red-500' },
            { label: 'GREEN', val: currentSelection.g, border: 'border-green-500' },
            { label: 'BLUE', val: currentSelection.b, border: 'border-blue-500' }
          ].map(c => React.createElement('div', { key: c.label, className: "flex flex-col items-center" },
            React.createElement('span', { className: "text-[10px] text-stone-500 mb-1" }, c.label),
            React.createElement('span', { className: `px-2 py-1 rounded bg-stone-800 text-stone-300 text-xs font-mono min-w-[3rem] text-center border-b-2 ${c.border}` }, c.val)
          ))
        )
      )
    )
  );
};

export default ColorPicker;