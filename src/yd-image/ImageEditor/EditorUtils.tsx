import { createOverlay } from '../utils/screenshotUtils/screenshotUtils';
import { pushAction } from '../utils/editUtils/undoUtils';
import { createToolbarDom } from './Toolbar';

const originalCanvas: HTMLCanvasElement = document.createElement('canvas');

const initEdit = async (pictureData: string) => new Promise((resolve) => {
  const overlay = createOverlay();
  const img = new Image();
  img.src = pictureData;

  const canvasWrapper = document.createElement('div');
  canvasWrapper.className = 'yd-image-canvas-wrapper';
  overlay.appendChild(canvasWrapper);

  img.onload = () => {
    const ctx = originalCanvas.getContext('2d') as CanvasRenderingContext2D;

    const imgHeight = img.height;
    const imgWidth = img.width;
    const maxHeight = window.innerHeight * 0.8;
    let canvasWidth = imgWidth;
    let canvasHeight = imgHeight;

    let scaleFactor = 1;
    if (imgHeight > maxHeight) {
      scaleFactor = maxHeight / imgHeight;
      canvasWidth = imgWidth * scaleFactor;
      canvasHeight = imgHeight * scaleFactor;
      originalCanvas.style.width = `${canvasWidth}px`;
      originalCanvas.style.height = `${canvasHeight}px`;
    }

    // 允许不经过截图、直接传图打开编辑器：缺失全局配置时给默认值
    const screenshotConfig = window.YD_SCREENSHOT_CONFIG || {};
    const { scale = window.devicePixelRatio || 1 } = screenshotConfig;
    window.YD_SCREENSHOT_CONFIG = {
      ...screenshotConfig,
      originalCanvas,
      selection: canvasWrapper,
      scale,
      fromScreenshot: false,
      resolve,
    };

    originalCanvas.width = canvasWidth * scale;
    originalCanvas.height = canvasHeight * scale;

    ctx.drawImage(img, 0, 0, originalCanvas.width, originalCanvas.height);

    const imageData = ctx.getImageData(0, 0, originalCanvas.width, originalCanvas.height);
    pushAction(imageData);

    canvasWrapper.appendChild(originalCanvas);

    createToolbarDom(canvasWrapper);
  };
});

export {
  initEdit,
};
