import React, { useState, useRef, useCallback, useImperativeHandle, forwardRef, useEffect } from 'react';
import './style.scss';

/**
 * Canvas 图片标注组件
 * 功能：图片加载、缩放、拖拽、矩形标注
 *
 * 缩放方式：使用 Canvas ctx.scale() 重绘，比 CSS transform 图像质量更好
 */
const Canvas = forwardRef(({ src, markable = false, onMarkChange }, ref) => {
  // 所有可变状态集中在 stateRef 中，避免多次 setState 调用
  const stateRef = useRef({
    scale: 1,
    position: { x: 0, y: 0 },
    marks: [],
    isDragging: false,
    isMarking: false,
    dragStart: null,
    markStart: null,
    image: null,
    canvas: null,
    ctx: null,
  });

  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // React state 仅用于触发 UI 更新
  const [uiState, setUiState] = useState({ scale: 1, isDragging: false, isMarking: false });

  // canvas 初始化
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      stateRef.current.canvas = canvas;
      stateRef.current.ctx = canvas?.getContext('2d');
    }
  }, []);

  // 坐标转换：窗口坐标 -> Canvas 原始坐标（考虑缩放）
  const windowToCanvas = (clientX, clientY) => {
    const { canvas } = stateRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  // 重绘 canvas 内容（图片 + 标注）
  const redrawCanvas = () => {
    const { canvas, ctx, image, scale, marks } = stateRef.current;
    if (!ctx || !image) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    marks.forEach((mark) => {
      ctx.save();
      ctx.strokeStyle = '#E26866';
      ctx.lineWidth = 2 * scale;
      ctx.beginPath();
      ctx.rect(mark.x * scale, mark.y * scale, mark.width * scale, mark.height * scale);
      ctx.stroke();
      ctx.restore();
    });
  };

  // 更新 canvas 尺寸并应用位置
  const updateCanvas = () => {
    const { canvas, image, scale, position } = stateRef.current;
    if (!canvas || !image) return;

    canvas.width = image.width * scale;
    canvas.height = image.height * scale;
    canvas.style.left = `${position.x}px`;
    canvas.style.top = `${position.y}px`;
    redrawCanvas();
  };

  // 加载图片
  useEffect(() => {
    if (!src) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      stateRef.current.image = img;
      updateCanvas();
    };
    img.src = src;
  }, [src]);

  // 绑定滚轮事件
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      e.preventDefault();
      const state = stateRef.current;
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      state.scale = Math.max(0.1, Math.min(5, Math.round((state.scale + delta) * 10) / 10));
      updateCanvas();
      setUiState(prev => ({ ...prev, scale: state.scale }));
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  // 鼠标按下
  const handleMouseDown = useCallback((e) => {
    const state = stateRef.current;
    if (markable) {
      state.isMarking = true;
      const coords = windowToCanvas(e.clientX, e.clientY);
      state.markStart = { x: coords.x / state.scale, y: coords.y / state.scale };
      setUiState(prev => ({ ...prev, isMarking: true }));
    } else {
      state.isDragging = true;
      state.dragStart = { x: e.clientX - state.position.x, y: e.clientY - state.position.y };
      setUiState(prev => ({ ...prev, isDragging: true }));
    }
  }, [markable]);

  // 鼠标移动
  const handleMouseMove = useCallback((e) => {
    const state = stateRef.current;

    if (state.isDragging && state.dragStart) {
      state.position = {
        x: e.clientX - state.dragStart.x,
        y: e.clientY - state.dragStart.y,
      };
      updateCanvas();
      setUiState(prev => ({ ...prev, position: state.position }));
    } else if (state.isMarking && state.markStart) {
      const coords = windowToCanvas(e.clientX, e.clientY);
      const endCoords = { x: coords.x / state.scale, y: coords.y / state.scale };

      redrawCanvas();

      const { ctx, scale } = state;
      if (ctx) {
        ctx.save();
        ctx.strokeStyle = '#E26866';
        ctx.lineWidth = 2 * scale;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.rect(
          state.markStart.x * scale,
          state.markStart.y * scale,
          (endCoords.x - state.markStart.x) * scale,
          (endCoords.y - state.markStart.y) * scale
        );
        ctx.stroke();
        ctx.restore();
      }
    }
  }, []);

  // 鼠标释放
  const handleMouseUp = useCallback((e) => {
    const state = stateRef.current;

    if (state.isDragging) {
      state.isDragging = false;
      state.dragStart = null;
      setUiState(prev => ({ ...prev, isDragging: false }));
    } else if (state.isMarking && state.markStart) {
      const coords = windowToCanvas(e.clientX, e.clientY);
      const endCoords = { x: coords.x / state.scale, y: coords.y / state.scale };
      const width = Math.abs(endCoords.x - state.markStart.x);
      const height = Math.abs(endCoords.y - state.markStart.y);

      if (width >= 10 && height >= 10) {
        const mark = {
          id: Date.now(),
          x: Math.min(state.markStart.x, endCoords.x),
          y: Math.min(state.markStart.y, endCoords.y),
          width,
          height,
        };

        state.marks = [...state.marks, mark];
        onMarkChange?.(state.marks);
      }

      state.isMarking = false;
      state.markStart = null;
      setUiState(prev => ({ ...prev, isMarking: false }));
      redrawCanvas();
    }
  }, [onMarkChange]);

  // 清除所有标注
  const clearMarks = useCallback(() => {
    stateRef.current.marks = [];
    onMarkChange?.([]);
    redrawCanvas();
    setUiState(prev => ({ ...prev, marks: [] }));
  }, [onMarkChange]);

  // 重置
  const handleReset = useCallback(() => {
    const state = stateRef.current;
    state.scale = 1;
    state.position = { x: 0, y: 0 };
    state.marks = [];
    onMarkChange?.([]);
    updateCanvas();
    setUiState({ scale: 1, isDragging: false, isMarking: false, marks: [] });
  }, [onMarkChange]);

  // 暴露方法给父组件
  useImperativeHandle(ref, () => ({
    clearMarks,
    reset: handleReset,
    getMarks: () => stateRef.current.marks,
    getScale: () => stateRef.current.scale,
  }));

  return (
    <div ref={containerRef} className="canvas-container">
      <canvas
        ref={canvasRef}
        className="canvas-element"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: markable ? 'crosshair' : uiState.isDragging ? 'grabbing' : 'grab' }}
      />
      <div className="canvas-toolbar">
        <span className="scale-info">{Math.round(uiState.scale * 100)}%</span>
        <button className="canvas-btn" onClick={() => {
          const state = stateRef.current;
          state.scale = Math.min(5, state.scale + 0.1);
          updateCanvas();
          setUiState(prev => ({ ...prev, scale: state.scale }));
        }}>
          +
        </button>
        <button className="canvas-btn" onClick={() => {
          const state = stateRef.current;
          state.scale = Math.max(0.1, state.scale - 0.1);
          updateCanvas();
          setUiState(prev => ({ ...prev, scale: state.scale }));
        }}>
          -
        </button>
        <button className="canvas-btn" onClick={handleReset}>
          重置
        </button>
      </div>
    </div>
  );
});

export default Canvas;
