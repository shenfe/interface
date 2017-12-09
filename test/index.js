const path = require('path');

const intf = require('../src/index');

let node1 = intf.parse(path.resolve(__dirname, 'combin-title-desc'));

console.log(JSON.stringify(node1, null, 4));

let node2 = intf.parse(path.resolve(__dirname, 'layout-fix-flex'));

console.log(JSON.stringify(intf.stringify(node2), null, 4));

node1.slots[0].nodes.push(node2);

console.log(JSON.stringify(intf.stringify(node1), null, 4));
