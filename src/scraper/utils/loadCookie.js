const fs = require('fs').promises;
const fss = require('fs');

const loadCookie = async (page) => {
    let cookies = null;
    if (fss.existsSync('cookies.json')) {
        const cookiesJon = await fs.readFile('cookies.json');
        cookies = JSON.parse(cookiesJon)
    }
    if (cookies) {await page.setCookie(...cookies)};
}

module.exports = loadCookie;