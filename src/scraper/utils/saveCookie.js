const fs = require('fs').promises;
const path = require('path')

const saveCookie = async (page) => {
    const cookies = await page.cookies();
    const cookieJson = JSON.stringify(cookies, null, 2);
    await fs.writeFile(path.resolve(__dirname, `../cookies.json`) , cookieJson);
}

module.exports = saveCookie;