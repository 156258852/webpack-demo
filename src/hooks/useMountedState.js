import { useEffect, useState } from 'react';

export default function useMountedState() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  });

  return isMounted;
}
