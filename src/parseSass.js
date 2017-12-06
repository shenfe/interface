const util = require('./util');

const sass = require('node-sass');

const parse = filePath => {
    let content = util.readFile(filePath);
    let vars = {};
    let t = util.matchReg(content, /\$([a-zA-Z0-9$_-]+):\s*(.*?);\s*\/\*\s*(.*?)\s*\*\//mg);
    return {
        vars: t.matches.map(item => ({
            name: item[1],
            value: item[2],
            type: item[3]
        })),
        body: content.substr(t.offset)
    };
};

const stringify = obj => {
    let scss = obj.vars.map(item => `$${item.name}: ${item.value}; /* ${item.type} */`).join('\n') +
        obj.body;
    return sass.renderSync({
        data: scss
    });
};

module.exports = {
    parse,
    stringify
};