import React, { useEffect, useRef } from 'react';

const useUpdateEffect = (
  fn: React.EffectCallback,
  deps?: React.DependencyList,
) => {
  const mountedRef = useRef(false);

  useEffect(
    () => () => {
      mountedRef.current = false;
    },
    [],
  );

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }

    return fn?.();
  }, deps);
};

export default useUpdateEffect;
