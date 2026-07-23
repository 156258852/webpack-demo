import { useReducer } from 'react';

type ToggleReturnType = (nextValue?: boolean) => void;

const toggleReducer = (
  state: boolean,
  nextValue?: boolean
): boolean => (typeof nextValue === 'boolean' ? nextValue : !state);

function useToggle(
  initialValue: boolean
): [boolean, ToggleReturnType] {
  const [state, dispatch] = useReducer(toggleReducer, initialValue);
  const toggle: ToggleReturnType = (nextValue?: boolean) => dispatch(nextValue);
  return [state, toggle];
}

export default useToggle;
