import { Options } from './types';
import { cloneNode } from './clone-node';
import { embedImages } from './embed-images';
import { applyStyle } from './apply-style';
import { embedWebFonts, getWebFontCSS } from './embed-webfonts';
import {
  getImageSize,
  getPixelRatio,
  createImage,
  nodeToDataURL,
  checkCanvasDimensions,
} from './util';

export async function toSvg<T extends HTMLElement>(
  node: T,
  options: Options = {},
): Promise<string> {
  const { width, height } = getImageSize(node, options);
  const clonedNode = (await cloneNode(node, options, true)) as HTMLElement;
  await embedWebFonts(clonedNode, options);
  await embedImages(clonedNode, options);
  applyStyle(clonedNode, options);
  return await nodeToDataURL(clonedNode, width, height);
}

export async function toCanvas<T extends HTMLElement>(
  node: T,
  options: Options = {},
): Promise<HTMLCanvasElement> {
  const { width, height } = getImageSize(node, options);
  const svg = await toSvg(node, options);
  const img = await createImage(svg);

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d')!;
  const ratio = options.pixelRatio || getPixelRatio();
  const canvasWidth = options.canvasWidth || width;
  const canvasHeight = options.canvasHeight || height;

  canvas.width = canvasWidth * ratio;
  canvas.height = canvasHeight * ratio;

  if (!options.skipAutoScale) {
    checkCanvasDimensions(canvas);
  }
  canvas.style.width = `${canvasWidth}`;
  canvas.style.height = `${canvasHeight}`;

  if (options.backgroundColor) {
    context.fillStyle = options.backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  context.drawImage(img, 0, 0, canvas.width, canvas.height);

  return canvas;
}

export async function getFontEmbedCSS<T extends HTMLElement>(
  node: T,
  options: Options = {},
): Promise<string> {
  return getWebFontCSS(node, options);
}
