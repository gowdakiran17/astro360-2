import { useCallback, useRef, useState, type TouchEvent } from 'react';

export interface PullToRefreshState {
  isPulling: boolean;
  pullDistance: number;
  isRefreshing: boolean;
}

export const usePullToRefresh = (onRefresh: () => Promise<void> | void, opts?: { threshold?: number; maxPull?: number }) => {
  const threshold = opts?.threshold ?? 72;
  const maxPull = opts?.maxPull ?? 96;

  const startYRef = useRef<number | null>(null);
  const [state, setState] = useState<PullToRefreshState>({
    isPulling: false,
    pullDistance: 0,
    isRefreshing: false
  });

  const setPullDistance = useCallback((pullDistance: number) => {
    const clamped = Math.max(0, Math.min(maxPull, pullDistance));
    setState((s) => ({ ...s, pullDistance: clamped, isPulling: clamped > 0 }));
  }, [maxPull]);

  const onTouchStart = useCallback((e: TouchEvent) => {
    if (typeof window === 'undefined') return;
    if (window.scrollY > 0) return;
    startYRef.current = e.touches[0]?.clientY ?? null;
  }, []);

  const onTouchMove = useCallback((e: TouchEvent) => {
    if (typeof window === 'undefined') return;
    if (window.scrollY > 0) return;
    if (startYRef.current == null) return;
    const y = e.touches[0]?.clientY ?? 0;
    const delta = y - startYRef.current;
    if (delta <= 0) {
      setPullDistance(0);
      return;
    }
    setPullDistance(delta * 0.8);
  }, [setPullDistance]);

  const finish = useCallback(async () => {
    setState((s) => ({ ...s, isRefreshing: true }));
    try {
      await onRefresh();
    } finally {
      startYRef.current = null;
      setState({ isPulling: false, pullDistance: 0, isRefreshing: false });
    }
  }, [onRefresh]);

  const onTouchEnd = useCallback(() => {
    if (startYRef.current == null) return;
    if (state.pullDistance >= threshold && !state.isRefreshing) {
      void finish();
      return;
    }
    startYRef.current = null;
    setState((s) => ({ ...s, isPulling: false, pullDistance: 0 }));
  }, [finish, state.isRefreshing, state.pullDistance, threshold]);

  return {
    state,
    bind: {
      onTouchStart,
      onTouchMove,
      onTouchEnd
    }
  };
};
