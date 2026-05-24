import { useEffect } from 'react';
import { initGlobalMotion } from '../../utils/motion-engine';

export default function GlobalMotion() {
  useEffect(() => {
    const cleanup = initGlobalMotion();
    return cleanup;
  }, []);

  return null;
}
