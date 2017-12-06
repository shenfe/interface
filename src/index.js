const parseHtml = require('./parseHtml');
const parseSass = require('./parseSass');

const fs = require('fs');
const path = require('path');

const parse = folderPath => {
    let obj = parseHtml.parse(path.resolve(folderPath, 'index.html'));
    obj.style = parseSass.parse(path.resolve(folderPath, 'index.scss'));
};

module.exports = {
    parse,
    parseHtml,
    parseSass
};