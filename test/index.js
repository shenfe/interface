const path = require('path');

const intf = require('../src/index');

console.log(intf.stringify(intf.parse(path.resolve(__dirname, 'combin-title-desc'))));
