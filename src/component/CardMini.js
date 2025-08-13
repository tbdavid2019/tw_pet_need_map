
const CardMini = (props)=>{
    let data = props.value;
    return(
        <div className='cardMini'>
            <div className='title'>
                <div className='animalType inlineBlock'>
                    {data.animalKind}
                </div>
            </div>
                            <div className='pet-image-container' style={{position: 'relative', width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#f0f0f0', border: '1px solid #ddd'}}>
                    {data.albumFile ? (
                        <img 
                            src={data.albumFile} 
                            alt={`${data.animalKind} - ${data.variety}`}
                            style={{width: '100%', height: '100%', objectFit: 'cover'}}
                            onError={(e) => {
                                console.log('🖼️ CardMini 圖片載入失敗:', data.albumFile);
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #999; font-size: 10px; text-align: center; line-height: 1.2;">圖片<br/>載入失敗</div>';
                            }}
                            onLoad={() => {
                                console.log('🖼️ CardMini 圖片載入成功:', data.albumFile);
                            }}
                        />
                    ) : (
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#999', fontSize: '10px', textAlign: 'center', lineHeight: '1.2'}}>
                            無<br/>照片
                        </div>
                    )}
                </div>
            <div>
                <div className='item'>品種</div>
                <div className='data'>{data.variety}</div>
            </div>
            <div>
                <div className='item'>性別/體型</div>
                <div className='data'>{data.sex} / {data.bodytype}</div>
            </div>
            <div>
                <div className='item'>收容所</div>
                <div className='data last'>{data.shelterName}</div>
            </div>
        </div>
    );
}

export default CardMini;