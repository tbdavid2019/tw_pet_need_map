const fs = require('fs');
const file = '/Users/david/Documents/git/tbdavid2019/tw_pet_need_map/src/component/Map.js';
let content = fs.readFileSync(file, 'utf8');
content = content.replace('{isInfoWindowShow() && (', '{!isMobile && isInfoWindowShow() && (');
fs.writeFileSync(file, content);
console.log('patched map.js');
