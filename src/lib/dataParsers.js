import { petKeyMap, taichungKeyMap, taipeiKeyMap, kaohsiungKeyMap } from '../constants/keyMaps';
import { convertTWD97ToWGS84 } from './coordinateConverter';

// --- Data Parsers for each city ---

// 建立一個全域的收容所座標快取，確保同一收容所的寵物在相同位置
const shelterCoordinateCache = new Map();

// 非同步 Geocoding 函數，用於後台更新座標
const geocodeAddressAsync = async (address, shelterName, cacheKey) => {
  
  try {
    const apiKey = process.env.REACT_APP_GOOGLE_MAP_API_KEY;
    if (!apiKey) return;
    
    const searchAddress = address || shelterName;
    const encodedAddress = encodeURIComponent(searchAddress);
    const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}&region=tw`;
    
    const response = await fetch(geocodingUrl);
    if (!response.ok) {
      return;
    }
    
    const geocodeData = await response.json();
    
    if (geocodeData.status === 'OK' && geocodeData.results && geocodeData.results.length > 0) {
      const location = geocodeData.results[0].geometry.location;
      const coordinate = { lat: location.lat, lng: location.lng };
      
      // 更新快取
      shelterCoordinateCache.set(cacheKey, coordinate);
    } else {
      if (geocodeData.error_message) {
      }
    }
  } catch (error) {
    console.error('❌ 背景 Geocoding 錯誤:', error);
  }
};

export const parsePetData = (data) => {
  
  // 獲取座標的主函數
  const getCoordinateFromAddress = (address, shelterName) => {
    const cacheKey = `${shelterName}-${address}`;
    
    // 檢查快取
    if (shelterCoordinateCache.has(cacheKey)) {
      return shelterCoordinateCache.get(cacheKey);
    }
    
    
    // 建立收容所座標對應表（所有收容所的正確GPS座標）
    const shelterCoordinates = {
      // 台北市
      '臺北市動物之家': { lat: 25.0604342, lng: 121.603348 }, // 臺北市內湖區安美街191號
      '台北市動物之家': { lat: 25.0604342, lng: 121.603348 }, // 臺北市內湖區安美街191號
      
      // 新北市
      '新北市政府動物保護防疫處': { lat: 25.0040555, lng: 121.4605077 }, // 新北市板橋區四川路一段157巷2號
      '新北市板橋區公立動物之家': { lat: 24.9954712, lng: 121.4480782 }, // 新北市板橋區板城路28-1號
      '新北市中和區公立動物之家': { lat: 24.9756181, lng: 121.4887501 }, // 新北市中和區興南路三段100號
      '新北市新店區公立動物之家': { lat: 24.9271173, lng: 121.4907877 }, // 新北市新店區安泰路235號
      '新北市淡水區公立動物之家': { lat: 25.2091359, lng: 121.4298017 }, // 新北市淡水區下圭柔山91之3號
      '新北市五股區公立動物之家': { lat: 25.0776139, lng: 121.4157993 }, // 新北市五股區外寮路9-9號
      '新北市八里區公立動物之家': { lat: 25.125434, lng: 121.390358 }, // 新北市八里區長坑里6鄰長坑道路36號
      '新北市瑞芳區公立動物之家': { lat: 25.093605, lng: 121.7964441 }, // 新北市瑞芳區靜安路四段
      '新北市三芝區公立動物之家': { lat: 25.2218987, lng: 121.5329757 }, // 新北市三芝區青山路
      
      // 桃園市
      '桃園市動物保護教育園區': { lat: 25.0078164, lng: 121.0282456 }, // 桃園市新屋區永興里3鄰藻礁路1668號
      
      // 新竹市/縣
      '新竹市動物保護教育園區': { lat: 24.8330822, lng: 120.919696 }, // 新竹市南寮里海濱路250號
      '新竹縣動物保護教育園區': { lat: 24.8284583, lng: 121.0150649 }, // 新竹縣竹北市縣政五街192號
      '新竹縣動物保護防疫所': { lat: 24.8284583, lng: 121.0150649 }, // 新竹縣竹北市縣政五街192號
      
      // 苗栗縣
      '苗栗縣動物保護教育園區': { lat: 24.4998403, lng: 120.7928067 }, // 苗栗縣銅鑼鄉朝陽村6鄰朝北55-1號
      '苗栗縣生態保育教育中心(動物收容所)': { lat: 24.4998403, lng: 120.7928067 }, // 苗栗縣銅鑼鄉朝陽村6鄰朝北55-1號
      
      // 台中市
      '臺中市動物之家南屯園區': { lat: 24.1436793, lng: 120.581061 }, // 臺中市南屯區中台路601號
      '台中市動物之家南屯園區': { lat: 24.1436793, lng: 120.581061 }, // 臺中市南屯區中台路601號
      '臺中市動物之家后里園區': { lat: 24.2863873, lng: 120.7095659 }, // 臺中市后里區堤防路370號
      '台中市動物之家后里園區': { lat: 24.2863873, lng: 120.7095659 }, // 臺中市后里區堤防路370號
      
      // 彰化縣
      '彰化縣流浪狗中途之家': { lat: 23.9692434, lng: 120.6197311 }, // 彰化縣員林市大峰里阿寶巷426號
      
      // 南投縣
      '南投縣公立動物收容所': { lat: 23.9058822, lng: 120.6697411 }, // 南投縣南投市嶺興路36-1號
      
      // 雲林縣
      '雲林縣流浪動物收容所': { lat: 23.6982843, lng: 120.5260516 }, // 雲林縣斗六市雲林路二段517號
      
      // 嘉義市/縣
      '嘉義市動物保護教育園區': { lat: 23.4643138, lng: 120.4687944 }, // 嘉義市彌陀路31號
      '嘉義縣動物保護教育園區': { lat: 23.539732, lng: 120.4847242 }, // 嘉義縣民雄鄉松山村後山仔37之2號
      
      // 台南市
      '臺南市動物之家灣裡站': { lat: 22.936731, lng: 120.1941835 }, // 臺南市南區省躬里14鄰萬年路580巷92號
      '台南市動物之家灣裡站': { lat: 22.936731, lng: 120.1941835 }, // 臺南市南區省躬里14鄰萬年路580巷92號
      '臺南市動物之家善化站': { lat: 23.1496192, lng: 120.3325697 }, // 臺南市善化區昌隆里東勢寮1號
      '台南市動物之家善化站': { lat: 23.1496192, lng: 120.3325697 }, // 臺南市善化區昌隆里東勢寮1號
      
      // 高雄市
      '高雄市壽山動物保護教育園區': { lat: 22.6364639, lng: 120.2748072 }, // 高雄市鼓山區萬壽路350號
      '高雄市燕巢動物保護關愛園區': { lat: 22.7921982, lng: 120.4049252 }, // 高雄市燕巢區師大路98號
      
      // 屏東縣
      '屏東縣公立犬貓中途之家': { lat: 22.6463129, lng: 120.6161399 }, // 屏東縣內埔鄉學府路1號
      
      // 台東縣
      '臺東縣動物收容中心': { lat: 22.7270994, lng: 121.1028477 }, // 臺東縣臺東市中華路4段999巷600號
      '台東縣動物收容中心': { lat: 22.7270994, lng: 121.1028477 }, // 臺東縣臺東市中華路4段999巷600號
      
      // 花蓮縣
      '花蓮縣狗貓躍動園區': { lat: 23.8004966, lng: 121.4725425 }, // 花蓮縣鳳林鎮林榮里永豐路255號
      '花蓮縣流浪犬中途之家': { lat: 23.8004966, lng: 121.4725425 }, // 花蓮縣鳳林鎮林榮里永豐路255號
      
      // 宜蘭縣
      '宜蘭縣流浪動物中途之家': { lat: 24.6665997, lng: 121.8309079 }, // 宜蘭縣五結鄉成興村利寶路60號
      
      // 基隆市
      '基隆市寵物銀行': { lat: 25.1250617, lng: 121.6789065 }, // 基隆市七堵區大華三路45-12號
      
      // 澎湖縣
      '澎湖縣流浪動物收容中心': { lat: 23.550192, lng: 119.6238368 }, // 澎湖縣馬公市烏崁里260號
      
      // 金門縣
      '金門縣動物收容中心': { lat: 24.44329, lng: 118.441467 }, // 金門縣金湖鎮裕民農莊20號
      
      // 連江縣（馬祖）
      '連江縣流浪犬收容中心': { lat: 26.1645594, lng: 119.9581538 }, // 連江縣南竿鄉復興村223號
      '連江縣動物收容所': { lat: 26.1645594, lng: 119.9581538 }, // 連江縣南竿鄉復興村223號
    };
    
    let coordinate;
    
    // 首先嘗試直接匹配收容所名稱
    if (shelterCoordinates[shelterName]) {
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
  
  return result;
};

export const parseTaichungData = (data) => {
  
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
      return null;
    }
  };

  const parseDate = (dateStr) => {
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
  
  // 檢查座標是否為有效數字，對於空字串給預設座標
  if (!lngStr || !latStr || lngStr === "" || latStr === "" || !isFinite(lng) || !isFinite(lat)) {
    // 使用預設座標而不是跳過，確保資料能顯示
    const result = {
      city: '台中市',
      title: data[taichungKeyMap.projectName] || '道路工程',
      distriction: (data[taichungKeyMap.district] && !data[taichungKeyMap.district].includes('區')) ? data[taichungKeyMap.district] + '區' : (data[taichungKeyMap.district] || '未知區域'),
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
        lat: 24.163 + (Math.random() - 0.5) * 0.00015, // 加入隨機偏移避免重疊
        lng: 120.673 + (Math.random() - 0.5) * 0.00015,
        polygon: splitPolygonData(data[taichungKeyMap.geometry]),
      },
    };
    return result;
  }

  // 檢查座標是否在合理範圍內，如果不是就使用預設座標
  if (lng < 120 || lng > 122 || lat < 23 || lat > 25) {
    const result = {
      city: '台中市',
      title: data[taichungKeyMap.projectName] || '道路工程',
      distriction: (data[taichungKeyMap.district] && !data[taichungKeyMap.district].includes('區')) ? data[taichungKeyMap.district] + '區' : (data[taichungKeyMap.district] || '未知區域'),
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
        lat: 24.163 + (Math.random() - 0.5) * 0.00015, // 加入隨機偏移避免重疊
        lng: 120.673 + (Math.random() - 0.5) * 0.00015,
        polygon: splitPolygonData(data[taichungKeyMap.geometry]),
      },
    };
    return result;
  }


  const result = {
    city: '台中市',
    title: data[taichungKeyMap.projectName] || '道路工程',
    distriction: (data[taichungKeyMap.district] && !data[taichungKeyMap.district].includes('區')) ? data[taichungKeyMap.district] + '區' : (data[taichungKeyMap.district] || '未知區域'),
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
  
  return result;
};

export const parseTaipeiData = (item) => {
  
  const properties = item.properties;
  const geometry = item.geometry;


  const parseDate = (dateStr) => {
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
  
  const { lat, lng } = convertTWD97ToWGS84(x, y);

  const result = {
    city: '台北市',
    title: properties[taipeiKeyMap.projectName] || properties[taipeiKeyMap.projectPurpose] || '道路工程',
    distriction: (properties[taipeiKeyMap.district] && !properties[taipeiKeyMap.district].includes('區')) ? properties[taipeiKeyMap.district] + '區' : (properties[taipeiKeyMap.district] || '未知區域'),
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
  
  return result;
};

export const parseKaohsiungData = (rawData) => {
  
  if (!rawData || !rawData.Data || !Array.isArray(rawData.Data)) {
    return [];
  }


  return rawData.Data.map((item, index) => {
    
    const parseDate = (dateStr) => {
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
    
    return result;
  });
};
