const util = require('./util');

const sass = require('node-sass');

const descPresets = {
    text: {
        _type: 'text'
    },
    color: {
        _type: 'color'
    },
    number: {
        _type: 'number'
    },
    size: {
        number: {
            _type: 'number'
        },
        unit: {
            _type: 'select',
            _options: ['px', '%', 'em', 'rem']
        }
    },
    size_4: {
        top: {
            number: {
                _type: 'number'
            },
            unit: {
                _type: 'select',
                _options: ['px', '%', 'em', 'rem']
            }
        },
        right: {
            number: {
                _type: 'number'
            },
            unit: {
                _type: 'select',
                _options: ['px', '%', 'em', 'rem']
            }
        },
        bottom: {
            number: {
                _type: 'number'
            },
            unit: {
                _type: 'select',
                _options: ['px', '%', 'em', 'rem']
            }
        },
        left: {
            number: {
                _type: 'number'
            },
            unit: {
                _type: 'select',
                _options: ['px', '%', 'em', 'rem']
            }
        }
    },
    display: {
        _type: 'select',
        _options: ['block', 'inline-block', 'inline']
    },
    position: {
        _type: 'select',
        _options: ['relative', 'absolute', 'fixed']
    },
    float: {
        _type: 'select',
        _options: ['left', 'right']
    },
    'text-align': {
        _type: 'select',
        _options: ['center', 'left', 'right']
    }
};

const cloneObj = obj => JSON.parse(JSON.stringify(obj));

const parse = (filePath, { converter } = {}) => {
    let content = util.readFile(filePath);
    if (content == null) return null;
    let vars = {};
    let t = util.matchReg(content, /\$([a-zA-Z0-9$_-]+):\s*(.*?);\s*\/\/(.*)/g);
    let varArr = t.matches.map(item => ({
        name: item[1],
        value: item[2],
        desc: cloneObj(descPresets[item[3].trim()] || { _type: 'text' })
    }));
    return {
        vars: converter ? converter(varArr) : varArr,
        body: content.substr(t.offset)
    };
};

const { StringDecoder } = require('string_decoder');
const decoder = new StringDecoder('utf8');

const stringify = (obj = {}) => {
    let scss = (obj.vars || []).map(item => `$${item.name}: ${item.value}; // ${item.desc}`).join('\n') +
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