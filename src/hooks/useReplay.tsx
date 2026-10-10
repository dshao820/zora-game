import { createContext, useCallback, useContext, useEffect, useMemo, useRef, type ReactNode } from 'react';

interface ReplayContext {
  setReplay: (fn: (() => void) | null) => void;
  replay: () => void;
}

const Ctx = createContext<ReplayContext | null>(null);

/** 讓畫面上方的「重播」按鈕可以重念目前畫面的題目 */
export function ReplayProvider({ children }: { children: ReactNode }) {
  const fn = useRef<(() => void) | null>(null);
  const setReplay = useCallback((f: (() => void) | null) => {
    fn.current = f;
  }, []);
  const replay = useCallback(() => fn.current?.(), []);
  const value = useMemo(() => ({ setReplay, replay }), [setReplay, replay]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

function useReplayContext() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useReplay must be used inside <ReplayProvider>');
  return ctx;
}

/** 註冊目前畫面的重播動作 */
export function useReplay(fn: () => void) {
  const { setReplay } = useReplayContext();
  const latest = useRef(fn);
  latest.current = fn;
  useEffect(() => {
    setReplay(() => latest.current());
    return () => setReplay(null);
  }, [setReplay]);
}

export function useReplayTrigger() {
  return useReplayContext().replay;
}
