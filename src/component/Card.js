import {useState} from 'react';

const Card = (props)=>{
    let data = props.value;

    const [showLess, setShowLess] = useState(true);
    const {setMapParameters} = props;
    const handleClick = ()=>{
        setShowLess(!showLess);
    }

    const handleLocationData = ()=>{
        let randomNum = Math.random() / 1000000;
        setMapParameters({
            center: {lat:data.coordinate.lat + randomNum, lng:data.coordinate.lng + randomNum},
            polygon: data.coordinate.polygon,
            zoom: 20 + randomNum,
            selectMarker: data,
            closeInfoWindow: false
        });
    }

    if(data === 'loading'){
        return(
            <div className='card loading'>
                <div>Loading...</div>
            </div>);
    }

    return(
        <div className='card'>
            <div className='card-meta'>
                <div className='card-meta-title'>
                    <div className='highlighter bgColor_mintGreen-light' style={{width:data.animalKind.length+'em'}}></div>
                    <div className='animalType' style={{position:'relative'}}>
                        {data.animalKind}
                    </div>
                </div>
                <div className='card-meta-basicInfo'>
                    <div className='petImage' style={{
                        height: '120px', 
                        backgroundImage: data.albumFile ? `url(${data.albumFile})` : 'none', 
                        backgroundSize: 'cover', 
                        backgroundPosition: 'center', 
                        borderRadius: '8px', 
                        marginBottom: '10px', 
                        backgroundColor: '#f0f0f0',
                        border: '1px solid #ddd'
                    }}>
                        {!data.albumFile && <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#999', fontSize: '14px'}}>無照片</div>}
                        {data.albumFile && (
                            <img 
                                src={data.albumFile} 
                                alt={`${data.animalKind} - ${data.variety}`}
                                style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px'}}
                                onError={(e) => {
                                    console.log('🖼️ 圖片載入失敗:', data.albumFile);
                                    e.target.style.display = 'none';
                                    e.target.parentElement.style.backgroundImage = 'none';
                                    e.target.parentElement.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #999; font-size: 14px;">圖片載入失敗</div>';
                                }}
                                onLoad={() => {
                                    console.log('🖼️ 圖片載入成功:', data.albumFile);
                                }}
                            />
                        )}
                    </div>
                    <div className='info'>
                        <div className='item'>品種</div>
                        <div>{data.variety}</div>
                    </div>
                    <div className='info'>
                        <div className='item'>性別/體型</div>
                        <div>{data.sex} / {data.bodytype}</div>
                    </div>
                    <div className='info'>
                        <div className='item'>顏色/年齡</div>
                        <div>{data.colour} / {data.age}</div>
                    </div>
                    <div className='info'>
                        <div className='item'>收容所</div>
                        <div>{data.shelterName}</div>
                    </div>
                </div>
                <div className='buttons'>
                    {(data.coordinate.lat !== 0 && data.coordinate.lng !== 0) &&
                    <div title='顯示位置' className='buttons-locate' onClick={()=>{handleLocationData()}}>
                        <span style={{fontSize: '12px', fontWeight: 'bold', color: '#333'}}>定位</span>
                    </div>}
                    <div title='更多資訊' className={showLess ? 'buttons-moreInfo' : 'buttons-moreInfoClicked'} onClick={()=>{handleClick()}}>
                        <span style={{fontSize: '12px', fontWeight: 'bold', color: '#333'}}>
                            {showLess ? '詳細' : '收起'}
                        </span>
                    </div>
                </div>
            </div>
            <div className={`${showLess && 'noneDisplay'} horiLine`}/>
            <div className={`${showLess && 'noneDisplay'} card-body`}>
                <div className='card-body-detailInfo'>
                    <div className='oneRow'>
                        <div className='item'>動物編號</div>
                        <div className='constructTitle'>{data.id}</div>
                    </div>
                    <div>
                        <div className='item'>子編號</div>
                        <div>{data.subid}</div>
                    </div>
                    <div>
                        <div className='item'>結紮狀態</div>
                        <div>{data.sterilization}</div>
                    </div>
                    <div>
                        <div className='item'>疫苗狀態</div>
                        <div>{data.bacterin}</div>
                    </div>
                    <div className='oneRow'>
                        <div className='item'>發現地點</div>
                        <div>{data.foundplace}</div>
                    </div>
                    <div className='oneRow'>
                        <div className='item'>收容所地址</div>
                        <div>{data.shelterAddress}</div>
                    </div>
                    <div className='oneRow'>
                        <div className='item'>收容所電話</div>
                        <div className='phone'>{data.shelterTel}</div>
                    </div>
                    {data.remark && (
                        <div className='oneRow'>
                            <div className='item'>備註</div>
                            <div>{data.remark}</div>
                        </div>
                    )}
                    {data.caption && (
                        <div className='oneRow'>
                            <div className='item'>說明</div>
                            <div>{data.caption}</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Card;