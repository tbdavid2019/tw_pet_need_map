# Changelog

## 2026-04-30

### Fixed
- 修正手機版 BottomSheet 內的資訊卡清單沒有顯示的問題。
- 修正手機版點擊收容所後，地圖可正確指向該收容所。
- 修正桌機版點擊動物 marker 後，地圖錯誤回到使用者當前位置而不是該動物座標。
- 修正篩選後分頁索引超界時，資訊卡可能空白的問題。

### Pitfalls encountered
- `closeInfoBlock` 原本是桌機側邊資訊欄的顯示狀態，但在手機版把 `InfoBlock` 包進 `react-spring-bottom-sheet` 後，這個狀態仍被沿用，導致內容雖然存在 DOM，卻被 `.infoBlockContainer.hide` 隱藏。
- BottomSheet 內原本的 `.cardsListContainer` 仍沿用桌機布局，容器高度被算成 `0px`，而 `.cardsList` 又是 `position: absolute`，最後造成卡片文字與圖片載入成功但畫面仍然是白板。
- 先前寫的 SCSS nested override 沒有正確覆蓋到 BottomSheet 內的 `.cardsListContainer` / `.cardsList`。最後改成明確展開的 selector 才真正進到 build 後的 CSS。
- 個別 marker 點擊邏輯錯把地圖中心設成「目前地圖中心」而不是「該動物座標」，所以桌機版會出現資訊窗內容正確，但地圖還停在內湖之類的錯誤位置。
- 群聚點擊與個別 marker 點擊是兩條不同的行為路徑：
  - 群聚點擊應只切換收容所篩選。
  - 個別 marker 點擊才應該切換 `selectMarker` 並將地圖中心移到動物位置。

### Deployment notes
- GitHub Pages 重新部署後，手機瀏覽器與 CDN 可能暫時保留舊 CSS。若正式站看起來仍是白畫面，先強制重新整理或稍等 1 到 2 分鐘再測。
