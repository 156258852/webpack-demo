import { useState } from 'react';
import { useEvent, dispatch } from '../useEvent';

function useModal<T = unknown>(key: string) {
  const [visible, setVisible] = useState(false);
  const [content, setContent] = useState<T | null>(null);

  useEvent(`useModal:${key}`, (payload: { visible: boolean; content?: T }) => {
    setVisible(payload.visible);
    if (payload.content !== undefined) setContent(payload.content);
  });

  return {
    visible,
    content,
    close: () => hide(key),
  };
}

function show(key: string, content: unknown = null) {
  dispatch(`useModal:${key}`, { visible: true, content });
}

function hide(key: string) {
  dispatch(`useModal:${key}`, { visible: false });
}

useModal.show = show;
useModal.hide = hide;

export default useModal;
