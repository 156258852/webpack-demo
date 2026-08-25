import { getCanvasConfig } from '../dataUtils';
import { pushAction } from './undoUtils';
import './index.scss';

let inputBox: HTMLTextAreaElement | null;
let context: CanvasRenderingContext2D;

// 屏幕缩放比例
const scale = window.devicePixelRatio || 1;

const initAddText = () => {
  const config = window.YD_SCREENSHOT_CONFIG;
  const { originalCanvas } = config;
  context = originalCanvas.getContext('2d');

  originalCanvas.addEventListener('click', onCanvasClick);
};

const stopAddText = () => {
  const { originalCanvas, context: ctx } = getCanvasConfig();
  context = ctx;
  originalCanvas.classList.remove('text');

  originalCanvas.removeEventListener('click', onCanvasClick);
};

function onCanvasClick(e: MouseEvent) {
  removeInputBox();

  const { originalCanvas, config } = getCanvasConfig();
  const { selection, TEXT } = config;
  const { size, color } = TEXT;


  const x = e.offsetX;
  const y = e.offsetY;

  inputBox = document.createElement('textarea');
  inputBox.id = 'yd-image-text-input';
  inputBox.className = 'yd-image-text-input';
  inputBox.rows = 1;
  const inputWidth = selection.right - x;
  const font = `${size}px sans-serif`;
  inputBox.style.font = font;
  inputBox.style.color = color;
  inputBox.style.left = `${e.offsetX}px`;
  inputBox.style.top = `${e.offsetY - size / 2}px`;
  inputBox.style.width = `${inputWidth}px`;

  inputBox.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      handleNewLine(inputWidth, font); // 处理换行
    }
  });
  inputBox.addEventListener('input', () => {
    autoAdjustHeight(); // 调整高度
    handleInput(font); // 处理输入
  });

  originalCanvas.parentElement.appendChild(inputBox);

  inputBox.focus();
  // 输入框失焦时添加文字
  inputBox.addEventListener('blur', () => {
    addText({ size, color, x, y });
    removeInputBox();
  });
}

const addText = ({ size, color, x, y }) => {
  const fontSize = size * scale;
  context.lineWidth = 0.5;
  context.fillStyle = color;
  context.textBaseline = 'top';
  context.font = `${fontSize}px sans-serif`;

  if (inputBox!.value === '') return;

  const lines = inputBox!.value.split('\n');
  lines.forEach((line, index) => {
    // 处理换行符并绘制多行文本
    context.fillText(line, x * scale, y * scale + index * fontSize * 1.4);
    context.restore();
  });
  const { originalCanvas } = getCanvasConfig();
  const imageData = context.getImageData(0, 0, originalCanvas.width, originalCanvas.height);
  pushAction(imageData);
};

const handleInput = (font: string) => {
  const maxWidth = parseInt(getComputedStyle(inputBox as any).width);
  context.font = font; // 使用与textarea相同的字体样式

  // 判断当前内容的宽度，超过最大宽度将新输入的字符隐藏
  const text = inputBox!.value;
  const lines = text.split('\n');
  const newLines = lines.map(line => {
    const width = context.measureText(line).width;
    if (width > maxWidth) {
      // 去掉宽度超出部分
      line = line.slice(0, -1);
    }
    return line;
  });

  inputBox!.value = newLines.join('\n');
};

const handleNewLine = (maxWidth: number, font: string) => {
  context.font = font; // 使用与textarea相同的字体样式

  // 追加换行符
  const text = inputBox!.value;
  const lines = text.split('\n');
  const newLines = lines.map(line => {
    const width = context.measureText(line).width;
    if (width > maxWidth) {
      // 去掉宽度超出部分并追加新行
      line = line.slice(0, -1);
      line += '\n';
    }
    return line;
  });

  inputBox!.value = newLines.join('\n');
};

const removeInputBox = () => {
  if (inputBox) {
    const parentElement = inputBox.parentElement;
    parentElement && parentElement.removeChild(inputBox);
    inputBox = null;
  }
};

const autoAdjustHeight = () => {
  if (inputBox) {
    inputBox.style.height = 'auto'; // 重新设置高度
    inputBox.style.height = `${inputBox.scrollHeight}px`; // 自适应高度
  }
};

export {
  initAddText,
  stopAddText,
};
