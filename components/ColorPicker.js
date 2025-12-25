import React, { useRef, useState, useEffect } from 'react';

const ColorPicker = ({ onColorSelect }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const magnifierCanvasRef = useRef(null);
  const [image, setImage] = useState(null);
  const [currentSelection, setCurrentSelection] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

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
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (image && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const maxWidth = containerRef.current?.clientWidth || 300;
      const scale = Math.min(maxWidth / image.width, 500 / image.height);
      canvas.width = image.width * scale;
      canvas.height = image.height * scale;
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    }
  }, [image]);

  const updateSelection = (clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    let visualX = Math.max(0, Math.min(clientX - rect.left, rect.width));
    let visualY = Math.max(0, Math.min(clientY - rect.top, rect.height));
    const internalX = Math.floor(visualX * scaleX);
    const internalY = Math.floor(visualY * scaleY);
    const pixel = ctx.getImageData(internalX, internalY, 1, 1).data;
    const hex = "#" + ((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1).toUpperCase();
    const color = { r: pixel[0], g: pixel[1], b: pixel[2], hex, x: visualX, y: visualY };
    setCurrentSelection(color);
  };

  return React.createElement('div', { className: "w-full flex flex-col items-center space-y-6", ref: containerRef },
    !image ? React.createElement('div', { className: "glass-panel w-full p-10 border-2 border-dashed border-stone-600/50 rounded-2xl text-center" },
      React.createElement('label', { htmlFor: "image-upload", className: "cursor-pointer flex flex-col items-center" },
        React.createElement('span', { className: "text-xl font-bold text-stone-200 mb-2" }, "Cargar Referencia"),
        React.createElement('input', { id: "image-upload", type: "file", accept: "image/*", onChange: handleImageUpload, className: "hidden" })
      )
    ) : React.createElement('div', { className: "relative touch-none select-none rounded-xl border-4 border-stone-800", onPointerDown: (e) => { setIsDragging(true); updateSelection(e.clientX, e.clientY); }, onPointerMove: (e) => { if (isDragging) updateSelection(e.clientX, e.clientY); }, onPointerUp: () => { setIsDragging(false); if (currentSelection) onColorSelect(currentSelection); } },
      React.createElement('canvas', { ref: canvasRef, className: "block" }),
      currentSelection && React.createElement('div', { className: "absolute w-6 h-6 border-2 border-white rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none", style: { left: currentSelection.x, top: currentSelection.y } })
    ),
    currentSelection && React.createElement('div', { className: "glass-panel p-4 rounded-xl w-full flex items-center space-x-4" },
      React.createElement('div', { className: "w-16 h-16 rounded-lg border-2 border-stone-800", style: { backgroundColor: currentSelection.hex } }),
      React.createElement('span', { className: "text-2xl font-black text-white font-mono" }, currentSelection.hex)
    )
  );
};

export default ColorPicker;