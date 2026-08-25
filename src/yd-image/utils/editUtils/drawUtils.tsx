/* eslint-disable @ali/yd/no-multiple-params */
import { getCanvasConfig } from '../dataUtils';
import { pushAction } from './undoUtils';

let drawScale = window.devicePixelRatio || 1;

let context: CanvasRenderingContext2D;
const current = {
  color: 'red',
  x: 0,
  y: 0,
};
let drawing = false;

const initDrawing = () => {
  const { originalCanvas, context: ctx, config } = getCanvasConfig();
  context = ctx;

  current.color = config.DRAW.color;

  originalCanvas.addEventListener('mousedown', onMouseDown, false);
  originalCanvas.addEventListener('mouseup', onMouseUp, false);
};

const stopDrawing = () => {
  const { originalCanvas } = getCanvasConfig();
  originalCanvas.removeEventListener('mousedown', onMouseDown, false);
  originalCanvas.removeEventListener('mouseup', onMouseUp, false);
  originalCanvas.removeEventListener('mousemove', onMouseMove, false);
};

const drawLine = ({ x0, y0, x1, y1, hidden }) => {
  if (hidden) return;
  context.beginPath();
  context.moveTo(x0, y0);
  context.lineTo(x1, y1);
  const { config } = getCanvasConfig();
  const color = config.DRAW.color || 'red';
  context.strokeStyle = color;
  context.lineWidth = config.DRAW.size;
  context.stroke();
  context.closePath();
};

const onMouseDown = (e: MouseEvent) => {
  const { originalCanvas, config } = getCanvasConfig();
  const { scale } = config;
  drawScale = scale;
  originalCanvas.addEventListener('mousemove', onMouseMove, false);
  drawing = true;
  current.x = e.offsetX * drawScale;
  current.y = e.offsetY * drawScale;
};

const onMouseUp = (e: MouseEvent) => {
  if (!drawing) { return; }
  const { originalCanvas } = getCanvasConfig();
  const imageData = context.getImageData(0, 0, originalCanvas.width, originalCanvas.height);
  pushAction(imageData);
  drawing = false;
  originalCanvas.removeEventListener('mousemove', onMouseMove, false);
};

const onMouseMove = (e: MouseEvent) => {
  if (!drawing) {
    return;
  }
  drawLine({ x0: current.x, y0: current.y, x1: e.offsetX * drawScale, y1: e.offsetY * drawScale, hidden: false });
  current.x = e.offsetX * drawScale;
  current.y = e.offsetY * drawScale;
};


export {
  initDrawing,
  stopDrawing,
};
