## Why

根據 `mobile-skill.md` 的描述，目前的專案在手機版（Mobile）的 UI 與互動體驗設計上依賴純 RWD，導致手機畫面縮小時地圖可視範圍過小。同時，Google Maps 原生 InfoWindow 在手機版體驗生硬，重疊的案件無法點擊，再加上因 I/O 操作（console.log）和 CORS 等問題造成的卡頓及非預期錯誤，極需全面改版為更貼近原生應用（App-like）的抽屜互動模式（Bottom Sheet）。

## What Changes

- 全面導入 `react-spring-bottom-sheet` 以取代傳統 RWD 在手機版的資訊清單呈現，採用滿版地圖加上層疊抽屜。
- 將手機版的斷點 (Breakpoint) 判斷由 428px 放寬至 768px，確保平板以下裝置皆享有手機版體驗。
- 修改資料解析邏輯，針對經緯度重疊（如相同路口的案件）加上微小隨機偏移 (Jitter/Scatter)，讓地理標籤可分離點擊。
- 攔截手機版的地圖點擊行為：點擊地圖圖針時不開啟預設 InfoWindow，而是更新狀態由 Bottom Sheet 從下方彈出案件詳細資訊。
- 清洗資料（針對不含「區」字的行政區進行補齊）。
- 調整 CSS 的 `z-index` 以確保 `[data-rsbs-root]` 永遠在高層以避開 Google Map 控制項遮擋。
- 移除會造成主執行緒卡頓效能的 `console.log`，並確認靜態 JSON 資料的請求方式以規避 CORS 問題。

## Capabilities

### New Capabilities
- `mobile-bottom-sheet`: 負責在手機裝置上呈現可滑動、有層級的底部抽屜介面，取代原本的側邊或下方資訊欄。
- `map-marker-scatter`: 針對重疊座標進行擴展微調分佈機制。
- `mobile-map-interaction`: 專門處理手機版地圖互動機制（取消 InfoWindow 改觸發抽屜）。

### Modified Capabilities
- `responsive-layout`: 更新斷點標準及版面動態掛載邏輯（由 428px 調整為 768px）。
- `data-parsing`: 將 console.log 移除並對 `district` 資料進行標準化與補齊。

## Impact

- `src/component/PetAdoptionApp.js` 或相關狀態管理元件（新增狀態控制 bottom sheet 與選取的 marker）。
- `src/component/Map.js` (或是處理 `<Marker>` 事件的元件，攔截點擊事件與 Jitter 邏輯)。
- `src/lib/dataParsers.js` (加入微小亂數及區域名稱清洗，並移除任何 `console.log`)。
- 手機版樣式檔（確保 CSS z-index 控制與 root index 權限）。
- `package.json`（需要確保安裝 `react-spring-bottom-sheet`）。
