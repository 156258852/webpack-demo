import { useEffect } from 'react';
import { on, once, off, EventNameType } from './EventCenter';

function useEvent(
  name: EventNameType,
  handler: ((data: any) => void) | null | false,
  isOnce: boolean = false,
) {
  useEffect(() => {
    if (!handler) {
      return;
    }

    isOnce ? once({ name, handler }) : on({ name, handler });

    return () => {
      off(name, handler);
    };
  }, [name, handler]);
}

export default useEvent;
