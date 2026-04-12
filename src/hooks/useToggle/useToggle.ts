import { useReducer } from 'react';

type ToggleReturnType = (nextValue?: boolean) => void;

const toggleReducer = (
  state: boolean,
  nextValue?: boolean
): boolean => (typeof nextValue === 'boolean' ? nextValue : !state);

function useToggle(
  initialValue: boolean
): [boolean, ToggleReturnType] {
  return useReducer(toggleReducer, initialValue);
}

export default useToggle;
