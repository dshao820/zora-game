import { motion } from 'motion/react';
import { useState, type ReactNode } from 'react';
import { ANIMALS } from '../data/animals';
import { COLORS } from '../data/colors';
import { DIFFICULTIES, DIFFICULTY_ORDER } from '../data/difficulty';
import { useGameProgress } from '../hooks/useGameProgress';
import { useSpeechState } from '../hooks/useSpeech';
import { range } from '../lib/random';
import { speech } from '../lib/speech';
import type { Settings } from '../lib/storage';
import { AnimalCharacter } from './AnimalCharacter';
import { StarIcon } from './icons';

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3">
      <span className="text-lg font-bold">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={`relative h-9 w-16 rounded-full transition-colors ${value ? 'bg-emerald-400' : 'bg-slate-300'}`}
      >
        <span className={`absolute top-1 size-7 rounded-full bg-white shadow transition-all ${value ? 'left-8' : 'left-1'}`} />
      </button>
    </label>
  );
}

const SAMPLE = '你好！我們一起來數數看！一、二、三！答對了，你好棒！';

/** 語音選擇＋試聽：清單依自然度排序，第一個就是自動選擇會用的語音 */
function VoicePicker({ value, onChange }: { value: string | null; onChange: (uri: string | null) => void }) {
  useSpeechState(); // 語音清單載入後重新渲染
  const voices = speech.listVoices();
  if (!speech.supported || voices.length === 0) {
    return <p className="text-sm text-slate-500">語音：{speech.voiceInfo}</p>;
  }
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3">
      <span className="text-lg font-bold">語音</span>
      <select
        className="min-w-0 flex-1 rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-base"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value || null)}
      >
        <option value="">自動（目前：{speech.voiceInfo}）</option>
        {voices.map((v) => (
          <option key={v.voiceURI} value={v.voiceURI}>
            {v.name}（{v.lang}）{v.localService ? '' : '・線上'}
          </option>
        ))}
      </select>
      <button type="button" className="rounded-full bg-sky-100 px-5 py-2 font-bold text-sky-800" onClick={() => void speech.speak(SAMPLE)}>
        試聽
      </button>
      <p className="w-full text-sm text-slate-500">
        想要更自然的聲音：Mac／iPad 可到「設定 → 輔助使用 → 朗讀內容 → 語音」下載「美佳（高品質）」；Windows 建議用 Edge 瀏覽器（有自然語音）。標「線上」的語音需要網路。
      </p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xl font-black text-slate-600">{title}</h2>
      {children}
    </section>
  );
}

