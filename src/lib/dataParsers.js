import { petKeyMap, taichungKeyMap, taipeiKeyMap, kaohsiungKeyMap } from '../constants/keyMaps';
import { convertTWD97ToWGS84 } from './coordinateConverter';

// --- Data Parsers for each city ---

// 建立一個全域的收容所座標快取，確保同一收容所的寵物在相同位置
const shelterCoordinateCache = new Map();

// 非同步 Geocoding 函數，用於後台更新座標
const geocodeAddressAsync = async (address, shelterName, cacheKey) => {
  console.log('🌐 背景 Geocoding:', address, shelterName);
  
  try {
    const apiKey = process.env.REACT_APP_GOOGLE_MAP_API_KEY;
    if (!apiKey) return;
    
    const searchAddress = address || shelterName;
    const encodedAddress = encodeURIComponent(searchAddress);
    const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}&region=tw`;
    
    console.log('📡 背景 Geocoding 請求:', searchAddress);
    const response = await fetch(geocodingUrl);
    if (!response.ok) {
      console.log('❌ Geocoding HTTP 錯誤:', response.status);
      return;
    }
    
    const geocodeData = await response.json();
    console.log('📡 Geocoding 回應:', geocodeData.status, geocodeData.results?.length || 0, 'results');
    
    if (geocodeData.status === 'OK' && geocodeData.results && geocodeData.results.length > 0) {
      const location = geocodeData.results[0].geometry.location;
      const coordinate = { lat: location.lat, lng: location.lng };
      
      // 更新快取
      shelterCoordinateCache.set(cacheKey, coordinate);
      console.log('✅ 背景 Geocoding 完成:', searchAddress, coordinate);
    } else {
      console.log('❌ 背景 Geocoding 失敗:', geocodeData.status, searchAddress);
      if (geocodeData.error_message) {
        console.log('   錯誤訊息:', geocodeData.error_message);
      }
    }
  } catch (error) {
    console.error('❌ 背景 Geocoding 錯誤:', error);
  }
};

export const parsePetData = (data) => {
  console.log('🐾 解析寵物資料:', data);
  
  // 獲取座標的主函數
  const getCoordinateFromAddress = (address, shelterName) => {
    const cacheKey = `${shelterName}-${address}`;
    
    // 檢查快取
    if (shelterCoordinateCache.has(cacheKey)) {
      console.log('📍 使用快取座標:', cacheKey, shelterCoordinateCache.get(cacheKey));
      return shelterCoordinateCache.get(cacheKey);
    }
    
    console.log('�️ 處理地址:', address, '收容所:', shelterName);
    
    // 建立收容所座標對應表（備用方案）
    const shelterCoordinates = {
      // 台北市
      '臺北市動物之家': { lat: 25.0330, lng: 121.5654 },
      '台北市動物之家': { lat: 25.0330, lng: 121.5654 },
      
      // 新北市
      '新北市政府動物保護防疫處': { lat: 25.0178, lng: 121.4666 },
      '新北市板橋區公立動物之家': { lat: 25.0178, lng: 121.4666 },
      '新北市中和區公立動物之家': { lat: 24.9977, lng: 121.4993 },
      '新北市三重區公立動物之家': { lat: 25.0624, lng: 121.4991 },
      '新北市新店區公立動物之家': { lat: 24.9777, lng: 121.5370 },
      '新北市淡水區公立動物之家': { lat: 25.1677, lng: 121.4432 },
      '新北市五股區公立動物之家': { lat: 25.0837, lng: 121.4439 },
      '新北市八里區公立動物之家': { lat: 25.1454, lng: 121.3951 },
      '新北市瑞芳區公立動物之家': { lat: 25.1067, lng: 121.8055 },
      '新北市三芝區公立動物之家': { lat: 25.2518, lng: 121.4996 },
      
      // 桃園市
      '桃園市動物保護教育園區': { lat: 24.9936, lng: 121.3010 },
      
      // 台中市
      '台中市動物之家南屯園區': { lat: 24.1396, lng: 120.6194 },
      '台中市動物之家后里園區': { lat: 24.3073, lng: 120.7097 },
      
      // 台南市
      '台南市動物之家灣裡站': { lat: 22.9747, lng: 120.1956 },
      '台南市動物之家善化站': { lat: 23.1319, lng: 120.2969 },
      
      // 高雄市
      '高雄市壽山動物保護教育園區': { lat: 22.6364639, lng: 120.2748072 },
      '高雄市燕巢動物保護關愛園區': { lat: 22.7886, lng: 120.3668 },
      
      // 其他縣市
      '基隆市寵物銀行': { lat: 25.1276, lng: 121.7392 },
      '宜蘭縣流浪動物中途之家': { lat: 24.7571, lng: 121.7490 },
      '花蓮縣流浪犬中途之家': { lat: 23.9917, lng: 121.6015 },
      '台東縣動物收容中心': { lat: 22.7972, lng: 121.1443 },
      '澎湖縣流浪動物收容中心': { lat: 23.5679, lng: 119.5794 },
      '金門縣動物收容中心': { lat: 24.4492, lng: 118.3765 },
      '連江縣動物收容所': { lat: 26.1605, lng: 119.9297 },
    };
    
    let coordinate;
    
    // 首先嘗試直接匹配收容所名稱
    if (shelterCoordinates[shelterName]) {
      console.log('✅ 找到精確收容所座標:', shelterName, shelterCoordinates[shelterName]);
      coordinate = shelterCoordinates[shelterName];
    } 
    // 根據地址關鍵字分析
    else if (address.includes('新北市')) {
      if (address.includes('三芝')) coordinate = { lat: 25.2518, lng: 121.4996 };
      else if (address.includes('板橋')) coordinate = { lat: 25.0178, lng: 121.4666 };
      else if (address.includes('中和')) coordinate = { lat: 24.9977, lng: 121.4993 };
      else if (address.includes('三重')) coordinate = { lat: 25.0624, lng: 121.4991 };
      else if (address.includes('新店')) coordinate = { lat: 24.9777, lng: 121.5370 };
      else if (address.includes('淡水')) coordinate = { lat: 25.1677, lng: 121.4432 };
      else if (address.includes('五股')) coordinate = { lat: 25.0837, lng: 121.4439 };
      else if (address.includes('八里')) coordinate = { lat: 25.1454, lng: 121.3951 };
      else if (address.includes('瑞芳')) coordinate = { lat: 25.1067, lng: 121.8055 };
      else coordinate = { lat: 25.0178, lng: 121.4666 };
    } else if (address.includes('臺北市') || address.includes('台北市')) {
      coordinate = { lat: 25.0330, lng: 121.5654 };
    } else if (address.includes('桃園')) {
      coordinate = { lat: 24.9936, lng: 121.3010 };
    } else if (address.includes('台中')) {
      coordinate = { lat: 24.1477, lng: 120.6736 };
    } else if (address.includes('台南')) {
      coordinate = { lat: 22.9978, lng: 120.2137 };
    } else if (address.includes('高雄')) {
      coordinate = { lat: 22.6273, lng: 120.3014 };
    } else if (address.includes('基隆')) {
      coordinate = { lat: 25.1276, lng: 121.7392 };
    } else if (address.includes('宜蘭')) {
      coordinate = { lat: 24.7571, lng: 121.7490 };
    } else if (address.includes('花蓮')) {
      coordinate = { lat: 23.9917, lng: 121.6015 };
    } else if (address.includes('台東')) {
      coordinate = { lat: 22.7972, lng: 121.1443 };
    } else if (address.includes('澎湖')) {
      coordinate = { lat: 23.5679, lng: 119.5794 };
    } else if (address.includes('金門')) {
      coordinate = { lat: 24.4492, lng: 118.3765 };
    } else if (address.includes('馬祖') || address.includes('連江')) {
      coordinate = { lat: 26.1605, lng: 119.9297 };
    } else {
      console.log('⚠️ 無法識別地址，使用預設座標:', address);
      coordinate = { lat: 23.8, lng: 120.9 };
      
      // 如果使用預設座標且有 API Key，嘗試背景 geocoding
      if (process.env.REACT_APP_GOOGLE_MAP_API_KEY && (address || shelterName)) {
        geocodeAddressAsync(address, shelterName, cacheKey);
      }
    }
    
    // 儲存到快取
    shelterCoordinateCache.set(cacheKey, coordinate);
    return coordinate;
  };

  const coordinate = getCoordinateFromAddress(data[petKeyMap.shelterAddress] || '', data[petKeyMap.shelterName] || '');

  const result = {
    city: '全台灣',
    id: data[petKeyMap.id],
    subid: data[petKeyMap.subid],
    title: `${data[petKeyMap.kind] || '動物'} - ${data[petKeyMap.variety]?.trim() || '混種'}`,
    animalKind: data[petKeyMap.kind] || '未知',
    variety: data[petKeyMap.variety]?.trim() || '混種',
    sex: data[petKeyMap.sex] === 'M' ? '公' : data[petKeyMap.sex] === 'F' ? '母' : '未知',
    bodytype: data[petKeyMap.bodytype] || '未知',
    colour: data[petKeyMap.colour] || '未知',
    age: data[petKeyMap.age] || '未知',
    sterilization: data[petKeyMap.sterilization] === 'T' ? '已結紮' : '未結紮',
    bacterin: data[petKeyMap.bacterin] === 'T' ? '已施打疫苗' : '未施打疫苗',
    foundplace: data[petKeyMap.foundplace] || '未知',
    status: data[petKeyMap.status] || 'OPEN',
    opendate: data[petKeyMap.opendate] || '',
    closeddate: data[petKeyMap.closeddate] || '',
    shelterName: data[petKeyMap.shelterName] || '未知收容所',
    shelterAddress: data[petKeyMap.shelterAddress] || '未知地址',
    shelterTel: data[petKeyMap.shelterTel] || '未提供',
    albumFile: data[petKeyMap.albumFile] || '',
    remark: data[petKeyMap.remark] || '',
    caption: data[petKeyMap.caption] || '',
    coordinate: {
      lat: coordinate.lat,
      lng: coordinate.lng,
      polygon: null,
    },
    // 為了相容現有的過濾系統，保留一些舊的欄位
    distriction: data[petKeyMap.shelterName] || '未知收容所',
    address: data[petKeyMap.shelterAddress] || '未知地址',
    workingState: data[petKeyMap.status] === 'OPEN' ? '開放認養' : '已認養',
    date: {
      start: { year: 2025, month: 1, day: 1 },
      end: { year: 2025, month: 12, day: 31 },
    },
  };
  
  console.log('🐾 寵物資料解析結果:', result);
  return result;
};

export const parseTaichungData = (data) => {
  console.log('🏙️ 台中市解析單個項目:', data);
  
  const splitPolygonData = (polygon) => {
    if (!polygon) return null;
    const POLYGON_PATTERN = /^POLYGON\(\(.*\)\)$/;
    if (!POLYGON_PATTERN.test(polygon.replace(/\s/g, ''))) return null;
    const POLYGON_PREFIX = "POLYGON((";
    const POLYGON_SUFFIX = "))";
    const COMMA = ",";
    try {
      return polygon
        .replace(/\s/g, '')
        .split(POLYGON_PREFIX)[1]
        .split(POLYGON_SUFFIX)[0]
        .split(COMMA)
        .map((coordinate) => {
          const TAICHUNG_LATITUDE = "24.";
          const [lngString, wrongLatString] = coordinate.split(TAICHUNG_LATITUDE);
          const latString = TAICHUNG_LATITUDE + wrongLatString;
          return { lat: Number(latString), lng: Number(lngString) };
        });
    } catch (error) {
      console.log('❌ 台中市多邊形解析錯誤:', error);
      return null;
    }
  };

  const parseDate = (dateStr) => {
    console.log('📅 台中市解析日期:', dateStr);
    if (!dateStr) return { year: 2025, month: 7, day: 2 };
    
    // 新格式：7位數字 "1140508" (114年05月08日)
    if (dateStr.length === 7) {
      const year = Number(dateStr.substring(0, 3)) + 1911;
      const month = Number(dateStr.substring(3, 5));
      const day = Number(dateStr.substring(5));
      return { year, month, day };
    } else {
      // 預設值
      return { year: 2025, month: 7, day: 2 };
    }
  };

  // 座標處理：台中市使用 WGS84 座標，無需轉換
  const lngStr = data[taichungKeyMap.lng];
  const latStr = data[taichungKeyMap.lat];
  const lng = Number(lngStr);
  const lat = Number(latStr);
  console.log('🗺️ 台中市原始座標 (WGS84):', { lat, lng, lngStr, latStr });
  
  // 檢查座標是否為有效數字，對於空字串給預設座標
  if (!lngStr || !latStr || lngStr === "" || latStr === "" || !isFinite(lng) || !isFinite(lat)) {
    console.log('❌ 台中市座標資料為空，使用預設座標:', { lngStr, latStr });
    // 使用預設座標而不是跳過，確保資料能顯示
    const result = {
      city: '台中市',
      title: data[taichungKeyMap.projectName] || '道路工程',
      distriction: data[taichungKeyMap.district] || '未知區域',
      address: data[taichungKeyMap.location] || '未知地址',
      pipeType: data[taichungKeyMap.pipeType] || '道路施工',
      constructionType: data[taichungKeyMap.caseType] || '道路工程',
      workingState: data[taichungKeyMap.isStarted] || '未知',
      date: {
        start: parseDate(data[taichungKeyMap.startDate]),
        end: parseDate(data[taichungKeyMap.endDate]),
      },
      applicationNumber: data[taichungKeyMap.applicationId] || 'N/A',
      licenseNumber: data[taichungKeyMap.permitId] || 'N/A',
      applicant: data[taichungKeyMap.applicantUnit] || 'N/A',
      contractor: {
        name: data[taichungKeyMap.contractorName] || 'N/A',
        phone: data[taichungKeyMap.contractorPhone] || 'N/A',
      },
      personInCharge: {
        name: data[taichungKeyMap.contactName] ? data[taichungKeyMap.contactName].substring(0, 1) + "◯◯" : 'N/A',
        phone: data[taichungKeyMap.contactPhone] || 'N/A',
      },
      coordinate: {
        lat: 24.163 + (Math.random() - 0.5) * 0.1, // 加入隨機偏移避免重疊
        lng: 120.673 + (Math.random() - 0.5) * 0.1,
        polygon: splitPolygonData(data[taichungKeyMap.geometry]),
      },
    };
    console.log('🔧 台中市使用預設座標的解析結果:', result);
    return result;
  }

  // 檢查座標是否在合理範圍內，如果不是就使用預設座標
  if (lng < 120 || lng > 122 || lat < 23 || lat > 25) {
    console.log('⚠️ 台中市座標超出範圍，使用預設座標:', { lng, lat });
    const result = {
      city: '台中市',
      title: data[taichungKeyMap.projectName] || '道路工程',
      distriction: data[taichungKeyMap.district] || '未知區域',
      address: data[taichungKeyMap.location] || '未知地址',
      pipeType: data[taichungKeyMap.pipeType] || '道路施工',
      constructionType: data[taichungKeyMap.caseType] || '道路工程',
      workingState: data[taichungKeyMap.isStarted] || '未知',
      date: {
        start: parseDate(data[taichungKeyMap.startDate]),
        end: parseDate(data[taichungKeyMap.endDate]),
      },
      applicationNumber: data[taichungKeyMap.applicationId] || 'N/A',
      licenseNumber: data[taichungKeyMap.permitId] || 'N/A',
      applicant: data[taichungKeyMap.applicantUnit] || 'N/A',
      contractor: {
        name: data[taichungKeyMap.contractorName] || 'N/A',
        phone: data[taichungKeyMap.contractorPhone] || 'N/A',
      },
      personInCharge: {
        name: data[taichungKeyMap.contactName] ? data[taichungKeyMap.contactName].substring(0, 1) + "◯◯" : 'N/A',
        phone: data[taichungKeyMap.contactPhone] || 'N/A',
      },
      coordinate: {
        lat: 24.163 + (Math.random() - 0.5) * 0.1, // 加入隨機偏移避免重疊
        lng: 120.673 + (Math.random() - 0.5) * 0.1,
        polygon: splitPolygonData(data[taichungKeyMap.geometry]),
      },
    };
    return result;
  }

  console.log('✅ 台中市有效座標 (WGS84):', { lat, lng });

  const result = {
    city: '台中市',
    title: data[taichungKeyMap.projectName] || '道路工程',
    distriction: data[taichungKeyMap.district] || '未知區域',
    address: data[taichungKeyMap.location] || '未知地址',
    pipeType: data[taichungKeyMap.pipeType] || '道路施工',
    constructionType: data[taichungKeyMap.caseType] || '道路工程',
    workingState: data[taichungKeyMap.isStarted] || '未知',
    date: {
      start: parseDate(data[taichungKeyMap.startDate]),
      end: parseDate(data[taichungKeyMap.endDate]),
    },
    applicationNumber: data[taichungKeyMap.applicationId] || 'N/A',
    licenseNumber: data[taichungKeyMap.permitId] || 'N/A',
    applicant: data[taichungKeyMap.applicantUnit] || 'N/A',
    contractor: {
      name: data[taichungKeyMap.contractorName] || 'N/A',
      phone: data[taichungKeyMap.contractorPhone] || 'N/A',
    },
    personInCharge: {
      name: data[taichungKeyMap.contactName] ? data[taichungKeyMap.contactName].substring(0, 1) + "◯◯" : 'N/A',
      phone: data[taichungKeyMap.contactPhone] || 'N/A',
    },
    coordinate: {
      lat,
      lng,
      polygon: splitPolygonData(data[taichungKeyMap.geometry]),
    },
  };
  
  console.log('✨ 台中市解析結果:', result);
  return result;
};

export const parseTaipeiData = (item) => {
  console.log('🏙️ 台北市解析單個項目:', item);
  
  const properties = item.properties;
  const geometry = item.geometry;

  console.log('📋 Properties:', properties);
  console.log('📍 Geometry:', geometry);

  const parseDate = (dateStr) => {
    console.log('📅 解析日期:', dateStr);
    if (!dateStr || dateStr.length !== 9) return { year: 2025, month: 7, day: 2 };
    const year = parseInt(dateStr.substring(0, 3), 10) + 1911;
    const month = parseInt(dateStr.substring(4, 6), 10);
    const day = parseInt(dateStr.substring(7, 9), 10);
    return { year, month, day };
  };

  const startDate = parseDate(properties[taipeiKeyMap.startDate]);
  const endDate = parseDate(properties[taipeiKeyMap.endDate]);

  // Convert TWD97 to WGS84
  const x = parseFloat(geometry.coordinates[0]);
  const y = parseFloat(geometry.coordinates[1]);
  console.log('🗺️ 原始坐標 (TWD97):', { x, y });
  
  const { lat, lng } = convertTWD97ToWGS84(x, y);
  console.log('🌍 轉換後坐標 (WGS84):', { lat, lng });

  const result = {
    city: '台北市',
    title: properties[taipeiKeyMap.projectName] || properties[taipeiKeyMap.projectPurpose] || '道路工程',
    distriction: properties[taipeiKeyMap.district] || '未知區域',
    address: properties[taipeiKeyMap.location] || '未知地址',
    pipeType: '道路施工',
    constructionType: properties[taipeiKeyMap.projectPurpose] || '道路工程',
    workingState: '是',
    date: {
      start: startDate,
      end: endDate,
    },
    applicationNumber: 'N/A',
    licenseNumber: 'N/A',
    applicant: properties[taipeiKeyMap.contractorName] || 'N/A',
    contractor: {
      name: properties[taipeiKeyMap.contractorCompany] || properties[taipeiKeyMap.contractorName] || 'N/A',
      phone: 'N/A',
    },
    personInCharge: {
      name: 'N/A',
      phone: 'N/A',
    },
    coordinate: {
      lat,
      lng,
      polygon: null,
    },
  };
  
  console.log('✨ 台北市解析結果:', result);
  return result;
};

export const parseKaohsiungData = (rawData) => {
  console.log('🏭 高雄市解析原始資料:', rawData);
  
  if (!rawData || !rawData.Data || !Array.isArray(rawData.Data)) {
    console.log('❌ 高雄市資料格式錯誤');
    return [];
  }

  console.log('📊 高雄市 Data 陣列長度:', rawData.Data.length);

  return rawData.Data.map((item, index) => {
    console.log(`🔄 處理高雄市第 ${index + 1} 筆資料:`, item);
    
    const parseDate = (dateStr) => {
      console.log('📅 高雄市解析日期:', dateStr);
      if (!dateStr) return { year: 2025, month: 7, day: 2 };
      const date = new Date(dateStr);
      return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
      };
    };

    const singleDate = parseDate(item[kaohsiungKeyMap.dateRange]);

    const result = {
      city: '高雄市',
      title: item[kaohsiungKeyMap.projectName] || '未知工程',
      distriction: 'N/A',
      address: item[kaohsiungKeyMap.projectName] || '未知地址',
      pipeType: '道路施工',
      constructionType: '道路工程',
      workingState: '是',
      date: {
        start: singleDate,
        end: singleDate,
      },
      applicationNumber: 'N/A',
      licenseNumber: item[kaohsiungKeyMap.permitId] || 'N/A',
      applicant: item[kaohsiungKeyMap.contractorName] || 'N/A',
      contractor: {
        name: item[kaohsiungKeyMap.contractorName] || 'N/A',
        phone: item[kaohsiungKeyMap.contractorPhone] || 'N/A',
      },
      personInCharge: {
        name: 'N/A',
        phone: 'N/A',
      },
      coordinate: {
        lat: Number(item[kaohsiungKeyMap.lat]) || 0,
        lng: Number(item[kaohsiungKeyMap.lng]) || 0,
        polygon: null,
      },
    };
    
    console.log(`✨ 高雄市第 ${index + 1} 筆解析結果:`, result);
    return result;
  });
};
