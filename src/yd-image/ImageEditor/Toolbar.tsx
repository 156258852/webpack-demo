import React from 'react';
import { createRoot } from 'react-dom/client';
import { Button, InputNumber } from 'antd';
import {
  EditOutlined,
  UndoOutlined,
  CloseOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import {
  draw,
  addText,
  addMosaic,
} from '../utils/edit';
import { exitScreenshot } from '../utils/screenshot';
import { stopPrevEditing } from '../utils/editUtils';
import { canvasToBase64, getCanvasConfig } from '../utils/dataUtils';
import { cutSelectionAreaFromCanvas } from '../utils/screenshotUtils/canvasUtils';
import { onUndo, resetUndo } from '../utils/editUtils/undoUtils';
import {
  toolSizeConfig,
  toolColorConfig,
} from './ToolbarUtils';
import './index.scss';

let prevSelectedTool: HTMLElement;
let prevEditType: string;

// React 18: 用 createRoot 渲染工具栏/配置面板，并在清理时 unmount
let toolbarRoot: ReturnType<typeof createRoot> | null = null;
let configRoot: ReturnType<typeof createRoot> | null = null;

const createToolbarDom = (selectionElement: HTMLElement) => {
  const selection = selectionElement.getBoundingClientRect();
  // 创建工具栏元素
  const toolbarElement = document.createElement('div');
  toolbarElement.id = 'yd-image-toolbar-container';
  toolbarElement.className = 'yd-image-toolbar-container';
  toolbarRoot = createRoot(toolbarElement);
  toolbarRoot.render(
    <div className="yd-image-toolbar">
      <Button type="text" size="small" id="yd-image-toolbar-draw" className="yd-image-toolbar-item edit" onClick={() => onToolClickHandler({ toolbarElement, editType: 'DRAW' })} icon={<EditOutlined />} />
      <div className="yd-image-toolbar-item edit" id="yd-image-toolbar-text" style={{ fontSize: '20px' }} onClick={() => onToolClickHandler({ toolbarElement, editType: 'TEXT' })}>T</div>
      <div className="yd-image-toolbar-item mosaic" id="yd-image-toolbar-mosaic" onClick={() => onToolClickHandler({ toolbarElement, editType: 'MOSAIC' })}>
        <div className="cell" />
        <div className="cell" />
        <div className="cell" />
        <div className="cell" />
      </div>
      <div style={{ fontSize: '20px' }}>｜</div>
      <Button type="text" size="small" className="yd-image-toolbar-item" onClick={onUndoHandler} icon={<UndoOutlined />} />
      <Button type="text" size="small" className="yd-image-toolbar-item" onClick={onExitEditHandler} icon={<CloseOutlined />} />
      <Button type="text" size="small" className="yd-image-toolbar-item" onClick={onFinishEditHandler} icon={<CheckOutlined />} />
    </div>,
  );
  toolbarElement.style.top = `${selection.bottom + window.scrollY + 4}px`;
  toolbarElement.style.left = `${selection.right / 2}px`;

  const parentElement = selectionElement.parentElement;
  if (parentElement) {
    parentElement.appendChild(toolbarElement);
  } else {
    throw new Error('找不到父元素');
  }
};

const createToolConfigPanelDom = (toolbarElement: HTMLElement, editType: string) => {
  removeToolConfigPanelDom();
  const toolbar = toolbarElement.getBoundingClientRect();
  const toolConfigElement = document.createElement('div');
  toolConfigElement.id = 'yd-image-toolconfig-container';
  toolConfigElement.className = 'yd-image-toolconfig-container';

  const colorPanel = (<div className="yd-image-toolconfig">
    {
      toolColorConfig.map((item, index) => (<div
        key={item}
        className={index === 0 ? 'yd-image-toolconfig-item color selected' : 'yd-image-toolconfig-item color'}
        style={{ backgroundColor: item }}
        onClick={() => onColorClickHandler({ color: item, index, editType })}
      />))
    }
  </div>);

  const sizePanel = (<div className="yd-image-toolconfig">
    {
      toolSizeConfig.map((item, index) => (<div
        key={item}
        className={index === 0 ? 'yd-image-toolconfig-item size selected' : 'yd-image-toolconfig-item size'}
        style={{ width: `${item}px`, height: `${item}px` }}
        onClick={() => onSizeClickHandler({ size: item, index, editType })}
      />))
    }
  </div>);

  const textSizePanel = (<div>
    <InputNumber
      className="yd-image-toolconfig-item"
      defaultValue={16}
      min={1}
      max={100}
      style={{ width: '80px' }}
      onChange={onTextSizeChangeHandler}
    />
  </div>);

  configRoot = createRoot(toolConfigElement);
  configRoot.render(
    <div className="yd-image-toolconfig">
      {
        editType !== 'TEXT' ? sizePanel : textSizePanel
      }
      <div style={{ fontSize: '20px' }}>｜</div>
      {colorPanel}
    </div>,
  );

  setToolbarConfig();

  toolConfigElement.style.top = `${toolbar.bottom + window.scrollY + 4}px`;
  toolConfigElement.style.left = `${toolbar.left}px`;

  const parentElement = toolbarElement.parentElement;
  if (parentElement) {
    parentElement.appendChild(toolConfigElement);
    setColorIconStyle();
  } else {
    throw new Error('找不到父元素');
  }
};

const removeToolConfigPanelDom = () => {
  configRoot?.unmount();
  configRoot = null;
  const toolconfig = document.getElementById('yd-image-toolconfig-container');
  if (toolconfig) {
    toolconfig.parentElement?.removeChild(toolconfig);
  }
};

const onToolClickHandler = ({ toolbarElement, editType }) => {
  if (prevEditType) {
    stopPrevEditing[prevEditType]();
  }
  prevEditType = editType;
  setSelectedStyle(editType);
  if (editType !== 'MOSAIC') {
    createToolConfigPanelDom(toolbarElement, editType);
  } else {
    removeToolConfigPanelDom();
  }
  initEditing(editType);
};

const initEditing = (editType: string) => {
  const { originalCanvas } = getCanvasConfig();
  switch (editType) {
    case 'DRAW':
      draw();
      break;
    case 'TEXT':
      originalCanvas.classList.add('text');
      addText({ canvas: originalCanvas });
      break;
    case 'MOSAIC':
      addMosaic();
      break;
    default:
      break;
  }
};

const onUndoHandler = () => {
  onUndo();
};

const onExitEditHandler = () => {
  const { config: { onScreenshotEnd } } = getCanvasConfig();
  removeToolbarPanel();
  exitScreenshot();
  if (prevEditType) {
    stopPrevEditing[prevEditType]();
  }
  onScreenshotEnd && onScreenshotEnd();
  resetUndo();
};

const onFinishEditHandler = () => {
  const { originalCanvas, config: { resolve, format, selection, fromScreenshot } } = getCanvasConfig();
  let data;
  if (fromScreenshot) {
    const finalCanvas = cutSelectionAreaFromCanvas(originalCanvas, selection);
    data = canvasToBase64(finalCanvas, format || 'jpeg');
  } else {
    data = canvasToBase64(originalCanvas, format || 'jpeg');
  }
  resolve(data);
  onExitEditHandler();
};

const setSelectedStyle = (selectedTool: string) => {
  if (prevSelectedTool) {
    prevSelectedTool.classList.remove('selected');
  }
  const element = document.getElementById(`yd-image-toolbar-${selectedTool}`);
  if (element) {
    prevSelectedTool = element;
    element.classList.add('selected');
  }
};

const removeToolbarPanel = () => {
  toolbarRoot?.unmount();
  toolbarRoot = null;
  configRoot?.unmount();
  configRoot = null;
  const toobar = document.getElementById('yd-image-toolbar-container');
  const toolbarConfig = document.getElementById('yd-image-toolconfig-container');
  toobar?.parentElement?.removeChild(toobar);
  toolbarConfig?.parentElement?.removeChild(toolbarConfig);
};

const onSizeClickHandler = ({ size, index, editType }) => {
  window.YD_SCREENSHOT_CONFIG[editType].size = size;
  const sizeIcons = document.getElementsByClassName('yd-image-toolconfig-item size');
  for (let i = 0; i < sizeIcons.length; i++) {
    if (i === index) {
      sizeIcons[i].classList.add('selected');
    } else {
      sizeIcons[i].classList.remove('selected');
    }
  }
};

const onColorClickHandler = ({ color, index, editType }) => {
  window.YD_SCREENSHOT_CONFIG[editType].color = color;
  const colorIcons = document.getElementsByClassName('yd-image-toolconfig-item color');
  for (let i = 0; i < colorIcons.length; i++) {
    if (i === index) {
      colorIcons[i].classList.add('selected');
    } else {
      colorIcons[i].classList.remove('selected');
    }
  }
};

const setColorIconStyle = () => {
  const colorIcons = document.getElementsByClassName('yd-image-toolconfig-item color');
  for (let i = 0; i < colorIcons.length; i++) {
    const el = colorIcons[i];
    el.addEventListener('mouseenter', () => {
      for (let j = 0; j < colorIcons.length; j++) {
        if (j === i) {
          el.classList.add('hover');
        } else {
          colorIcons[j].classList.remove('hover');
        }
      }
    });

    el.addEventListener('mouseleave', () => {
      el.classList.remove('hover');
    });
  }
};

const onTextSizeChangeHandler = (value: number) => {
  window.YD_SCREENSHOT_CONFIG.TEXT.size = value;
};

const setToolbarConfig = () => {
  const toolConfig = {
    DRAW: {
      size: 8,
      color: 'red',
    },
    TEXT: {
      size: 16,
      color: 'red',
    },
  };
  window.YD_SCREENSHOT_CONFIG = {
    ...window.YD_SCREENSHOT_CONFIG,
    ...toolConfig,
  };
};

export {
  createToolbarDom,
  onExitEditHandler,
};
