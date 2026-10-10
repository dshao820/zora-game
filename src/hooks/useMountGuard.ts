import { useCallback, useRef } from 'react';

/**
 * 畫面剛出現的短時間內忽略點擊：
 * 避免上一個畫面的點擊（或幼兒連點）直接觸發新畫面上同位置的按鈕。
 */
export function useMountGuard(ms = 500) {
  const mountedAt = useRef(performance.now());
  return useCallback(() => performance.now() - mountedAt.current >= ms, [ms]);
}
