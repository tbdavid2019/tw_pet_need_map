## Context

目前應用使用傳統の RWD 控制，針對手機螢幕僅將左側清單移至下方，地圖顯示範圍因此被嚴重壓縮，不利於滑動和縮放的操作。此外，Google Maps 的原生 InfoWindow 會干擾手機用戶預期的系統級操作習慣，加之在同位置點有過多的資料（Maker Jitter 問題）無法順利展開。最後，大筆資料解析若夾帶 `console.log` 會顯著拖慢底層效能。這些問題在 `mobile-skill.md` 中有清楚指南，此專案目的在針對指南落實。

## Goals / Non-Goals

**Goals:**
- 將現有 UI 架構成過渡為「全螢幕地圖 + 抽屜（Bottom Sheet）」的原生互動形式。
- 優化地圖圖針的表現形式與點擊互動流程。
- 調節資料處理階段以去除效能死角兼維持資料一制性。

**Non-Goals:**
- 重構後端 API 或實做額外的 SSR（目前用前端搭配 GitHub Action 生成靜態檔案）。
- 更改整體地圖服務的 Provider（如由 Google Maps 換成 Mapbox 等），僅利用目前架構優化呈現。

## Decisions

**1. 引入 Bottom Sheet 套件**
- **Decision:** 採用 `react-spring-bottom-sheet`。
- **Rationale:** 基於物理彈簧動畫，比起自幹動畫或用簡單過渡，它提供了更貼近原生的滑動效能與多重 Snap points (peek, half, full)。
- **Alternative:** 使用普通的 CSS absolute / fixed 加上 transform；但此方式往往難以優雅處理複雜的拖拽手勢與 iOS/Android 不同的滾動事件。

**2. 延長響應式斷點至 768px**
- **Decision:** 判定 `isMobile` 的範圍將延伸到 768px（通常是 iPad Portrait 以下視為 Mobile UX）。
- **Rationale:** 之前設定 428px 太嚴格，許多 Android 手機解析度已超出，會錯誤顯示成桌面版導致 UI 版面跑位。放寬至 768px 提供統一且穩定的單欄平板/手機體驗。

**3. 資料解析時新增隨機位移 (Jit/Scatter)**
- **Decision:** 在 `dataParsers.js` 等地圖載入前資料處理處，若發現重複座標進行微量干擾座標 (`(Math.random() - 0.5) * 0.00015`)。
- **Rationale:** 使用者可視角擴展後能將多個重疊 marker 分離開來選取，對原本的叢集 (Clusterer) 並沒有副作用。

**4. 攔截點擊並改用狀態管理**
- **Decision:** 若為行動模式 (`isMobile`)，Marker 本身將不呼叫原生 `InfoWindow`，而是直接更新狀態（如 `setMapParameters({ selectMarker: data })`），此狀態變更後將會開啟下方的 Bottom Sheet。
- **Rationale:** 防止 Google Map 強制視圖位移及提供更好看的客製化版位。

## Risks / Trade-offs

- **Z-Index Hell** → Mitigation: `react-spring-bottom-sheet` 預設的層級若低於地圖，可能遭遮擋。將加上全域的 CSS 確保 `[data-rsbs-root]` 呈現於 `z-index: 9999 !important` 並且將原本手機版被加上 `box-shadow` 與 `absolute` 的內容去除浮動設計。
- `react-spring-bottom-sheet` 支援度 → Mitigation: 套件為 React 生態系中十分知名成熟，且能與 React Hooks / State 有良好綁定，風險極低。相較於自行重構拖拽，更能保障穩定度。
