const util = require('./util');

const sass = require('node-sass');

const units = ['px', '%', 'rem', 'em'];

const valueDecoder = (type, v) => {
    switch (type) {
        case 'text':
        case 'color':
        case 'number':
            return {
                _type: type,
                _value: v
            };
        case 'size':
            if (!v) v = '0px';
            let number, unit;
            number = parseFloat(v);
            if (isNaN(number)) {
                number = 0;
                unit = 'px';
            } else {
                unit = units.find(u => v.indexOf(u) >= 0) || 'px'
            }
            return {
                number: {
                    _type: 'number',
                    _value: number
                },
                unit: {
                    _type: 'select',
                    _value: unit,
                    _options: units
                }
            };
        case 'size_4':
            let trbl = v.split(' ');
            if (trbl.length === 1) {
                trbl.push(trbl[0]);
                trbl.push(trbl[0]);
                trbl.push(trbl[0]);
            } else if (trbl.length === 2) {
                trbl.push(trbl[0]);
                trbl.push(trbl[1]);
            } else if (trbl.length === 3) {
                trbl.push(trbl[1]);
            }
            return {
                top: valueDecoder('size', trbl[0]),
                right: valueDecoder('size', trbl[1]),
                bottom: valueDecoder('size', trbl[2]),
                left: valueDecoder('size', trbl[3])
            };
        case 'display':
            return {
                _type: 'select',
                _value: v,
                _options: ['block', 'inline-block', 'inline']
            };
        case 'position':
            return {
                _type: 'select',
                _value: v,
                _options: ['relative', 'absolute', 'fixed']
            };
        case 'float':
            return {
                _type: 'select',
                _value: v,
                _options: ['left', 'right']
            };
        case 'text-align':
            return {
                _type: 'select',
                _value: v,
                _options: ['center', 'left', 'right']
            };
    }
};

const valueEncoder = (type, obj) => {
    switch (type) {
        case 'text':
        case 'color':
        case 'number':
        case 'display':
        case 'position':
        case 'float':
        case 'text-align':
            return obj._value;
        case 'size':
            return obj.number._value + obj.unit._value;
        case 'size_4':
            return [valueEncoder('size', obj.top), valueEncoder('size', obj.right), valueEncoder('size', obj.bottom), valueEncoder('size', obj.left)].join(' ');
        default:
            return '';
    }
};

const cloneObj = obj => JSON.parse(JSON.stringify(obj));

const parse = (filePath, { converter } = {}) => {
    let content = util.readFile(filePath);
    if (content == null) return null;
    let vars = {};
    let t = util.matchReg(content, /\$([a-zA-Z0-9$_-]+):\s*(.*?);\s*\/\/(.*)/g);
    let varArr = t.matches.map(item => {
        let value = item[2].trim();
        let type = (item[3] || 'text').trim();
        return {
            name: item[1],
            value: value,
            type: type,
            desc: cloneObj(valueDecoder(type, value) || { _type: 'text', _value: value })
        }
    });
    return {
        vars: converter ? converter(varArr) : varArr,
        body: content.substr(t.offset)
    };
};

const { StringDecoder } = require('string_decoder');
const decoder = new StringDecoder('utf8');

const stringify = (obj = {}) => {
    let scss = (obj.vars || []).map(item => `$${item.name}: ${item.value = valueEncoder(item.type, item.desc)}; // ${item.type}`).join('\n') +
        (obj.body || '');
    if (scss.trim() === '') return '';
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