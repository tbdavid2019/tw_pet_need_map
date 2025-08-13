import React from 'react';

const Selectors = (props) => {
  const { condition, setCondition, option, setPageIndex } = props;

  console.log('🎛️ Selectors.js - 目前 condition:', condition);
  console.log('🎛️ Selectors.js - 收容所選項:', option.shelter);

  const handleAnimalKindChange = (value) => {
    const newStack = [...condition.stack];
    
    // 移除現有的 animalKind 條件
    const index = newStack.indexOf("animalKind");
    if (index > -1) {
      newStack.splice(index, 1);
    }
    
    // 如果不是全部，則添加條件
    if (value !== "全部") {
      newStack.push("animalKind");
    }
    
    const newCondition = {
      ...condition,
      animalKind: value,
      stack: newStack
    };
    setCondition(newCondition);
    if (setPageIndex) setPageIndex(0); // 重設頁面索引
  };

  const handleShelterChange = (value) => {
    const newStack = [...condition.stack];
    
    // 移除現有的 shelter 條件
    const index = newStack.indexOf("shelter");
    if (index > -1) {
      newStack.splice(index, 1);
    }
    
    // 如果不是全部，則添加條件
    if (value !== "全部") {
      newStack.push("shelter");
    }
    
    const newCondition = {
      ...condition,
      shelter: value,
      stack: newStack
    };
    setCondition(newCondition);
    if (setPageIndex) setPageIndex(0); // 重設頁面索引
  };

  const handleSexChange = (value) => {
    const newStack = [...condition.stack];
    
    // 移除現有的 sex 條件
    const index = newStack.indexOf("sex");
    if (index > -1) {
      newStack.splice(index, 1);
    }
    
    // 如果不是全部，則添加條件
    if (value !== "全部") {
      newStack.push("sex");
    }
    
    const newCondition = {
      ...condition,
      sex: value,
      stack: newStack
    };
    setCondition(newCondition);
    if (setPageIndex) setPageIndex(0); // 重設頁面索引
  };

  const handleAgeChange = (value) => {
    const newStack = [...condition.stack];
    
    // 移除現有的 age 條件
    const index = newStack.indexOf("age");
    if (index > -1) {
      newStack.splice(index, 1);
    }
    
    // 如果不是全部，則添加條件
    if (value !== "全部") {
      newStack.push("age");
    }
    
    const newCondition = {
      ...condition,
      age: value,
      stack: newStack
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
