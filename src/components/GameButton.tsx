import { motion, type HTMLMotionProps } from 'motion/react';
import { forwardRef } from 'react';
import { audio, type Sfx } from '../lib/audio';

interface Props extends HTMLMotionProps<'button'> {
  /** 點擊音效，null = 不播放 */
  sound?: Sfx | null;
}

/** 所有可點擊元素的基礎：點擊縮放、輕微彈跳、柔和陰影 */
export const GameButton = forwardRef<HTMLButtonElement, Props>(function GameButton(
  { sound = 'tap', onClick, className = '', children, disabled, style, ...rest },
  ref,
) {
  return (
    <motion.button
      ref={ref}
      type="button"
      disabled={disabled}
      whileTap={disabled ? undefined : { scale: 0.9 }}
      whileHover={disabled ? undefined : { scale: 1.04, y: -2 }}
      transition={{ type: 'spring', stiffness: 500, damping: 18 }}
      className={`relative flex items-center justify-center outline-none focus-visible:ring-4 focus-visible:ring-sky-400 ${className}`}
      style={style}
      onClick={(e) => {
        if (sound) audio.play(sound);
        onClick?.(e);
      }}
      {...rest}
    >
      {children}
    </motion.button>
  );
});

/** 圓形工具按鈕（首頁、返回、重播、音效） */
export const ROUND_BTN =
  'size-20 shrink-0 rounded-full bg-white border-4 border-white shadow-[0_6px_0_rgba(74,59,63,0.18)]';

/** 大卡片按鈕的共用樣式 */
export const CARD_BTN =
  'rounded-[2rem] bg-white border-[5px] border-white shadow-[0_10px_0_rgba(74,59,63,0.15)]';
