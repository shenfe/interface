const util = require('./util');

const sass = require('node-sass');

const parse = (filePath, { converter } = {}) => {
    let content = util.readFile(filePath);
    if (content == null) return null;
    let vars = {};
    let t = util.matchReg(content, /\$([a-zA-Z0-9$_-]+):\s*(.*?);\s*\/\/(.*)/g);
    let varArr = t.matches.map(item => ({
        name: item[1],
        value: item[2],
        desc: item[3].trim()
    }));
    return {
        vars: converter ? converter(varArr) : varArr,
        body: content.substr(t.offset)
    };
};

const { StringDecoder } = require('string_decoder');
const decoder = new StringDecoder('utf8');

const stringify = obj => {
    let scss = obj.vars.map(item => `$${item.name}: ${item.value}; // ${item.desc}`).join('\n') +
        obj.body;
    let output = decoder.write(sass.renderSync({
        data: scss
    }).css);
    // console.log(output);
    return output;
};

module.exports = {
    parse,
    stringify
};