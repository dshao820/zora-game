/**
 * 語音引擎：包裝 Web Speech API。
 * - 依自然度幫語音評分：zh-TW 優先，高品質／神經網路語音優先於系統標準語音
 * - 家長可在設定中手動指定語音
 * - 新語音會中斷舊語音，避免重疊
 * - 不支援或關閉語音時，改用字幕（caption）並以估計時間維持遊戲節奏
 */

export interface SpeechSnapshot {
  speaking: boolean;
  caption: string;
  /** true = 無法發聲，需要顯示字幕 */
  fallback: boolean;
  /** 語音清單更新時遞增，讓 UI 重新讀取 */
  voicesVersion: number;
}

/** 語速與音調：接近自然說話，只稍慢一點讓幼兒聽清楚 */
const RATE = 0.9;
const PITCH = 1.05;

const norm = (lang: string) => lang.replace('_', '-').toLowerCase();

const isChinese = (v: SpeechSynthesisVoice) => {
  const l = norm(v.lang);
  return l.startsWith('zh') || l.startsWith('cmn');
};

/**
 * 語音自然度評分（越高越好）：
 * - 語言：台灣華語 > 其他華語 > 粵語
 * - 品質：神經網路（Edge Natural）> Apple 高品質／進階 > Google 線上語音 > 系統標準
 */
export function scoreVoice(v: SpeechSynthesisVoice): number {
  const l = norm(v.lang);
  const name = v.name;
  let s = 0;
  if (l === 'zh-tw' || /taiwan|台灣|臺灣/i.test(name)) s += 100;
  else if (l.includes('hk') || /cantonese|粵/i.test(name)) s += 5;
  else s += 40;
  if (/natural|neural/i.test(name)) s += 40;
  else if (/premium|高品質|優質/i.test(name)) s += 35;
  else if (/enhanced|進階|增強/i.test(name)) s += 30;
  else if (/google/i.test(name)) s += 25;
  if (/compact|精簡/i.test(name)) s -= 10;
  // Apple 裝置上的台灣標準女聲，實測最適合本遊戲；趣味音色不適合教學
  if (/美佳|mei-?jia/i.test(name)) s += 5;
  if (/grandma|grandpa|rocko|bad news|bells|bubbles|jester|whisper|zarvox/i.test(name)) s -= 20;
  return s;
}

type Listener = () => void;

class SpeechEngine {
  readonly supported: boolean;
  private voice: SpeechSynthesisVoice | null = null;
  private preferredURI: string | null = null;
  /** 播放失敗過的語音（例如離線時的線上語音），之後跳過 */
  private badVoices = new Set<string>();
  private enabled = true;
  private token = 0;
  private finishCurrent: (() => void) | null = null;
  private captionTimer: number | undefined;
  private listeners = new Set<Listener>();
  private snapshot: SpeechSnapshot;

  constructor() {
    this.supported =
      typeof window !== 'undefined' &&
      'speechSynthesis' in window &&
      typeof window.SpeechSynthesisUtterance !== 'undefined';
    this.snapshot = { speaking: false, caption: '', fallback: !this.supported, voicesVersion: 0 };
    if (this.supported) {
      this.pickVoice();
      window.speechSynthesis.onvoiceschanged = () => this.pickVoice();
    }
  }

  /** 所有中文語音，依自然度排序 */
  listVoices(): SpeechSynthesisVoice[] {
    if (!this.supported) return [];
    return window.speechSynthesis
      .getVoices()
      .filter(isChinese)
      .sort((a, b) => scoreVoice(b) - scoreVoice(a));
  }

  private pickVoice() {
    if (!this.supported) return;
    const voices = this.listVoices().filter((v) => !this.badVoices.has(v.voiceURI));
    const preferred = this.preferredURI ? voices.find((v) => v.voiceURI === this.preferredURI) : undefined;
    this.voice = preferred ?? voices[0] ?? null;
    this.set({ voicesVersion: this.snapshot.voicesVersion + 1 });
  }

