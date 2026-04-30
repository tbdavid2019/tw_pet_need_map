# 道路施工地圖 - 手機版改版與開發避坑指南

本文件記錄了將「道路施工地圖」從傳統 RWD (Responsive Web Design) 轉換為 App-like 體驗（導入 Bottom Sheet）的決策過程、踩到的坑，以及對應的解決技巧。

## 1. 架構與 UX 設計思維：超越純 RWD
### ⚠️ 遇到的問題
原本專案依賴純 CSS 的 RWD，當螢幕縮小時將「列表 (InfoBlock)」與「選單 (Selectors)」擠到畫面下方或上方。但在地圖應用（如 Google Maps）中，這種做法會讓可視地圖區域變得極小，使用者難以拖曳和縮放。

### 💡 開發技巧與解法
- **全螢幕地圖 + 抽屜互動**：在手機版（`isMobile`）強制讓地圖滿版 (Edge-to-Edge)，並導入原生 App 常見的 Bottom Sheet。
- **採用 `react-spring-bottom-sheet`**：這是一個基於物理彈簧動畫的 Library，具有良好的滑動手感與多個 snap points (peek, half, full)。
- **斷點 (Breakpoint) 調整**：原先設定 `428px` 過於嚴格，許多 Android 手機解析度早已超越此數值。將判定標準放寬至 `768px`（Tablet 以下皆套用手機 UX）是較為穩健的做法。

## 2. 地圖互動 (Map Interactions) 踩坑
### ⚠️ 遇到的問題
1. **Marker 重疊無法點擊 (Jitter Issue)**：施工案件往往給定一段路的「中心點」或是「路口起點」，導致數十個案件座標「完全相同」。即使搭配 MarkerClusterer 並放大到極限 (Max Zoom)，點擊叢集依然無法展開/分離單一案件。
2. **InfoWindow 在手機上的體驗極差**：Google Maps 原生的 InfoWindow 會強制平移地圖、版面生硬且難以在手機上客製化。

### 💡 開發技巧與解法
- **賦予微小隨機偏移 (Jitter / Scatter)**：在 `dataParsers.js` 處理座標時，如果發現是密集/重複的經緯度，加上微小的亂數偏移：
  ```javascript
  const lat = baseLat + (Math.random() - 0.5) * 0.00015;
  const lng = baseLng + (Math.random() - 0.5) * 0.00015;
  ```
  這樣在叢集展開後，案件就能在畫面上散開，個別支援精準點擊。
- **攔截 Marker 點擊事件 (Bypass InfoWindow)**：在 `<Marker onClick={...}>` 中，如果偵測到是 Mobile 環境，**不開啟**對應的 InfoWindow。改為去更新全域的 Select 狀態（`setMapParameters({ selectMarker: data })`），然後由底部的 Bottom Sheet 監聽此狀態，立刻彈出對應的 `Card` 詳情。

## 3. 資料獲取與效能 (API / Performance)
### ⚠️ 遇到的問題
1. **CORS 阻斷與不穩定的 API**：原先嘗試直接 fetch 第三方 Azure Blob (如台北市資料)，遇到無 CORS Header 的問題，導致前端直接報錯 `Failed to fetch`。
2. **巨量 Render 加上 Console.log 導致畫面卡死**：迴圈解析數千筆資料時，不經意留下的 `console.log` 會嚴重阻塞 Main Thread，在硬體較差的 Android 手機上甚至會引發 Browser Crashing 或出現詭異的 `MAX_WRITE_OPERATIONS`。
3. **區域字串不一致**：有時候來源寫「中山」，有時候寫「中山區」，導致 Filter 篩選邏輯抓不到東西。

### 💡 開發技巧與解法
- **Local Fallback + GitHub Action 自動化**：遇到無法透過前端繞過的跨域問題時，最穩定的解法是「改做靜態檔」。建立了一隻 Node script (`scripts/update-taipei-json.js`) 加上 GitHub Action 每天排程 (Cron) 去抓取並 commit 回 repo 的 `public/` 資料夾中。前端一律向同源 (Same-origin) 取資料，徹底擺脫 CORS。
- **拔除所有效能毒藥 (Console.log)**：在 `parseData` 這類會被觸發數千次的函數中，絕對不能放任何 I/O 印出。效能問題常常不是 React render 慢，而是 Console 塞爆。
- **強健的正規化 (Normalization)**：在 Parser 裡做好髒資料清洗。例如如果 `district` 沒有「區」字，主動幫它補上：
  ```javascript
  const district = rawDistrict.includes('區') ? rawDistrict : `${rawDistrict}區`;
  ```

## 4. CSS 與元件層級 (Z-Index Hell)
### ⚠️ 遇到的問題
掛載 Bottom Sheet 後，發現抽屜會被地圖元件或是篩選器的浮動元件蓋在底下，呈現破圖或「無法滑動」的狀況。

### 💡 開發技巧與解法
- **重置 Root Z-Index**：Google Maps 的部分控制項層級很高，要確保 Bottom Sheet 的 Root wrapper 具有制空權。
  ```scss
  [data-rsbs-root] {
    z-index: 9999 !important; /* 確保在最上層 */
  }
  ```
- **InfoBlock 與 Card 的無縫切換**：在手機版抽屜裡，不需要給 List 額外的 `box-shadow` 與 `absolute` position。透過 CSS overwrite (`isInBottomSheet` props 或是 media query)，將元件背景色轉為透明、取消浮動陰影，讓它們看起來像是「長」在抽屜裡面一樣原生。

##結語
現代 Mobile Web Maps 開發的核心原則是：**「把地圖當作畫布，把 UI 當作抽屜」**。
透過減少 RWD 的硬切換，擁抱原生 App 的互動模式（Bottom Sheet）、靜態化的資料流以規避 CORS，並仔細處理地圖專屬的問題（如座標重疊），就能用 Web 打造出媲美 Native App 的流暢體驗。