import { getCanvasConfig } from '../dataUtils';

let canvasStates: any[] = [];
let popCanvasStates: any[] = [];

const pushAction = (imageData) => {
  canvasStates.push(imageData);
};

const popAction = () => {
  if (canvasStates.length === 1) {
    return;
  }
  const pop = canvasStates.pop();
  popCanvasStates.push(pop);
  return canvasStates[canvasStates.length - 1];
};

const onUndo = () => {
  const newestImageData = popAction();
  const { context } = getCanvasConfig();
  newestImageData && context.putImageData(newestImageData, 0, 0);
};

const resetUndo = () => {
  canvasStates = [];
  popCanvasStates = [];
};

export {
  pushAction,
  onUndo,
  resetUndo,
};
