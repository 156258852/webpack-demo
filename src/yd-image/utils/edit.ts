import { initDrawing } from './editUtils/drawUtils';
import { initAddText } from './editUtils/textUtils';
import { initAddMosaic } from './editUtils/mosaicUtils';
/**
 * 函数名称：draw
 *
 * 函数说明：画笔涂抹功能，调用后进入画笔模式，可多次涂抹
 *
 * @param {Object} drawOptions - 画笔选项
 * @param {HTMLCanvasElement} [drawOptions.canvas] - 需要编辑的canvas
 * @param {string} [drawOptions.color=red] - 画笔颜色。默认为red
 * @param {number} [drawOptions.width=12] - 线条宽度。默认值为12，单位为px
 * @param {function} [drawOptions.onDrawStart] - 开始涂画回调函数
 * @param {function} [drawOptions.onDrawEnd] - 结束涂画回调函数
 *
 */

const draw = () => {
  initDrawing();
};

type AddTextOptions = {
  canvas: HTMLCanvasElement;
  fontColor?: string;
  fontSize?: number;
  fontFamily?: string;
  onAddTextStart?: () => void;
  onAddTextEnd?: () => void;
};
/**
 * 函数名称：addText
 *
 * 函数说明：添加文字功能，调用后进入添加文字模式，可多次添加
 *
 * @param {Object} textOptions - 文字选项
 * @param {HTMLCanvasElement} [textOptions.canvas] - 需要添加文字的canvas
 * @param {string} [textOptions.fontColor=red] - 字体颜色。默认为red
 * @param {number} [textOptions.fontSize=16] - 字体大小。默认值为16，单位为px
 * @param {string} [textOptions.fontFamily=sans-serif] - 字体类型。默认值为sans-serif
 * @param {function} [textOptions.onAddTextStart] - 开始添加文字回调函数
 * @param {function} [textOptions.onAddTextEnd] - 结束添加文字回调函数
 *
 */
const addText = ({
  onAddTextStart = () => {},
  onAddTextEnd = () => {},
}: AddTextOptions) => {
  onAddTextStart();
  // 添加文字的实现
  initAddText();
  onAddTextEnd();
};

const addMosaic = () => {
  initAddMosaic();
};

export {
  draw,
  addText,
  addMosaic,
};
