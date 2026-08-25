import { stopDrawing } from './drawUtils';
import { stopAddText } from './textUtils';
import { stopAddMosaic } from './mosaicUtils';

const setCssVar = (key: string, value: string) => {
  document.documentElement.style.setProperty(key, value);
};

const stopPrevEditing = {
  DRAW: stopDrawing,
  TEXT: stopAddText,
  MOSAIC: stopAddMosaic,
};

export {
  setCssVar,
  stopPrevEditing,
};
