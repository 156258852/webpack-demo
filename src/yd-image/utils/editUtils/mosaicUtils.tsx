/* eslint-disable @ali/yd/no-multiple-params */
import { getCanvasConfig } from '../dataUtils';
import { pushAction } from './undoUtils';
import './index.scss';

let startX: number;
let startY: number;
let isSelecting: boolean = false;
let selectionBox = document.createElement('div');

let startSelectionHandler: ((e: MouseEvent) => void);
let finishSelectionHandler: ((e: MouseEvent) => void);

// 屏幕缩放比例
// const scale = window.devicePixelRatio || 1;

const initAddMosaic = () => {
  const { originalCanvas } = getCanvasConfig();

  startSelectionHandler = (e: MouseEvent) => startSelection(e);
  finishSelectionHandler = (e: MouseEvent) => finishSelection();

  originalCanvas.addEventListener('mousedown', startSelectionHandler);
};

const startSelection = (event: MouseEvent) => {
  document.body.addEventListener('mousemove', processSelection);
  document.body.addEventListener('mouseup', finishSelectionHandler);
  selectionBox.id = 'yd-selection-box';
  // 开始选择区域的逻辑...
  isSelecting = true;
  startX = event.pageX;
  startY = event.pageY;

  selectionBox.className = 'yd-selection-box';
  selectionBox.style.zIndex = '99999999';
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
  const { originalCanvas, config } = getCanvasConfig();
  const { scale } = config;
  // 完成区域选择和截图的逻辑
  document.body.style.userSelect = 'initial';
  isSelecting = false;
  document.body.removeEventListener('mousemove', processSelection);
  document.body.removeEventListener('mouseup', finishSelectionHandler);

  const selection = selectionBox.getBoundingClientRect();
  document.body.removeChild(selectionBox);
  selectionBox = document.createElement('div');

  // 计算选定区域相对于canvas的位置
  const x = selection.left - originalCanvas.getBoundingClientRect().left;
  const y = selection.top - originalCanvas.getBoundingClientRect().top;
  const width = selection.width;
  const height = selection.height;

  // 马赛克化选定区域
  applyMosaic(x * scale, y * scale, Math.ceil(width * scale), Math.ceil(height * scale));
};

const applyMosaic = (x: number, y: number, width: number, height: number, mosaicSize: number = 15) => {
  const { context, originalCanvas } = getCanvasConfig();
  const imageData = context.getImageData(x, y, width, height);
  const data = imageData.data;

  for (let i = 0; i < width; i += mosaicSize) {
    for (let j = 0; j < height; j += mosaicSize) {
      const red = [] as any;
      const green = [] as any;
      const blue = [] as any;

      const blockWidth = Math.min(mosaicSize, width - i);
      const blockHeight = Math.min(mosaicSize, height - j);

      for (let dx = 0; dx < blockWidth; dx++) {
        for (let dy = 0; dy < blockHeight; dy++) {
          const pixelIndex = ((j + dy) * width + (i + dx)) * 4;
          red.push(data[pixelIndex]);
          green.push(data[pixelIndex + 1]);
          blue.push(data[pixelIndex + 2]);
        }
      }

      const avgRed = red.reduce((sum, val) => sum + val, 0) / red.length;
      const avgGreen = green.reduce((sum, val) => sum + val, 0) / green.length;
      const avgBlue = blue.reduce((sum, val) => sum + val, 0) / blue.length;

      for (let dx = 0; dx < blockWidth; dx++) {
        for (let dy = 0; dy < blockHeight; dy++) {
          const pixelIndex = ((j + dy) * width + (i + dx)) * 4;
          data[pixelIndex] = avgRed;
          data[pixelIndex + 1] = avgGreen;
          data[pixelIndex + 2] = avgBlue;
        }
      }
    }
  }
  context.putImageData(imageData, x, y);

  pushAction(context.getImageData(0, 0, originalCanvas.width, originalCanvas.height));
};

const stopAddMosaic = () => {
  const { originalCanvas } = getCanvasConfig();
  originalCanvas.removeEventListener('mousedown', startSelectionHandler);
};

export {
  initAddMosaic,
  stopAddMosaic,
};
