const fs = require('fs');
const file = '/Users/david/Documents/git/tbdavid2019/tw_pet_need_map/src/index.js';
let content = fs.readFileSync(file, 'utf8');
if (!content.includes('react-spring-bottom-sheet')) {
    content = 'import "react-spring-bottom-sheet/dist/style.css";\n' + content;
    fs.writeFileSync(file, content);
}
console.log('patched index.js');
