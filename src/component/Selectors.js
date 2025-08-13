import React from 'react';

const Selectors = (props) => {
  const { condition, setCondition, option, setPageIndex } = props;

  console.log('🎛️ Selectors.js - 目前 condition:', condition);
  console.log('🎛️ Selectors.js - 收容所選項:', option.shelter);

  const handleAnimalKindChange = (value) => {
    const newCondition = {
      ...condition,
      animalKind: value,
      stack: value === "全部" ? [] : ["animalKind"]
    };
    setCondition(newCondition);
    if (setPageIndex) setPageIndex(0); // 重設頁面索引
  };

  const handleShelterChange = (value) => {
    const newCondition = {
      ...condition,
      shelter: value,
      stack: value === "全部" ? [] : ["shelter"]
    };
    setCondition(newCondition);
    if (setPageIndex) setPageIndex(0); // 重設頁面索引
  };

  const handleSexChange = (value) => {
    const newCondition = {
      ...condition,
      sex: value,
      stack: value === "全部" ? [] : ["sex"]
    };
    setCondition(newCondition);
    if (setPageIndex) setPageIndex(0); // 重設頁面索引
  };

  const handleAgeChange = (value) => {
    const newCondition = {
      ...condition,
      age: value,
      stack: value === "全部" ? [] : ["age"]
    };
    setCondition(newCondition);
    if (setPageIndex) setPageIndex(0); // 重設頁面索引
  };

  return (
    <div className="selectors">
      <div className="selector-group">
        <label>動物種類：</label>
        <select 
          value={condition.animalKind || "全部"} 
          onChange={(e) => handleAnimalKindChange(e.target.value)}
        >
          <option value="全部">全部</option>
          {option.animalKind && option.animalKind.map((kind, index) => (
            <option key={index} value={kind}>{kind}</option>
          ))}
        </select>
      </div>

      <div className="selector-group">
        <label>收容所：</label>
        <select 
          value={condition.shelter || "全部"} 
          onChange={(e) => handleShelterChange(e.target.value)}
        >
          <option value="全部">全部</option>
          {option.shelter && option.shelter.map((shelter, index) => (
            <option key={index} value={shelter}>{shelter}</option>
          ))}
        </select>
      </div>

      <div className="selector-group">
        <label>性別：</label>
        <select 
          value={condition.sex || "全部"} 
          onChange={(e) => handleSexChange(e.target.value)}
        >
          <option value="全部">全部</option>
          {option.sex && option.sex.map((sex, index) => (
            <option key={index} value={sex}>{sex}</option>
          ))}
        </select>
      </div>

      <div className="selector-group">
        <label>年齡：</label>
        <select 
          value={condition.age || "全部"} 
          onChange={(e) => handleAgeChange(e.target.value)}
        >
          <option value="全部">全部</option>
          {option.age && option.age.map((age, index) => (
            <option key={index} value={age}>{age}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Selectors;
