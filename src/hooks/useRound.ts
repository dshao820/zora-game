import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * 題目回合管理：
 * - round：目前第幾題（改變時重新出題）
 * - locked：答對後鎖住，避免重複點擊
 * - isCurrent(r)：非同步流程中檢查是否仍在同一題、元件仍存在
 */
export function useRound() {
  const [round, setRound] = useState(0);
  const [locked, setLocked] = useState(false);
  const roundRef = useRef(0);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const next = useCallback(() => {
    if (!alive.current) return;
    roundRef.current += 1;
    setLocked(false);
    setRound(roundRef.current);
  }, []);

  const isCurrent = useCallback((r: number) => alive.current && roundRef.current === r, []);

  return { round, locked, setLocked, next, isCurrent };
}
