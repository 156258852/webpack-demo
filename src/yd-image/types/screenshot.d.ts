export type ScreenshotOptions = {
  format?: 'jpeg' | 'png' | 'webp' | 'avif';
  fullPage?: boolean;
  filter?: (node: HTMLElement) => boolean;
  onScreenshotStart?: () => void;
  onScreenshotEnd?: () => void;
  node?: HTMLElement;
};

