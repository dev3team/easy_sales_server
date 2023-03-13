const fs = require('fs');
const path = require('path');

const loadCoverLetterTemplate = (value) => {
    const data = fs.readFileSync(path.resolve(__dirname, `../templates/${value}.json`))
    return JSON.parse(data).template
}

module.exports = loadCoverLetterTemplate;