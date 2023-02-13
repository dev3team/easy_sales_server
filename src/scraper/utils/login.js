const login = async (page, user) => {
    console.log('redirect to login page...');
    
    // await page.waitForNavigation({waitUntil: 'domcontentloaded'});
    await page.waitForSelector('#nav-main > div > a.nav-item.login-link.d-none.d-lg-block.px-20');
    await page.click('#nav-main > div > a.nav-item.login-link.d-none.d-lg-block.px-20');

    await page.waitForNavigation({waitUntil: 'domcontentloaded'});

    await page.waitForSelector('input#login_username.up-input');
    await page.type('input#login_username.up-input', user.username);
    await page.click('#login_password_continue');
    await page.waitForSelector('input#login_password.up-input');
    await page.type('input#login_password.up-input', user.password);
    await page.click('#login_control_continue');
}

module.exports = login;

///'domcontentloaded'