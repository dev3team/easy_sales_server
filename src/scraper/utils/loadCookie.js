const fs = require('fs').promises;
const fss = require('fs');
const path = require('path');

const loadCookie = async (page) => {
    let cookies = null;
    if (fss.existsSync(path.resolve(__dirname, `../cookies.json`))) {
        const cookiesJon = await fs.readFile(path.resolve(__dirname, `../cookies.json`));
        cookies = JSON.parse(cookiesJon)
    }
    if (cookies) {await page.setCookie(...cookies)};
}

module.exports = loadCookie;