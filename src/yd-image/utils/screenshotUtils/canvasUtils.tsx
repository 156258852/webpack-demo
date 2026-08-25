// 屏幕缩放比例
const scale = window.devicePixelRatio || 1;

// 截图产物像素尺寸上限：避免整页截图在 retina 上变成几千像素的巨图，
// 导致画笔每次 stroke / 撤销每次 getImageData 都卡顿
const MAX_CANVAS_DIMENSION = 4096;

const cutSelectionAreaFromCanvas = (sourceCanvas: HTMLCanvasElement, selection: DOMRect) => {
  // 坐标换算以「真实 drawScale」为准（可能已被上限压缩），而不是盲目用 devicePixelRatio
  const drawScale = (window.YD_SCREENSHOT_CONFIG && window.YD_SCREENSHOT_CONFIG.scale) || scale;
  const cutCanvas = document.createElement('canvas');

  const selectionWidth = selection.width * drawScale;
  const selectionHeight = selection.height * drawScale;
  cutCanvas.width = selectionWidth;
  cutCanvas.height = selectionHeight;

  const ctx = cutCanvas.getContext('2d') as any;

  // 使用 drawImage 方法进行区域截取
  ctx.drawImage(
    sourceCanvas, // 源 canvas 元素
    selection.left * drawScale, // 源 canvas 上截取区域的左上角 x 坐标
    selection.top * drawScale, // 源 canvas 上截取区域的左上角 y 坐标
    selectionWidth, // 截取区域的宽度
    selectionHeight, // 截取区域的高度
    0, // 新 canvas 上绘图的左上角 x 坐标
    0, // 新 canvas 上绘图的左上角 y 坐标
    selectionWidth, // 新 canvas 上绘图的宽度
    selectionHeight, // 新 canvas 上绘图的高度
  );

  return cutCanvas;
};

// 把整页截图裁成「当前视口」并等比缩放到视口内，返回 { canvas, drawScale }
const prepareScreenshotCanvas = (sourceCanvas: HTMLCanvasElement) => {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const sx = Math.floor(window.scrollX * scale);
  const sy = Math.floor(window.scrollY * scale);

  // 1) 裁出当前视口区域（像素尺寸 = 视口 × DPR）
  const viewCanvas = document.createElement('canvas');
  viewCanvas.width = Math.floor(vw * scale);
  viewCanvas.height = Math.floor(vh * scale);
  const vctx = viewCanvas.getContext('2d');
  if (vctx) {
    vctx.drawImage(sourceCanvas, sx, sy, viewCanvas.width, viewCanvas.height, 0, 0, viewCanvas.width, viewCanvas.height);
  }

  // 2) 等比显示到视口内（contain），并把像素尺寸压到 ≤ MAX_CANVAS_DIMENSION，避免卡顿
  const srcW = viewCanvas.width;
  const srcH = viewCanvas.height;
  const displayRatio = Math.min(vw / srcW, vh / srcH, 1);
  const displayW = Math.max(1, Math.round(srcW * displayRatio));
  const displayH = Math.max(1, Math.round(srcH * displayRatio));

  let pixelW = displayW * scale;
  let pixelH = displayH * scale;
  const capRatio = Math.min(1, MAX_CANVAS_DIMENSION / pixelW, MAX_CANVAS_DIMENSION / pixelH);
  pixelW = Math.round(pixelW * capRatio);
  pixelH = Math.round(pixelH * capRatio);

  const out = document.createElement('canvas');
  out.width = pixelW;
  out.height = pixelH;
  const octx = out.getContext('2d');
  if (octx) {
    octx.drawImage(viewCanvas, 0, 0, srcW, srcH, 0, 0, pixelW, pixelH);
  }
  out.style.width = `${displayW}px`;
  out.style.height = `${displayH}px`;

  const drawScale = pixelW / displayW;
  return { canvas: out, drawScale };
};

// 截图产物铺满视口、固定定位：与 .yd-overlay(fixed) 严格对齐，
// 且尺寸就是视口大小——配合「只截取视口区域」，不会被整页截图拉伸变形。
const setCanvasSize = (sourceCanvas: HTMLCanvasElement) => {
  sourceCanvas.style.position = 'fixed';
  sourceCanvas.style.left = '0';
  sourceCanvas.style.top = '0';
  sourceCanvas.style.width = '100vw';
  sourceCanvas.style.height = '100vh';
  sourceCanvas.style.zIndex = '99999997';
};

export {
  cutSelectionAreaFromCanvas,
  prepareScreenshotCanvas,
  setCanvasSize,
};
