import { simpleFetch } from '../lib/dataFetchers';
import { parsePetData } from '../lib/dataParsers';
import { petKeyMap } from '../constants/keyMaps';

export const cityConfig = {
  taiwan: {
    name: '全台灣',
    center: { lat: 23.8, lng: 120.9 },
    apiUrl: 'https://data.moa.gov.tw/Service/OpenData/TransService.aspx?UnitId=QcbUEzN6E6DL&IsTransData=1',
    keyMap: petKeyMap,
    fetcher: simpleFetch,
    parser: parsePetData,
    isDisabled: false,
  }
};
