/**
 * 音效引擎：全部以 Web Audio API 即時合成，不需要下載音檔。
 * - 音效（sfx）與背景音樂（music）分開控制
 * - 語音播放時背景音樂自動降低音量（duck）
 * - 同一個音效短時間內不會重複觸發
 */

export type Sfx =
  | 'tap' | 'pop' | 'boing' | 'correct' | 'tryAgain' | 'sparkle'
  | 'cheer' | 'whoosh' | 'splash' | 'swish' | 'fanfare';

const midi = (m: number) => 440 * Math.pow(2, (m - 69) / 12);

// 柔和的五聲音階搖籃曲（C 大調），null = 休止
const MELODY: (number | null)[] = [
  72, null, 76, null, 79, null, 76, null, 74, null, 76, null, 72, null, null, null,
  76, null, 79, null, 81, null, 79, null, 76, null, 74, null, 72, null, null, null,
  79, null, 81, null, 79, null, 76, null, 74, null, 72, null, 74, null, null, null,
  76, null, 74, null, 72, null, 74, null, 76, null, 72, null, 72, null, null, null,
];
const BASS = [48, 53, 55, 48, 53, 48, 55, 48];
const STEP_SEC = 0.3;

class AudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private sfxBus: GainNode | null = null;
  private musicBus: GainNode | null = null;
  private muted = false;
  private sfxOn = true;
  private musicOn = true;
  private ducked = false;
  private musicTimer: number | undefined;
  private nextTime = 0;
  private step = 0;
  private lastPlayed = new Map<string, number>();
  private clip: { src: AudioBufferSourceNode; finish: (ok: boolean) => void } | null = null;
  private clipBuffers = new Map<string, Promise<AudioBuffer | null>>();

  /** 必須在使用者互動事件中呼叫一次（瀏覽器自動播放政策） */
  unlock() {
    if (!this.ctx) {
      const AC =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      const ctx = new AC();
      this.master = ctx.createGain();
      this.master.connect(ctx.destination);
      this.sfxBus = ctx.createGain();
      this.sfxBus.connect(this.master);
      this.musicBus = ctx.createGain();
      this.musicBus.connect(this.master);
      this.ctx = ctx;
      this.applyGains(true);
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) void ctx.suspend();
        else void ctx.resume();
      });
    }
    if (this.ctx.state !== 'running') void this.ctx.resume();
    this.syncMusic();
  }

  setMuted(v: boolean) {
    this.muted = v;
    if (v) this.stopClip();
    this.applyGains();
    this.syncMusic();
  }

  setSfx(v: boolean) {
    this.sfxOn = v;
    this.applyGains();
  }

  setMusic(v: boolean) {
    this.musicOn = v;
    this.applyGains();
    this.syncMusic();
  }

  duck(on: boolean) {
    if (this.ducked === on) return;
    this.ducked = on;
    this.applyGains();
  }

  private applyGains(instant = false) {
    const { ctx, master, sfxBus, musicBus } = this;
    if (!ctx || !master || !sfxBus || !musicBus) return;
    const t = ctx.currentTime;
    const tc = instant ? 0.001 : 0.12;
    master.gain.setTargetAtTime(this.muted ? 0 : 1, t, tc);
    sfxBus.gain.setTargetAtTime(this.sfxOn ? 0.9 : 0, t, tc);
    musicBus.gain.setTargetAtTime(this.musicOn ? (this.ducked || this.clip ? 0.15 : 0.55) : 0, t, tc);
  }

  // ---------- 背景音樂 ----------

  private syncMusic() {
    const shouldPlay = !!this.ctx && this.musicOn && !this.muted;
    if (shouldPlay && this.musicTimer === undefined) {
      this.nextTime = this.ctx!.currentTime + 0.1;
      this.musicTimer = window.setInterval(() => this.schedule(), 60);
    } else if (!shouldPlay && this.musicTimer !== undefined) {
      window.clearInterval(this.musicTimer);
      this.musicTimer = undefined;
    }
  }

  private schedule() {
    const ctx = this.ctx;
    if (!ctx || !this.musicBus || ctx.state !== 'running') return;
    if (this.nextTime < ctx.currentTime - 0.5) this.nextTime = ctx.currentTime + 0.05;
    while (this.nextTime < ctx.currentTime + 0.25) {
      const t = this.nextTime;
      const m = MELODY[this.step];
      if (m !== null) this.note(midi(m), t, 0.6, 'triangle', 0.07, this.musicBus);
      if (this.step % 8 === 0) this.note(midi(BASS[(this.step / 8) % BASS.length]), t, 1.4, 'sine', 0.09, this.musicBus);
      if (this.step % 8 === 4) this.note(midi(BASS[Math.floor(this.step / 8) % BASS.length] + 7), t, 1, 'sine', 0.05, this.musicBus);
      this.nextTime += STEP_SEC;
      this.step = (this.step + 1) % MELODY.length;
    }
  }

  // ---------- 合成器 ----------

  private note(freq: number, t: number, dur: number, type: OscillatorType, gain: number, dest: AudioNode, slideTo?: number) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(dest);
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  private noise(t: number, dur: number, from: number, to: number, gain: number) {
    const ctx = this.ctx!;
    const len = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const f = ctx.createBiquadFilter();
    f.type = 'bandpass';
    f.Q.value = 1.2;
    f.frequency.setValueAtTime(from, t);
    f.frequency.exponentialRampToValueAtTime(to, t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + dur * 0.3);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f).connect(g).connect(this.sfxBus!);
    src.start(t);
    src.stop(t + dur + 0.05);
  }

  play(name: Sfx) {
    const ctx = this.ctx;
    const d = this.sfxBus;
    if (!ctx || !d || this.muted || !this.sfxOn) return;
    const now = performance.now();
    if (now - (this.lastPlayed.get(name) ?? 0) < 90) return;
    this.lastPlayed.set(name, now);
    const t = ctx.currentTime + 0.01;
    const arp = (notes: number[], gap: number, dur: number, gain: number, type: OscillatorType = 'triangle', start = t) =>
      notes.forEach((m, i) => this.note(midi(m), start + i * gap, dur, type, gain, d));

    switch (name) {
      case 'tap':
        this.note(700, t, 0.09, 'triangle', 0.16, d, 1000);
        break;
      case 'pop':
        this.note(420, t, 0.13, 'sine', 0.3, d, 950);
        break;
      case 'boing':
        this.note(260, t, 0.28, 'sine', 0.28, d, 640);
        this.note(520, t + 0.05, 0.2, 'triangle', 0.07, d, 800);
        break;
      case 'correct':
        arp([72, 76, 79, 84], 0.09, 0.32, 0.2);
        break;
      case 'tryAgain':
        this.note(midi(67), t, 0.22, 'sine', 0.16, d);
        this.note(midi(64), t + 0.2, 0.32, 'sine', 0.14, d);
        break;
      case 'sparkle':
        arp([88, 91, 96, 100], 0.06, 0.28, 0.1, 'sine');
        break;
      case 'cheer':
        arp([72, 76, 79, 84, 88], 0.08, 0.35, 0.18);
        arp([96, 100, 103], 0.07, 0.3, 0.08, 'sine', t + 0.45);
        break;
      case 'fanfare':
        arp([67, 72, 72, 76, 79, 84], 0.13, 0.4, 0.2);
        arp([60, 64, 67, 72], 0.2, 0.6, 0.1, 'sine');
        arp([96, 100, 103, 108], 0.08, 0.3, 0.07, 'sine', t + 0.85);
        break;
      case 'whoosh':
        this.noise(t, 0.7, 300, 2400, 0.25);
        break;
      case 'splash':
        this.noise(t, 0.5, 1800, 300, 0.3);
        arp([84, 88, 91], 0.07, 0.15, 0.06, 'sine', t + 0.2);
        break;
      case 'swish':
        this.noise(t, 0.28, 800, 3200, 0.16);
        break;
    }
  }

  /** 先下載並解碼音檔，第一次播放就不會延遲（需先 unlock） */
  preload(urls: readonly string[]) {
    for (const url of urls) void this.loadClip(url);
  }

  private loadClip(url: string): Promise<AudioBuffer | null> {
    const ctx = this.ctx;
    if (!ctx) return Promise.resolve(null);
    let p = this.clipBuffers.get(url);
    if (!p) {
      p = fetch(url)
        .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error(r.statusText))))
        .then((data) => ctx.decodeAudioData(data))
        .catch(() => {
          this.clipBuffers.delete(url); // 網路恢復後可再試
          return null;
        });
      this.clipBuffers.set(url, p);
    }
    return p;
  }

  /**
   * 播放真實音檔（動物叫聲）。走 Web Audio 而不是 <audio>，
   * iOS 上不需要每次都由點擊觸發；播放時背景音樂自動降低。
   * 失敗時回傳 false 讓呼叫端改用語音。
   */
  async playClip(url: string): Promise<boolean> {
    if (this.muted || !this.sfxOn) return false;
    this.stopClip();
    const buffer = await this.loadClip(url);
    const { ctx, sfxBus } = this;
    if (!buffer || !ctx || !sfxBus || this.muted || !this.sfxOn) return false;
    this.stopClip();
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.connect(sfxBus);
    return new Promise((resolve) => {
      const clip = {
        src,
        finish: (ok: boolean) => {
          if (this.clip === clip) {
            this.clip = null;
            this.applyGains();
          }
          resolve(ok);
        },
      };
      src.onended = () => clip.finish(true);
      this.clip = clip;
      this.applyGains();
      src.start();
    });
  }

  private stopClip() {
    const c = this.clip;
    if (!c) return;
    c.src.onended = null;
    try {
      c.src.stop();
    } catch {
      // 尚未開始播放
    }
    c.finish(true);
  }
}

export const audio = new AudioEngine();
