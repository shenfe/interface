const path = require('path');

const util = require('./util');

const parseSass = require('./parseSass');

const parse = (dirPath, options) => {
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
        style: parseSass.parse(path.resolve(dirPath, 'index.scss'), options)
    };
};

const stringify = (obj = {}, middlewares = [], interfaceRecords = {}) => {
    if (typeof middlewares === 'function') middlewares = [middlewares];
    let html = obj.html || '';
    let style = parseSass.stringify(obj.style);

    if (obj.interface && obj.interface !== '') {
        if (!interfaceRecords[obj.interface]) interfaceRecords[obj.interface] = 0;
        interfaceRecords[obj.interface]++;
        html = html.replace(new RegExp('class="(.*?)(' + util.escapeRegStr(obj.interface) + ')(.*?)"', 'mg'), function (p0, p1, p2, p3) {
            return `class="${p1}${obj.interface}-${interfaceRecords[obj.interface]}${p3}"`;
        });
        style = util.replaceAll(style, obj.interface, `${obj.interface}-${interfaceRecords[obj.interface]}`);
    }
    (obj.slots || []).forEach(item => {
        let nodes = item.nodes.map(node => stringify(node, middlewares, interfaceRecords));
        if (nodes.length) {
            html = html.replace(item.text, nodes.map(node => node.html).join(''));
        }
        style += nodes.map(node => node.style).join('\n');
    });

    let res = { html, style };
    middlewares.forEach(fn => {
        res = fn(res);
    });
    return res;
};

module.exports = {
    parse,
    stringify
};
