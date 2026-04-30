# 台灣寵物認養地圖 Taiwan Pet Adoption Map

� 即時顯示全台灣寵物收容所認養資訊的互動式地圖 | Real-time interactive map showing pet adoption information from shelters across Taiwan

## 專案說明 Project Description

本專案整合農業部動物保護資訊網的開放資料，提供一個直觀的地圖介面來瀏覽全台灣各收容所的待認養動物資訊。

This project integrates open data from the Ministry of Agriculture's Animal Protection Information Network, providing an intuitive map interface to browse adoptable animals from shelters across Taiwan.

## 資料來源 Data Source

- **API URL**: https://data.moa.gov.tw/Service/OpenData/TransService.aspx?UnitId=QcbUEzN6E6DL&IsTransData=1
- **資料提供**: 農業部動物保護資訊網
## 功能特色 Features

### 🗺️ 互動式地圖
- 使用 Google Maps 顯示收容所位置
- 支援標記叢集化，提升效能
- 點擊標記查看寵物詳細資訊
- 動態縮放和平移

### � 寵物資訊
- 即時更新的認養資訊
- 顯示動物照片、品種、性別、年齡
- 收容所聯絡資訊
- 結紮和疫苗狀態

### 🎯 智慧篩選
- 依動物種類篩選（狗、貓等）
- 依收容所篩選
- 依性別篩選
- 依年齡篩選

### 📱 響應式設計
- 支援桌面和行動裝置
- 優化的使用者介面
- 即時位置定位功能

## 技術架構 Tech Stack

- **前端框架**: React.js
- **地圖服務**: Google Maps API
- **樣式處理**: SCSS
- **資料格式**: JSON
- **打包工具**: Create React App

## 資料來源 Data Sources

### 全台灣 Taiwan-wide
- **資料源**: 農業部動物保護資訊網
- **API**: `https://data.moa.gov.tw/Service/OpenData/TransService.aspx?UnitId=QcbUEzN6E6DL&IsTransData=1`
- **格式**: JSON Array
- **更新頻率**: 即時

## 安裝使用 Installation

```bash
# 複製專案
git clone https://github.com/tbdavid2019/tw_pet_need_map.git

# 進入目錄
cd tw_pet_need_map

# 安裝依賴
npm install

# 設定環境變數
cp example.env .env
# 編輯 .env 檔案，加入你的 Google Maps API Key

# 啟動開發伺服器
npm start
```

```bash
npm run build
```

## 部署 Deployment

本專案使用 GitHub Pages 部署，`package.json` 已設定 `homepage` 與 deploy script。

```bash
npm run deploy
```

正式站網址：

- https://tbdavid2019.github.io/tw_pet_need_map/

## 環境設定 Environment Setup

創建 `.env` 檔案並設定以下變數：

```env
REACT_APP_GOOGLE_MAP_API_KEY=your_google_maps_api_key_here
```

## 最近修正與踩坑紀錄 Recent Fixes And Pitfalls

2026-04-30 這一輪修正主要集中在手機版 BottomSheet 與桌機版 marker/cluster 行為：

- 手機版資訊卡一度是白畫面，但根因不是資料或圖片沒載入，而是 BottomSheet 內沿用了桌機的 `closeInfoBlock` 狀態，導致內容被 `.infoBlockContainer.hide` 隱藏。
- 手機版卡片列表曾因 `.cardsListContainer` 高度被算成 `0px`、`.cardsList` 又維持 `position: absolute`，造成卡片與圖片都在 DOM 裡卻看不到。
- 桌機版個別 marker 點擊曾錯把地圖中心設為目前地圖中心，而不是動物座標，導致資訊正確但地圖位置錯誤。
- 群聚點擊與個別 marker 點擊現在分開處理：群聚只切收容所篩選，個別 marker 才會切詳細資訊與重新定位地圖。

若之後再調整手機版 BottomSheet，請優先檢查：

- `InfoBlock` 是否仍然套到桌機的 `hide/open/close` 狀態。
- BottomSheet 內 `.cardsListContainer` / `.cardsList` 的高度與定位是否仍沿用桌機版設定。
- build 後的 CSS 是否真的包含你預期的 selector，不要只看 SCSS 原始碼。

更完整的修正紀錄請見 [CHANGELOG.md](./CHANGELOG.md).




## 授權聲明 License

本專案資料來源為政府開放資料，使用時請遵循政府資料開放授權條款。
The project uses government open data, please comply with the government open data license terms when using.

## 聯絡方式 Contact

如有任何問題或建議，歡迎聯絡：

- 開啟 [GitHub Issue](https://github.com/tbdavid2019/tw_pet_need_map/issues)

