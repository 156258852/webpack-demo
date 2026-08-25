import { message } from 'antd';

const canvasToBase64 = (canvas: HTMLCanvasElement, format: string = 'jpeg') => canvas.toDataURL(`image/${format}`);

async function copyCanvasImageToClipboard(canvas: HTMLCanvasElement) {
  try {
    // 使用 toBlob() 将 canvas 内容转换为 Blob 对象
    canvas.toBlob((blob) => {
      if (typeof window.ClipboardItem !== 'undefined') {
        if (blob !== null) {
          navigator.clipboard.write([
            new window.ClipboardItem({
              [blob.type]: blob,
            }),
          ]).then(() => {
            message.success('success');
          }).catch(err => {
            message.error('copy failure');
            console.error('copy failure: ', err);
          });
        } else {
          message.error('copy failure');
          console.error('copy failure');
        }
      }
    }, 'image/png'); // 注意: 第二个参数 'image/png' 是 Mimetype
  } catch (err) {
    message.error('copy failure');
    console.error('copy failure: ', err);
  }
}

const getCanvasConfig = () => {
  const config = window.YD_SCREENSHOT_CONFIG;
  const { originalCanvas } = config;
  const context = originalCanvas.getContext('2d');
  return { originalCanvas, context, config };
};

export {
  canvasToBase64,
  copyCanvasImageToClipboard,
  getCanvasConfig,
};
