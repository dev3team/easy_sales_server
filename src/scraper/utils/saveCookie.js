const fs = require('fs').promises;

const saveCookie = async (page) => {
    const cookies = await page.cookies();
    const cookieJson = JSON.stringify(cookies, null, 2);
    await fs.writeFile('cookies.json' , cookieJson);
}

module.exports = saveCookie;