import { ScreenshotOptions } from '../types/screenshot';
import { initializeScreenshot, clearScreenShotDom } from './screenshotUtils/screenshotUtils';
/**
 * 函数名称：screenshot
 *
 * 函数说明：选取页面内容进行截图；调用该函数后，鼠标进入截图状态；
 *         点击后开始选择区域，松开后生成图片，返回图片base64数据
 *
 * @param {Object} screenshotOptions - 截图选项
 * @param {string} [screenshotOptions.format=jpeg] - 截图图片格式，支持jpeg/png/webp/avif（其他待定）。默认值为jpeg
 * @param {bolean} [screenshotOptions.fullPage=false] - 是否整个页面截图。默认值为false；为true时直接返回整个页面截图
 * @param {function} [screenshotOptions.onScreenshotStart] - 开始截图回调函数
 * @param {function} [screenshotOptions.onScreenshotEnd] - 结束截图回调函数
 *
 * @returns {string} pictureData：截图图片的base64数据
 *
 */

const screenshot = async ({
  node = document.body,
  format = 'jpeg',
  fullPage = false,
  filter = () => true,
  onScreenshotStart = () => {},
  onScreenshotEnd = () => {},
}: ScreenshotOptions): Promise<string> =>
  // eslint-disable-next-line prefer-const
  new Promise((resolve) => {
    // 开始截图事件
    initializeScreenshot(resolve, { format, fullPage, filter, onScreenshotStart, onScreenshotEnd, node }).catch((error) => {
      console.error('screenshot', error);
      onScreenshotEnd(); // 在异常情况下也调用结束回调
    });
  });

/**
 * 函数名称：exitscreenshot
 *
 * 函数说明：退出截图
 *
 */
const exitScreenshot = () => {
  clearScreenShotDom();
};

export {
  screenshot,
  exitScreenshot,
};
