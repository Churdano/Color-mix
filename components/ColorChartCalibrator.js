import React, { useRef, useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

const PDF_WORKER_URL = 'https://esm.sh/pdfjs-dist@4.0.379/build/pdf.worker.mjs';

const ColorChartCalibrator = ({ paints, onUpdatePaintColor, onClose, brandName }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const magnifierCanvasRef = useRef(null);
  const [image, setImage] = useState(null);
  const [selectedPaintId, setSelectedPaintId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [pickedColor, setPickedColor] = useState(null);
  const [isProcessingPdf, setIsProcessingPdf] = useState(false);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pendingChange, setPendingChange] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [baseScale, setBaseScale] = useState(1);
  const [isPanMode, setIsPanMode] = useState(false);
  const isRightClickPanning = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const lastTouchDist = useRef(null);
  const lastTouchCenter = useRef(null);
  const MAGNIFIER_SIZE = 120;
  const MAGNIFIER_ZOOM = 2;
  const MAGNIFIER_OFFSET_Y = 100;

  useEffect(() => {
    if (pdfjsLib.GlobalWorkerOptions) pdfjsLib.GlobalWorkerOptions.workerSrc = PDF_WORKER_URL;
  }, []);

  useEffect(() => {
    const sc = scrollContainerRef.current;
    if (!sc) return;
    const handleWheelNative = (e) => {
        e.preventDefault();
        const delta = e.deltaY * -0.001;
        setZoom(prev => Math.min(Math.max(prev + delta, 1), 10));
    };
    sc.addEventListener('wheel', handleWheelNative, { passive: false });
    return () => sc.removeEventListener('wheel', handleWheelNative);
  }, []);

  const handlePointerDown = (e) => {
    if (e.button === 2 || isPanMode) {
        e.preventDefault();
        e.currentTarget.setPointerCapture(e.pointerId);
        isRightClickPanning.current = true;
        lastMousePos.current = { x: e.clientX, y: e.clientY };
        return;
    }
    if (e.button === 0 && !isPanMode) {
        e.currentTarget.setPointerCapture(e.pointerId);
        setIsDragging(true);
        pickColor(e.clientX, e.clientY);
    }
  };

  const handlePointerMove = (e) => {
    if (isRightClickPanning.current) {
        const dx = e.clientX - lastMousePos.current.x;
        const dy = e.clientY - lastMousePos.current.y;
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft -= dx;
            scrollContainerRef.current.scrollTop -= dy;
        }
        lastMousePos.current = { x: e.clientX, y: e.clientY };
        return;
    }
    if (isDragging) pickColor(e.clientX, e.clientY);
  };

  const handlePointerUp = (e) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    if (isRightClickPanning.current) {
        isRightClickPanning.current = false;
        return;
    }
    if (isDragging) {
        setIsDragging(false);
        const hex = pickColor(e.clientX, e.clientY);
        if (selectedPaintId && hex) setPendingChange({ id: selectedPaintId, newHex: hex });
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.type === 'application/pdf') handlePdfUpload(file);
    else {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => { setImage(img); resetView(img); };
            img.src = e.target?.result;
        };
        reader.readAsDataURL(file);
    }
  };

  const handlePdfUpload = async (file) => {
    setIsProcessingPdf(true);
    try {
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        setPdfDoc(pdf); setNumPages(pdf.numPages); setCurrentPage(1);
        await renderPdfPage(pdf, 1);
    } catch (error) {
        alert("Error al leer el PDF.");
        setIsProcessingPdf(false);
    }
  };

  const renderPdfPage = async (pdf, pageNumber) => {
      setIsProcessingPdf(true);
      try {
        const page = await pdf.getPage(pageNumber);
        const viewport = page.getViewport({ scale: 3.0 });
        const tempCanvas = document.createElement('canvas');
        const context = tempCanvas.getContext('2d');
        tempCanvas.height = viewport.height; tempCanvas.width = viewport.width;
        await page.render({ canvasContext: context, viewport: viewport }).promise;
        const img = new Image();
        img.onload = () => { setImage(img); resetView(img); setIsProcessingPdf(false); };
        img.src = tempCanvas.toDataURL('image/png');
      } catch (error) { console.error(error); }
  };

  const resetView = (img) => {
    setZoom(1); setIsPanMode(false);
    if (containerRef.current) {
        const scaleX = (containerRef.current.clientWidth - 32) / img.width;
        const scaleY = 600 / img.height;
        setBaseScale(Math.min(scaleX, scaleY));
    }
  };

  useEffect(() => {
    if (image && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width = image.width; canvas.height = image.height;
      ctx.drawImage(image, 0, 0);
    }
  }, [image]);

  const pickColor = (clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    let x = (clientX - rect.left) * scaleX;
    let y = (clientY - rect.top) * scaleY;
    x = Math.max(0, Math.min(x, canvas.width - 1));
    y = Math.max(0, Math.min(y, canvas.height - 1));
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const hex = "#" + ((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1).toUpperCase();
    setCursorPos({ x: clientX - rect.left, y: clientY - rect.top });
    setPickedColor(hex);
    if (magnifierCanvasRef.current && image) {
      const magCtx = magnifierCanvasRef.current.getContext('2d');
      const sWidth = MAGNIFIER_SIZE / MAGNIFIER_ZOOM;
      const sHeight = MAGNIFIER_SIZE / MAGNIFIER_ZOOM;
      magCtx.fillStyle = '#000'; magCtx.fillRect(0,0, MAGNIFIER_SIZE, MAGNIFIER_SIZE);
      magCtx.drawImage(canvas, x - (sWidth/2), y - (sHeight/2), sWidth, sHeight, 0, 0, MAGNIFIER_SIZE, MAGNIFIER_SIZE);
    }
    return hex;
  };

  return React.createElement('div', { className: "bg-gray-800 p-4 rounded-lg border border-gray-600 animate-fade-in relative", ref: containerRef },
    React.createElement('div', { className: "flex justify-between items-center mb-4" },
      React.createElement('h3', { className: "text-lg font-bold text-white" }, `Calibrar Carta: ${brandName}`),
      React.createElement('button', { onClick: onClose, className: "text-gray-400 hover:text-white" }, "✕")
    ),
    React.createElement('div', { className: "space-y-4" },
      !image && !isProcessingPdf && React.createElement('div', { className: "border-2 border-dashed border-gray-600 rounded-lg p-8 text-center bg-gray-900/50" },
          React.createElement('label', { className: "cursor-pointer flex flex-col items-center" },
              React.createElement('span', { className: "text-sm text-gray-300" }, "Sube Carta de Colores (Imagen o PDF)"),
              React.createElement('input', { type: "file", accept: "image/*,application/pdf", onChange: handleImageUpload, className: "hidden" })
          )
      ),
      image && React.createElement(React.Fragment, null,
          React.createElement('div', { className: "flex justify-between bg-gray-900 p-2 rounded-lg" },
            React.createElement('div', { className: "flex gap-2" },
              React.createElement('button', { onClick: () => setZoom(prev => Math.max(prev - 0.5, 1)), className: "bg-gray-700 px-2 rounded" }, "-"),
              React.createElement('span', { className: "text-xs text-white" }, `${Math.round(zoom * 100)}%`),
              React.createElement('button', { onClick: () => setZoom(prev => Math.min(prev + 0.5, 10)), className: "bg-gray-700 px-2 rounded" }, "+")
            ),
            React.createElement('button', { onClick: () => setIsPanMode(!isPanMode), className: `px-3 rounded text-xs ${isPanMode ? 'bg-indigo-600' : 'bg-gray-700'}` }, isPanMode ? 'Mover' : 'Seleccionar')
          ),
          React.createElement('div', { ref: scrollContainerRef, className: "relative overflow-auto max-h-[60vh] rounded-lg border border-gray-600 bg-gray-900" },
            React.createElement('canvas', { 
                ref: canvasRef, 
                style: { width: image.width * baseScale * zoom, height: image.height * baseScale * zoom },
                className: `block ${isPanMode ? 'cursor-grab' : 'cursor-crosshair'} touch-none`,
                onPointerDown: handlePointerDown, onPointerMove: handlePointerMove, onPointerUp: handlePointerUp,
                onContextMenu: (e) => e.preventDefault()
            })
          )
      ),
      React.createElement('div', { className: "bg-gray-900 rounded-lg p-2 max-h-60 overflow-y-auto" },
        paints.map(paint => React.createElement('button', { 
            key: paint.id, onClick: () => setSelectedPaintId(paint.id),
            className: `flex items-center w-full p-2 rounded text-left ${selectedPaintId === paint.id ? 'bg-indigo-900' : ''}` 
        }, 
          React.createElement('div', { className: "w-6 h-6 rounded-full mr-3", style: { backgroundColor: paint.hex } }),
          React.createElement('div', null, React.createElement('div', { className: "text-sm text-gray-200" }, paint.name), React.createElement('div', { className: "text-[10px] text-gray-500" }, paint.hex))
        ))
      )
    ),
    pendingChange && React.createElement('div', { className: "absolute inset-0 z-50 flex items-center justify-center bg-gray-900/80 rounded-lg" },
      React.createElement('div', { className: "bg-gray-800 p-6 rounded-xl border border-gray-600" },
        React.createElement('h4', { className: "text-white mb-4" }, "¿Confirmar nuevo color?"),
        React.createElement('div', { className: "flex gap-3" },
          React.createElement('button', { onClick: () => setPendingChange(null), className: "bg-gray-700 px-4 py-2 rounded" }, "No"),
          React.createElement('button', { onClick: () => { onUpdatePaintColor(pendingChange.id, pendingChange.newHex); setPendingChange(null); }, className: "bg-indigo-600 px-4 py-2 rounded" }, "Sí")
        )
      )
    )
  );
};

export default ColorChartCalibrator;