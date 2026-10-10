import { useCallback, useEffect, useSyncExternalStore } from 'react';
import { speech } from '../lib/speech';

/** 回傳 say(text)；元件卸載時自動停止語音，避免離開畫面後還在說話 */
export function useSpeech() {
  useEffect(() => () => speech.stop(), []);
  return useCallback((text: string) => speech.speak(text), []);
}

export function useSpeechState() {
  return useSyncExternalStore(speech.subscribe, speech.getSnapshot);
}
