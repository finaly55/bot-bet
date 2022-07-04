const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');

chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());

var chromeOptions = new chrome.Options();
chromeOptions.addArguments("test-type");
chromeOptions.addArguments("--js-flags=--expose-gc");
chromeOptions.addArguments("--enable-precise-memory-info");
chromeOptions.addArguments("--disable-popup-blocking");
chromeOptions.addArguments("--disable-default-apps");
chromeOptions.addArguments("--disable-notifications")
chromeOptions.addArguments("--disable-infobars");
chromeOptions.addArguments("--user-data-dir=C:/Users/Julien/AppData/Local/Google/Chrome/User Data/Profile 1");


let cotes = []

async function runTestWithCaps() {
    var driver = new webdriver.Builder().forBrowser("chrome")
        .setChromeOptions(chromeOptions)
        .build();

    try {
        await driver.get("https://www.hltv.org/");
        try {
            await driver.findElement(webdriver.By.xpath('//*[@id="CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll"]')).click()
        } catch (e) {
            console.log("cookie déjà accepté")
        }

        var links = await driver.findElements(webdriver.By.className("hotmatch-box"))

        await links[5].click()

        let cotes1 = await driver.findElements(webdriver.By.css('#betting  table > tbody > tr > td:nth-child(2) > a')).map(async cote=> await cote.getText())


        let cotes2 = await driver.findElements(webdriver.By.css('#betting  table > tbody > tr > td:nth-child(4) > a')).map(async cote=> await cote.getText())

        console.log(cotes1)
        console.log(cotes2)


        let cote1Max = Math.max.apply(Math, cotes1);
        let cote2Max = Math.max.apply(Math, cotes2);

        cotes.push({
            link: links[5],
            cote1Max: cote1Max,
            cote2Max: cote2Max,
        })

        console.log(cotes)

        await new Promise(resolve => setTimeout(resolve, 3000)); // 3 sec

    } catch (e) {
        console.log("Error:", e.message)
    }
    await driver.quit();
}
runTestWithCaps();