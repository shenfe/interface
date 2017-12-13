const path = require('path');

const util = require('./util');

const parseSass = require('./parseSass');

const parse = dirPath => {
    let interfaceName = path.basename(dirPath);
    let content = util.readFile(path.resolve(dirPath, 'index.html'));
    if (content == null) return null;
    let slotMatches = util.matchReg(content, /<slot>([0-9a-zA-Z$_-]+)<\/slot>/mg).matches;
    return {
        interface: interfaceName,
        slots: slotMatches.map(item => ({
            name: item[1],
            text: item[0],
            nodes: []
        })),
        html: content,
        style: parseSass.parse(path.resolve(dirPath, 'index.scss'))
    };
};

const stringify = (obj, interfaceRecords = {}) => {
    let html = obj.html;
    let style = parseSass.stringify(obj.style);

    if (!interfaceRecords[obj.interface]) interfaceRecords[obj.interface] = 0;
    interfaceRecords[obj.interface]++;

    html = util.replaceAll(html, obj.interface, `${obj.interface}-${interfaceRecords[obj.interface]}`);
    style = util.replaceAll(style, obj.interface, `${obj.interface}-${interfaceRecords[obj.interface]}`);
    obj.slots.forEach(item => {
        let nodes = item.nodes.map(node => stringify(node, interfaceRecords));
        html = html.replace(item.text, nodes.map(node => node.html).join(''));
        style += nodes.map(node => node.style).join('\n');
    });

    return {
        html,
        style
    };
};

module.exports = {
    parse,
    stringify
};