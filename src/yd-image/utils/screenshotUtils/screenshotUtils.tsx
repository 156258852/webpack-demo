import { createToolbarDom, onExitEditHandler } from '../../ImageEditor/Toolbar';
import { ScreenshotOptions } from '../../types/screenshot';
import { canvasToBase64 } from '../dataUtils';
import { pushAction } from '../editUtils/undoUtils';
import * as htmlToImage from './html-to-image/index';
import { cutSelectionAreaFromCanvas, prepareScreenshotCanvas, setCanvasSize } from './canvasUtils';
import './index.scss';

const scale = window.devicePixelRatio || 1;

let originalCanvas: HTMLCanvasElement = document.createElement('canvas');
let startX: number;
let startY: number;
let isSelecting: boolean = false;
let overlay = document.createElement('div');
let selectionBox = document.createElement('div');

let startSelectionHandler: ((e: MouseEvent) => void);
let finishSelectionHandler: ((e: MouseEvent) => void);
let screenshotKeyboardHandler: ((event: KeyboardEvent) => void);

const initializeScreenshot = (resolve: (data: string) => void, config: ScreenshotOptions) => {
  // 初始化截图工具
  // 创建蒙版、截图框、监听mouse事件等
  const { onScreenshotStart } = config;
  onScreenshotStart && onScreenshotStart();

  window.YD_SCREENSHOT_CONFIG = {
    ...config,
    resolve,
    fromScreenshot: true,
    scale,
  };
  startSelectionHandler = (e: MouseEvent) => startSelection(e);
  finishSelectionHandler = (e: MouseEvent) => finishSelection();
  screenshotKeyboardHandler = (e: KeyboardEvent) => keyboardHandler(e);

  // 实际开始截图的逻辑
  return doScreenShot(resolve, config).then(() => {
    // 添加快捷键
    window.addEventListener('keydown', screenshotKeyboardHandler);
  });
};

// 创建蒙版
const createOverlay = () => {
  overlay.className = 'yd-overlay';
  overlay.id = 'yd-overlay';
  document.body.appendChild(overlay);
  return overlay;
};

const doScreenShot = async (resolve: (data: string) => void, config: ScreenshotOptions) => {
  const { fullPage, format, filter, onScreenshotEnd } = config;
  return htmlToImage.toCanvas(config.node as HTMLElement, {
    filter,
    pixelRatio: scale,
  }).then((canvas) => {
    if (fullPage) {
      originalCanvas = canvas;
      const screenshotData = canvasToBase64(originalCanvas, format);
      resolve(screenshotData);
      onScreenshotEnd && onScreenshotEnd();
      return;
    }

    // 只截取「当前视口」区域（含滚动偏移），避免整页巨图被硬塞进 100vw×100vh 导致变形，
    // 同时把像素尺寸压到 视口×DPR（必要时再降采样），画笔 stroke / 撤销 getImageData 不再卡顿。
    const { canvas: viewCanvas, drawScale } = prepareScreenshotCanvas(canvas);
    originalCanvas = viewCanvas;
    // 把真实绘制缩放比写回全局配置，画笔/选区裁剪都用同一套坐标换算，避免错位
    window.YD_SCREENSHOT_CONFIG.scale = drawScale;

    const context = originalCanvas.getContext('2d') as CanvasRenderingContext2D;
    const imageData = context.getImageData(0, 0, originalCanvas.width, originalCanvas.height);
    pushAction(imageData);

    originalCanvas.id = 'yd-image-canvas';
    originalCanvas.className = 'yd-image-canvas';

    setCanvasSize(originalCanvas);
    document.body.appendChild(originalCanvas);

    // 创建蒙版
    createOverlay();

    // 初始化鼠标事件监听器
    overlay.addEventListener('mousedown', startSelectionHandler);
  });
};

const startSelection = (event: MouseEvent) => {
  document.body.addEventListener('mousemove', processSelection);
  document.body.addEventListener('mouseup', finishSelectionHandler);
  selectionBox.id = 'yd-selection-box';
  overlay.removeEventListener('mousedown', startSelectionHandler);
  overlay.style.display = 'none';
  // 开始选择区域的逻辑...
  isSelecting = true;
  startX = event.pageX;
  startY = event.pageY;

  selectionBox.className = 'yd-selection-box';
  selectionBox.style.left = `${startX}px`;
  selectionBox.style.top = `${startY}px`;
  document.body.appendChild(selectionBox);
};

const processSelection = (event: MouseEvent) => {
  document.body.style.userSelect = 'none';
  // 处理选择区域渲染的逻辑
  if (!isSelecting) return;

  const x = Math.min(event.pageX, startX);
  const y = Math.min(event.pageY, startY);
  const width = Math.abs(event.pageX - startX);
  const height = Math.abs(event.pageY - startY);

  selectionBox.style.left = `${x}px`;
  selectionBox.style.top = `${y}px`;
  selectionBox.style.width = `${width}px`;
  selectionBox.style.height = `${height}px`;
};

const finishSelection = () => {
  // 完成区域选择和截图的逻辑
  document.body.style.userSelect = 'initial';
  isSelecting = false;
  document.body.removeEventListener('mousemove', processSelection);
  document.body.removeEventListener('mouseup', finishSelectionHandler);

  const selection = selectionBox.getBoundingClientRect();
  overlay.style.display = 'initial';
  selectionBox.style.clipPath = 'inset(100%)';
  setOverlayClipPath(overlay, selection);

  const cutCanvas = cutSelectionAreaFromCanvas(originalCanvas, selection);
  window.YD_SCREENSHOT_CONFIG.originalCanvas = originalCanvas;
  window.YD_SCREENSHOT_CONFIG.cutCanvas = cutCanvas;
  window.YD_SCREENSHOT_CONFIG.selection = selection;
  createToolbarDom(selectionBox);
  originalCanvas.style.zIndex = '99999998';
};

const setOverlayClipPath = (element: HTMLElement, selection: DOMRect) => {
  element.style.clipPath = `polygon(
    0% 0%,
    100% 0%,
    100% 100%,
    0% 100%,
    0% ${selection.top}px,
    ${selection.left}px ${selection.top}px,
    ${selection.left}px ${selection.top + selection.height}px,
    ${selection.left + selection.width}px ${selection.top + selection.height}px,
    ${selection.left + selection.width}px ${selection.top}px,
    0% ${selection.top}px)`;
};

const clearScreenShotDom = () => {
  // @ts-ignore
  overlay.style = '';
  // @ts-ignore
  selectionBox.style = '';
  // @ts-ignore
  originalCanvas.style = '';
  if (overlay.parentElement) {
    overlay.parentElement.removeChild(overlay);
    overlay = document.createElement('div');
  }
  if (selectionBox.parentElement) {
    selectionBox.parentElement.removeChild(selectionBox);
    selectionBox = document.createElement('div');
  }
  if (originalCanvas.parentElement) {
    originalCanvas.parentElement.removeChild(originalCanvas);
    originalCanvas = document.createElement('canvas');
  }
};

const keyboardHandler = (e: KeyboardEvent) => {
  if (e.key === 'Escape' || e.key === 'Esc') {
    onExitEditHandler();
    window.removeEventListener('keydown', screenshotKeyboardHandler);
  }
};

export {
  initializeScreenshot,
  clearScreenShotDom,
  cutSelectionAreaFromCanvas,
  createOverlay,
};
