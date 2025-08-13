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
git clone https://github.com/tbdavid2019/tw_pet_adoption_map.git

# 進入目錄
cd tw_pet_adoption_map

# 安裝依賴
npm install

# 設定環境變數
cp example.env .env
# 編輯 .env 檔案，加入你的 Google Maps API Key

# 啟動開發伺服器
npm start
```
```
npm run build
```

## 環境設定 Environment Setup

創建 `.env` 檔案並設定以下變數：

```env
REACT_APP_GOOGLE_MAP_API_KEY=your_google_maps_api_key_here
```




## 授權聲明 License

本專案資料來源為政府開放資料，使用時請遵循政府資料開放授權條款。
The project uses government open data, please comply with the government open data license terms when using.

## 聯絡方式 Contact

如有任何問題或建議，歡迎聯絡：

- 開啟 [GitHub Issue](https://github.com/tbdavid2019/tw_pet_need_map/issues)