/** 家長設定頁：音樂、語音、難度、學習進度、重置 */
export function ParentSettings({ onClose }: { onClose: () => void }) {
  const { progress, settings, updateSettings, resetProgress } = useGameProgress();
  const [confirmReset, setConfirmReset] = useState(false);
  const set = (patch: Partial<Settings>) => updateSettings(patch);
  const learned = progress.learned;

  return (
    <motion.div
      className="absolute inset-0 z-40 flex items-center justify-center bg-slate-900/30 p-3 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="flex max-h-full w-full max-w-3xl flex-col overflow-hidden rounded-[2rem] bg-white text-[#4a3b3f] shadow-2xl"
        initial={{ y: 40, scale: 0.96 }}
        animate={{ y: 0, scale: 1 }}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h1 className="text-2xl font-black">家長設定</h1>
          <button type="button" onClick={onClose} className="rounded-full bg-sky-100 px-6 py-3 text-lg font-bold text-sky-800">
            完成
          </button>
        </div>

        <div className="flex flex-col gap-7 overflow-y-auto px-6 py-5" style={{ touchAction: 'pan-y' }}>
          <Section title="聲音">
            <div className="grid gap-2 sm:grid-cols-3">
              <Toggle label="背景音樂" value={settings.music} onChange={(v) => set({ music: v })} />
              <Toggle label="語音引導" value={settings.voice} onChange={(v) => set({ voice: v })} />
              <Toggle label="遊戲音效" value={settings.sfx} onChange={(v) => set({ sfx: v })} />
            </div>
            <VoicePicker value={settings.voiceURI} onChange={(uri) => set({ voiceURI: uri })} />
            {settings.muted && <p className="text-sm font-bold text-rose-500">目前畫面右上角的聲音開關是關閉的。</p>}
          </Section>

          <Section title="難度">
            <div className="grid grid-cols-3 gap-2">
              {DIFFICULTY_ORDER.map((d) => {
                const def = DIFFICULTIES[d];
                const active = settings.difficulty === d;
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => set({ difficulty: d })}
                    aria-pressed={active}
                    className={`rounded-2xl border-4 px-2 py-3 text-left transition-colors ${
                      active ? 'border-sky-400 bg-sky-50' : 'border-slate-100 bg-slate-50'
                    }`}
                  >
                    <div className="text-xl font-black">{def.label}</div>
                    <div className="text-sm text-slate-500">
                      數字 1～{def.numberMax}
                      <br />
                      {def.colorCount} 種顏色
                      <br />
                      {def.animalCount} 種動物
                    </div>
                  </button>
                );
              })}
            </div>
          </Section>

          <Section title="學習進度">
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-2xl bg-amber-50 px-4 py-2">
                <StarIcon size={32} />
                <span className="text-xl font-black">{progress.stars} 顆星星</span>
              </div>
              <div className="rounded-2xl bg-emerald-50 px-4 py-2 text-xl font-black">完成 {progress.totalTasks} 題</div>
            </div>

            <div>
              <div className="mb-1 font-bold">認識的數字（{learned.numbers.length}/10）</div>
              <div className="flex flex-wrap gap-1.5">
                {range(1, 10).map((n) => (
                  <span
                    key={n}
                    className={`flex size-10 items-center justify-center rounded-xl text-lg font-black ${
                      learned.numbers.includes(n) ? 'bg-amber-300' : 'bg-slate-100 text-slate-300'
                    }`}
                  >
                    {n}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-1 font-bold">認識的顏色（{learned.colors.length}/{COLORS.length}）</div>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((c) => {
                  const ok = learned.colors.includes(c.id);
                  return (
                    <span key={c.id} className={`flex items-center gap-1.5 rounded-full px-2 py-1 text-sm font-bold ${ok ? 'bg-slate-100' : 'opacity-35'}`}>
                      <span className="size-5 rounded-full border-2 border-[#4a3b3f]" style={{ background: c.hex }} />
                      {c.name}
                    </span>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="mb-1 font-bold">認識的動物（{learned.animals.length}/{ANIMALS.length}）</div>
              <div className="flex flex-wrap gap-1">
                {ANIMALS.map((a) => (
                  <div key={a.id} className={`flex flex-col items-center ${learned.animals.includes(a.id) ? '' : 'opacity-30 grayscale'}`}>
                    <AnimalCharacter species={a.id} size={52} anim="none" />
                    <span className="text-xs font-bold">{a.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          <Section title="重置">
            {confirmReset ? (
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-bold">確定要清除所有星星與學習紀錄嗎？</span>
                <button
                  type="button"
                  className="rounded-full bg-rose-500 px-5 py-2 font-bold text-white"
                  onClick={() => {
                    resetProgress();
                    setConfirmReset(false);
                  }}
                >
                  確定清除
                </button>
                <button type="button" className="rounded-full bg-slate-100 px-5 py-2 font-bold" onClick={() => setConfirmReset(false)}>
                  取消
                </button>
              </div>
            ) : (
              <button type="button" className="self-start rounded-full bg-rose-50 px-5 py-2 font-bold text-rose-600" onClick={() => setConfirmReset(true)}>
                重置遊戲紀錄
              </button>
            )}
            <p className="text-sm text-slate-500">所有資料只儲存在這台裝置的瀏覽器中，不會上傳，也沒有廣告或追蹤。</p>
          </Section>
        </div>
      </motion.div>
    </motion.div>
  );
}
