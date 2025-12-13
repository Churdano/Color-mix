import React, { useRef, useState, useEffect } from 'react';
import { PixelColor } from '../types';

interface ColorPickerProps {
  onColorSelect: (color: PixelColor) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ onColorSelect }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const magnifierCanvasRef = useRef<HTMLCanvasElement>(null);
  
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [currentSelection, setCurrentSelection] = useState<PixelColor | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Constants for magnifier
  const MAGNIFIER_SIZE = 100; // px diameter
  const MAGNIFIER_ZOOM = 3;
  const MAGNIFIER_OFFSET_Y = 80; // Distance above finger

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          setImage(img);
          setCurrentSelection(null);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (image && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Resize canvas to fit container but maintain aspect ratio
        const maxWidth = containerRef.current?.clientWidth || 300;
        // Limit height to viewable area roughly
        const scale = Math.min(maxWidth / image.width, 500 / image.height);
        
        canvas.width = image.width * scale;
        canvas.height = image.height * scale;
        
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      }
    }
  }, [image]);

  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
  };

  const updateSelection = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x = clientX - rect.left;
    let y = clientY - rect.top;

    // Clamp coordinates
    x = Math.max(0, Math.min(x, canvas.width - 1));
    y = Math.max(0, Math.min(y, canvas.height - 1));

    // Get pixel color
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const color: PixelColor = {
      r: pixel[0],
      g: pixel[1],
      b: pixel[2],
      hex: rgbToHex(pixel[0], pixel[1], pixel[2]),
      x,
      y
    };

    setCurrentSelection(color);
    
    // Draw Magnifier
    if (magnifierCanvasRef.current && image) {
      const magCtx = magnifierCanvasRef.current.getContext('2d');
      if (magCtx) {
          // Clear
          magCtx.clearRect(0, 0, MAGNIFIER_SIZE, MAGNIFIER_SIZE);
          
          // Calculate source position relative to original image
          // The canvas is scaled, so we need to map canvas coords back to image coords if we drew from image,
          // OR easier: draw from the canvas itself which is already visible
          
          // Source: canvas
          const sx = x - (MAGNIFIER_SIZE / 2 / MAGNIFIER_ZOOM);
          const sy = y - (MAGNIFIER_SIZE / 2 / MAGNIFIER_ZOOM);
          const sWidth = MAGNIFIER_SIZE / MAGNIFIER_ZOOM;
          const sHeight = MAGNIFIER_SIZE / MAGNIFIER_ZOOM;

          magCtx.imageSmoothingEnabled = false; // Keep pixels sharp
          magCtx.drawImage(canvas, sx, sy, sWidth, sHeight, 0, 0, MAGNIFIER_SIZE, MAGNIFIER_SIZE);
          
          // Draw crosshair on magnifier
          magCtx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
          magCtx.lineWidth = 1;
          magCtx.beginPath();
          magCtx.moveTo(MAGNIFIER_SIZE/2, 0);
          magCtx.lineTo(MAGNIFIER_SIZE/2, MAGNIFIER_SIZE);
          magCtx.moveTo(0, MAGNIFIER_SIZE/2);
          magCtx.lineTo(MAGNIFIER_SIZE, MAGNIFIER_SIZE/2);
          magCtx.stroke();
      }
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    updateSelection(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      updateSelection(e.clientX, e.clientY);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    if (currentSelection) {
      onColorSelect(currentSelection);
    }
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <div className="w-full flex flex-col items-center space-y-4" ref={containerRef}>
      {!image && (
        <div className="w-full p-8 border-2 border-dashed border-gray-600 rounded-lg text-center hover:border-blue-500 transition-colors bg-gray-800">
          <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            <span className="text-gray-300 font-medium">Toca para subir una foto</span>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>
      )}

      {image && (
        <>
          <div className="text-center mb-2">
            <label htmlFor="image-reupload" className="text-sm text-indigo-400 cursor-pointer hover:underline">Cambiar imagen</label>
            <input id="image-reupload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </div>

          <div 
            className="relative touch-none select-none overflow-hidden rounded-lg shadow-2xl border border-gray-700 bg-black cursor-crosshair"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            <canvas
              ref={canvasRef}
              className="block max-w-full"
            />
            
            {/* Persisting Selection Marker (The "Sight") */}
            {currentSelection && !isDragging && (
                <div 
                    className="absolute w-6 h-6 border-2 border-white rounded-full shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-1/2 z-10"
                    style={{ left: currentSelection.x, top: currentSelection.y }}
                >
                    <div className="w-full h-full border border-black rounded-full opacity-50"></div>
                    <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                </div>
            )}

            {/* Offset Magnifier (Only while dragging) */}
            {isDragging && currentSelection && (
                <div 
                    className="absolute rounded-full border-4 border-white shadow-2xl overflow-hidden pointer-events-none z-20 bg-gray-900"
                    style={{ 
                        width: MAGNIFIER_SIZE, 
                        height: MAGNIFIER_SIZE,
                        left: currentSelection.x - MAGNIFIER_SIZE / 2, 
                        top: currentSelection.y - MAGNIFIER_OFFSET_Y - MAGNIFIER_SIZE / 2
                    }}
                >
                    <canvas 
                        ref={magnifierCanvasRef} 
                        width={MAGNIFIER_SIZE} 
                        height={MAGNIFIER_SIZE}
                        className="block"
                    />
                    {/* Color code badge inside magnifier */}
                    <div className="absolute bottom-2 left-0 right-0 text-center">
                        <span className="bg-black/70 text-white text-[10px] px-1 rounded font-mono">
                            {currentSelection.hex}
                        </span>
                    </div>
                </div>
            )}
          </div>
        </>
      )}

      {currentSelection && (
        <div className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg w-full shadow-lg border border-gray-700 animate-fade-in-up">
          <div
            className="w-16 h-16 rounded-full border-4 border-gray-700 shadow-inner flex-shrink-0"
            style={{ backgroundColor: currentSelection.hex }}
          ></div>
          <div className="flex-grow">
            <p className="text-gray-400 text-xs uppercase tracking-wider font-bold">Color Seleccionado</p>
            <p className="text-2xl font-bold font-mono text-white tracking-wide">{currentSelection.hex}</p>
            <p className="text-xs text-gray-500 mt-1">RGB: {currentSelection.r}, {currentSelection.g}, {currentSelection.b}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
