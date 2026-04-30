import React, { useState, useEffect, useCallback, useMemo } from "react";
import Map from "./Map";
import InfoBlock from "./InfoBlock";
import InfoButton from "./InfoButton";
import MakerMessage from "./MakerMessage";
import Card from "./Card";
import { cityConfig } from "../constants/cityConfig";
import { BottomSheet } from "react-spring-bottom-sheet";
import "react-spring-bottom-sheet/dist/style.css";

const PetAdoptionApp = () => {
  const [isMobile, setIsMobile] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [closeInfoBlock, setCloseInfoBlock] = useState(null);
  const [makerMessage, setMakerMessage] = useState(null);
  const [petsData, setPetsData] = useState("loading");
  const [condition, setCondition] = useState({
    animalKind: "全部",
    shelter: "全部",
    sex: "全部",
    age: "全部",
    stack: [],
  });
  const [mapParameters, setMapParameters] = useState({
    center: { lat: 23.8, lng: 120.9 }, // 台灣中心
    polygon: null,
    zoom: 8,
    selectMarker: null,
    closeInfoWindow: null,
  });

  const INITAIL = useCallback(() => {
    let bool = null;
    changeInfoWindowHeight();
    bool = isWidthUnder(768);
    window.addEventListener("resize", changeInfoWindowHeight);
    window.addEventListener("resize", () => isWidthUnder(768));
    findUserLocation();
    initialInfoBlockDisplay(bool);
  }, []);

  const findUserLocation = () => {
    const handleUserLocation = (position) => {
      let _mapParameters = {
        center: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
        polygon: null,
        zoom: 12,
        selectMarker: null,
        closeInfoWindow: null,
      };
      setMapParameters(_mapParameters);
      setUserLocation(_mapParameters.center);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        handleUserLocation(position);
      });
    } else {
      console.log("geolocation is not available");
    }
  };

  const initialInfoBlockDisplay = (bool) => {
    if (bool === false) {
      setCloseInfoBlock(false);
    }
  };

  const changeInfoWindowHeight = () => {
    document.documentElement.style.setProperty(
      "--vh",
      `${window.innerHeight / 100}px`
    );
  };

  const isWidthUnder = (width) => {
    let bool = null;
    if (window.innerWidth <= width) bool = true;
    else bool = false;
    setIsMobile(bool);
    return bool;
  };

  const convertDate2Num = (date) => {
    let [year, month, day] = Object.values(date);
    year = year.toString();
    month = month.toString();
    day = day.toString();

    if (month.length === 1) month = "0" + month;
    if (day.length === 1) day = "0" + day;

    return parseInt(year + month + day, 10);
  };

  const sliceData = (data) => {
    let _data = data;
    let newData = [];
    for (let i = 0; i < _data.length; i += 10) {
      newData.push(_data.slice(i, i + 10));
    }
    return newData;
  };

  const fetchData = useCallback(async () => {
    console.log('🚀 開始抓取寵物資料...');
    setPetsData("loading");

    const activeCities = Object.values(cityConfig).filter(city => !city.isDisabled);
    console.log('📍 啟用的城市:', activeCities.map(c => c.name));

    const fetchPromises = activeCities.map(async (city) => {
      try {
        console.log(`📡 正在抓取 ${city.name} 的資料...`, city.apiUrl);
        const rawData = await city.fetcher(city.apiUrl);
        console.log(`✅ ${city.name} 原始資料:`, rawData);
        
        let parsedData;
        if (Array.isArray(rawData)) {
          parsedData = rawData.map(city.parser);
          console.log(`✨ ${city.name} 解析後資料數量:`, parsedData.length);
        } else {
          console.log('⚠️ 資料格式異常，跳過解析');
          parsedData = [];
        }
        
        console.log(`✨ ${city.name} 解析後資料:`, parsedData);
        return parsedData;
      } catch (error) {
        console.error(`❌ ${city.name} 抓取失敗:`, error);
        return []; // Return empty array on failure
      }
    });

    const results = await Promise.allSettled(fetchPromises);
    console.log('🎯 Promise.allSettled 結果:', results);

    let allData = results
      .filter(result => result.status === 'fulfilled')
      .flatMap(result => result.value);

    console.log('📊 合併後的所有寵物資料:', allData);
    console.log('📈 總資料筆數:', allData.length);

    if (allData.length === 0) {
        console.log('⚠️ 沒有資料，設定為 null');
        setPetsData(null); // Set to null if all fetches failed
    } else {
        console.log('🎉 設定資料完成');
        setPetsData(allData);
    }
  }, []);

  useEffect(() => {
    INITAIL();
    fetchData();
  }, [INITAIL, fetchData]);

  const filteredData = useMemo(() => {
    const filteringData = (condition) => {
      let data = petsData;
      
      if (data === null || data === "loading") {
        return data;
      }
      
      console.log('🔍 篩選條件:', condition);
      console.log('📊 原始資料數量:', data.length);
      
      // 應用所有篩選條件
      let filteredData = data.filter((object) => {
        let match = true;
        
        // 動物種類篩選
        if (condition.animalKind !== "全部") {
          match = match && object.animalKind === condition.animalKind;
        }
        
        // 收容所篩選
        if (condition.shelter !== "全部") {
          match = match && object.shelterName === condition.shelter;
        }
        
        // 性別篩選
        if (condition.sex !== "全部") {
          match = match && object.sex === condition.sex;
        }
        
        // 年齡篩選
        if (condition.age !== "全部") {
          match = match && object.age === condition.age;
        }
        
        return match;
      });
      
      console.log('📊 篩選後資料數量:', filteredData.length);
      return filteredData;
    };

    return filteringData(condition);
  }, [condition, petsData]);

  const selectorsOptions = useMemo(() => {
    let _stack = condition.stack;
    let _options = {
      animalKind: [],
      shelter: [],
      sex: [],
      age: [],
    };
    if (
      _stack.length >= 0 &&
      petsData !== "loading" &&
      petsData !== null
    ) {
      for (let object of petsData) {
        if (_options.animalKind.indexOf(object.animalKind) === -1)
          _options.animalKind.push(object.animalKind);
        if (_options.shelter.indexOf(object.shelterName) === -1)
          _options.shelter.push(object.shelterName);
        if (_options.sex.indexOf(object.sex) === -1)
          _options.sex.push(object.sex);
        if (_options.age.indexOf(object.age) === -1)
          _options.age.push(object.age);
      }
    }
    return _options;
  }, [condition.stack, petsData]);

  const handleCloseClick = () => {
    let _closeInfoBlock = closeInfoBlock;
    if (_closeInfoBlock !== null) {
      _closeInfoBlock = !_closeInfoBlock;
    } else _closeInfoBlock = false;
    setCloseInfoBlock(_closeInfoBlock);
  };

  const handleMakerMessageClick = () => {
    let _makerMessage = makerMessage;
    if (makerMessage !== null) {
      _makerMessage = !_makerMessage;
    } else _makerMessage = true;
    setMakerMessage(_makerMessage);
  };

  if (petsData === "loading") {
    return (
      <div className="container">
        <Map
          constructionsData={null}
          mapParameters={mapParameters}
          setMapParameters={setMapParameters}
          closeInfoBlock={closeInfoBlock}
          makerMessage={makerMessage}
          isMobile={isMobile}
          userLocation={userLocation}
          setCondition={setCondition}
        />
        <InfoButton
          closeInfoBlock={closeInfoBlock}
          makerMessage={makerMessage}
          handleCloseClick={handleCloseClick}
          handleMakerMessageClick={handleMakerMessageClick}
          userLocation={userLocation}
          mapParameters={mapParameters}
          setMapParameters={setMapParameters}
        />
        <InfoBlock 
          value="loading"
          length={0}
          option={selectorsOptions}
          condition={condition}
          mapParameters={mapParameters}
          closeInfoBlock={closeInfoBlock}
          isMobile={isMobile}
          handleCloseClick={handleCloseClick}
          setCondition={setCondition}
          setMapParameters={setMapParameters}
          isLoading={true}
          constructionsData={null}
        />
        <MakerMessage
          makerMessage={makerMessage}
          handleMakerMessageClick={handleMakerMessageClick}
        />
        {isMobile && mapParameters.selectMarker && (
          <BottomSheet 
            open={!!mapParameters.selectMarker}
            onDismiss={() => setMapParameters({ ...mapParameters, selectMarker: null })}
            snapPoints={({ minHeight, maxHeight }) => [minHeight, maxHeight / 2, maxHeight * 0.8]}
          >
            <div style={{ padding: "16px", overflowY: "auto" }}>
              <Card
                value={mapParameters.selectMarker}
                mapParameters={mapParameters}
                setMapParameters={setMapParameters}
              />
            </div>
          </BottomSheet>
        )}
      </div>
    );
  } else if (petsData === null) {
    return (
      <div className="container">
        <Map
          constructionsData={null}
          mapParameters={mapParameters}
          setMapParameters={setMapParameters}
          closeInfoBlock={closeInfoBlock}
          makerMessage={makerMessage}
          isMobile={isMobile}
          userLocation={userLocation}
          setCondition={setCondition}
        />
        <InfoButton
          closeInfoBlock={closeInfoBlock}
          makerMessage={makerMessage}
          handleCloseClick={handleCloseClick}
          handleMakerMessageClick={handleMakerMessageClick}
          userLocation={userLocation}
          mapParameters={mapParameters}
          setMapParameters={setMapParameters}
        />
        <InfoBlock 
          value={null}
          length={0}
          option={selectorsOptions}
          condition={condition}
          mapParameters={mapParameters}
          closeInfoBlock={closeInfoBlock}
          isMobile={isMobile}
          handleCloseClick={handleCloseClick}
          setCondition={setCondition}
          setMapParameters={setMapParameters}
          isLoading={false}
          constructionsData={null}
        />
        <MakerMessage
          makerMessage={makerMessage}
          handleMakerMessageClick={handleMakerMessageClick}
        />
        {isMobile && mapParameters.selectMarker && (
          <BottomSheet 
            open={!!mapParameters.selectMarker}
            onDismiss={() => setMapParameters({ ...mapParameters, selectMarker: null })}
            snapPoints={({ minHeight, maxHeight }) => [minHeight, maxHeight / 2, maxHeight * 0.8]}
          >
            <div style={{ padding: "16px", overflowY: "auto" }}>
              <Card
                value={mapParameters.selectMarker}
                mapParameters={mapParameters}
                setMapParameters={setMapParameters}
              />
            </div>
          </BottomSheet>
        )}
      </div>
    );
  } else {
    // 準備資料：地圖顯示全部，清單顯示篩選結果
    let mapData = petsData;  // 地圖始終顯示所有寵物
    let listData;
    
    if (
      condition.animalKind === "全部" &&
      condition.shelter === "全部" &&
      condition.sex === "全部" &&
      condition.age === "全部"
    ) {
      listData = petsData;  // 清單也顯示全部
    } else {
      listData = filteredData;  // 清單顯示篩選結果
    }
    return (
      <div className="container">
        <Map
          constructionsData={sliceData(mapData)}  // 地圖使用全部資料
          mapParameters={mapParameters}
          closeInfoBlock={closeInfoBlock}
          setMapParameters={setMapParameters}
          makerMessage={makerMessage}
          isMobile={isMobile}
          userLocation={userLocation}
          setCondition={setCondition}
        />
        <InfoButton
          closeInfoBlock={closeInfoBlock}
          makerMessage={makerMessage}
          handleCloseClick={handleCloseClick}
          handleMakerMessageClick={handleMakerMessageClick}
          userLocation={userLocation}
          mapParameters={mapParameters}
          setMapParameters={setMapParameters}
        />
        <InfoBlock
          value={sliceData(listData)}  // 清單使用篩選資料
          length={listData.length}
          option={selectorsOptions}
          condition={condition}
          mapParameters={mapParameters}
          closeInfoBlock={closeInfoBlock}
          isMobile={isMobile}
          handleCloseClick={handleCloseClick}
          setCondition={setCondition}
          setMapParameters={setMapParameters}
          constructionsData={petsData}
        />
        <MakerMessage
          makerMessage={makerMessage}
          handleMakerMessageClick={handleMakerMessageClick}
        />
        {isMobile && mapParameters.selectMarker && (
          <BottomSheet 
            open={!!mapParameters.selectMarker}
            onDismiss={() => setMapParameters({ ...mapParameters, selectMarker: null })}
            snapPoints={({ minHeight, maxHeight }) => [minHeight, maxHeight / 2, maxHeight * 0.8]}
          >
            <div style={{ padding: "16px", overflowY: "auto" }}>
              <Card
                value={mapParameters.selectMarker}
                mapParameters={mapParameters}
                setMapParameters={setMapParameters}
              />
            </div>
          </BottomSheet>
        )}
      </div>
    );
  }
};

export default PetAdoptionApp;