  /** 家長指定語音（null = 自動挑選最自然的） */
  setPreferredVoice(uri: string | null) {
    if (this.preferredURI === uri) return;
    this.preferredURI = uri;
    if (uri) this.badVoices.delete(uri);
    this.pickVoice();
  }

  get currentVoiceURI(): string | null {
    return this.voice?.voiceURI ?? null;
  }

  /** Chrome 的語音清單是非同步載入的，啟動時稍等一下 */
  waitForVoices(timeout = 1500): Promise<void> {
    if (!this.supported || this.voice) return Promise.resolve();
    const start = Date.now();
    return new Promise((resolve) => {
      const check = () => {
        this.pickVoice();
        if (this.voice || Date.now() - start > timeout) resolve();
        else setTimeout(check, 100);
      };
      check();
    });
  }

  get voiceInfo(): string {
    if (!this.supported) return '此瀏覽器不支援語音，將以字幕顯示';
    if (!this.voice) return '找不到中文語音，將以字幕輔助顯示';
    return `${this.voice.name}（${this.voice.lang}）`;
  }

  setEnabled(on: boolean) {
    if (this.enabled === on) return;
    this.enabled = on;
    if (!on) this.stop();
    this.set({});
  }

  /** iOS 需要在使用者觸控事件中先講一次話才會解鎖語音 */
  unlock() {
    if (!this.supported) return;
    const u = new SpeechSynthesisUtterance(' ');
    u.volume = 0;
    window.speechSynthesis.speak(u);
  }

  speak(text: string): Promise<void> {
    const id = ++this.token;
    this.interrupt();
    window.clearTimeout(this.captionTimer);
    this.set({ speaking: true, caption: text });

    return new Promise<void>((resolve) => {
      let done = false;
      let timer = 0;
      const finish = () => {
        if (done) return;
        done = true;
        if (this.finishCurrent === finish) this.finishCurrent = null;
        window.clearTimeout(timer);
        if (id === this.token) {
          this.set({ speaking: false });
          this.captionTimer = window.setTimeout(() => {
            if (id === this.token) this.set({ caption: '' });
          }, 1800);
        }
        resolve();
      };
      this.finishCurrent = finish;

      const estimate = 700 + [...text].length * 300;
      if (!this.supported || !this.enabled) {
        timer = window.setTimeout(finish, this.enabled ? estimate : Math.min(estimate, 1500));
        return;
      }

      const synth = window.speechSynthesis;
      const u = new SpeechSynthesisUtterance(text);
      u.lang = this.voice?.lang ?? 'zh-TW';
      if (this.voice) u.voice = this.voice;
      u.rate = RATE;
      u.pitch = PITCH;
      u.onend = finish;
      u.onerror = (e) => {
        // 線上語音在離線時會失敗：標記後改用下一個語音，下一句就會恢復
        if (this.voice && !this.voice.localService && e.error !== 'interrupted' && e.error !== 'canceled') {
          this.badVoices.add(this.voice.voiceURI);
          this.pickVoice();
        }
        finish();
      };
      // 保險：部分瀏覽器不會觸發 onend
      timer = window.setTimeout(finish, estimate * 2 + 3000);
      // cancel 之後立刻 speak 在 Safari/Chrome 偶爾會被吞掉，稍微延遲
      window.setTimeout(() => {
        if (id === this.token && !done) {
          synth.resume();
          synth.speak(u);
        }
      }, 40);
    });
  }

  stop() {
    this.token++;
    this.interrupt();
    window.clearTimeout(this.captionTimer);
    this.set({ speaking: false, caption: '' });
  }

  private interrupt() {
    const f = this.finishCurrent;
    this.finishCurrent = null;
    if (this.supported) window.speechSynthesis.cancel();
    f?.();
  }

  private set(patch: Partial<SpeechSnapshot>) {
    const fallback = !this.supported || !this.enabled || !this.voice;
    this.snapshot = { ...this.snapshot, ...patch, fallback };
    this.listeners.forEach((l) => l());
  }

  subscribe = (l: Listener) => {
    this.listeners.add(l);
    return () => {
      this.listeners.delete(l);
    };
  };

  getSnapshot = () => this.snapshot;
}

export const speech = new SpeechEngine();
