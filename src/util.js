const fs = require('fs');

const readFile = filePath => {
    return fs.readFileSync(filePath, 'utf8');
};

const matchReg = (string, regexp) => {
    let match;
    let result = [];
    while ((match = regexp.exec(string)) != null) {
        result.push(match);
    }
    return {
        matches: result,
        offset: (function () {
            if (!result.length) return 0;
            let last = result[result.length - 1];
            return last[0].length + last.index;
        })()
    };
};

const replaceAll = function (source, search, replacement) {
    return source.split(search).join(replacement);
};

module.exports = {
    readFile,
    matchReg,
    replaceAll
};