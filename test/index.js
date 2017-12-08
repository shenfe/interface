const path = require('path');

const intf = require('../src/index');

let node1 = intf.parse(path.resolve(__dirname, 'combin-title-desc'));

console.log(node1);

console.log(intf.stringify(node1));

let node2 = intf.parse(path.resolve(__dirname, 'layout-fix-flex'));

console.log(node2);

node1.slots[0].nodes.push(node2);

console.log(intf.stringify(node1));

