# 動物數字樂園（Animal Learning Adventure）

給 3 歲幼兒的 HTML5 互動學習遊戲：認識數字、顏色、動物。繁體中文（台灣）語音引導，以觸控操作為主，支援 iPad／Android 平板／電腦／手機。

## 遊戲內容

| 遊戲 | 模式 |
| --- | --- |
| 🔢 數字樂園 | 認識數字、數數看、數字配對（可拖曳，也可點擊配對） |
| 🎨 顏色樂園 | 認識顏色、找顏色氣球、幫動物穿衣服 |
| 🐼 動物樂園 | 認識動物、聽聲音找動物、動物找家 |
| 🌟 小小挑戰 | 數量＋顏色＋動物綜合題 |

- 每完成 5 題得到一顆星星，每 5 顆星星出現慶祝畫面
- 沒有倒數、不扣分、可以無限重試
- 上方固定有：回首頁、重播語音、聲音開關
- **家長設定**：首頁左下角的小齒輪「按住 3 秒」開啟，可調整背景音樂／語音／音效、難度（初級／中級／進階）、查看學習進度、重置紀錄
- 進度只存在瀏覽器 LocalStorage，不需要登入、沒有廣告或追蹤

## 開發

```bash
npm install
npm run dev        # 開發伺服器
npm run build      # 型別檢查＋產生 dist/
npm run preview    # 預覽 build 結果
```

技術：React + TypeScript + Vite、Tailwind CSS、Motion（Framer Motion）、Web Speech API、Web Audio API。

所有角色與圖示都是程式內的 SVG，不使用 Emoji；音效與背景音樂由 Web Audio 即時合成；只有動物叫聲使用真實錄音。

## 專案結構

```
src/
├── components/   共用 UI：AnimalCharacter、GameButton、GameHeader、AudioButton、RewardAnimation…
├── games/        Numbers / Colors / Animals / Challenges，每個模式一個元件；registry.tsx 註冊
├── hooks/        useSpeech、useAudio、useGameProgress、useReplay、useLevel、useRound、useFeedback
├── data/         題目資料：animals、colors、numbers、difficulty、phrases
├── lib/          speech（語音引擎）、audio（音效合成）、storage、random、ui
└── App.tsx
```

- 新增模式：在 `src/games/<遊戲>/` 新增元件並匯出 `MODE_ID`，再到 `src/games/registry.tsx` 加一筆
- 新增動物：在 `src/data/animals.ts` 加資料，並在 `src/components/AnimalArt.tsx` 畫出造型
- 動物叫聲是真實錄音，放在 `public/sounds/`（來源與授權見 `public/sounds/CREDITS.md`）；在 `animals.ts` 用 `soundUrl` 指定，沒有或播放失敗時改用語音念出狀聲詞

## 語音

優先使用 zh-TW 語音（例如 macOS／iOS 的「美佳」），沒有則改用其他華語語音；裝置完全沒有中文語音或家長關閉語音時，畫面下方會以字幕顯示。第一次按下播放鍵時會解鎖瀏覽器音訊。

## 部署

`vite.config.ts` 設定 `base: './'`，`dist/` 可以直接放到任何靜態網站（GitHub Pages、Cloudflare Pages、Netlify、Vercel）。

已附 GitHub Actions：`.github/workflows/deploy.yml`，推到 `main` 後自動部署到 GitHub Pages。第一次使用請到 repo 的 **Settings → Pages → Source** 選 **GitHub Actions**。
