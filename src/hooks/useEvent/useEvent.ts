import { useEffect, useRef } from 'react';
import { on, once, off, EventNameType } from './EventCenter';

function useEvent(
  name: EventNameType,
  handler: ((data: any) => void) | null | false,
  isOnce: boolean = false,
) {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (!handler) {
      return;
    }

    const fn = (data: any) => {
      const h = handlerRef.current;
      if (h) h(data);
    };

    isOnce ? once({ name, handler: fn }) : on({ name, handler: fn });

    return () => {
      off(name, fn);
    };
  }, [name]);
}

export default useEvent;
