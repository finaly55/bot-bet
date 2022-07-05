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
// chromeOptions.addArguments("--user-data-dir=/Users/julien/Library/Application Support/Google/Chrome/Default");


let cotes = []

async function runTestWithCaps() {
    var driver = new webdriver.Builder().forBrowser("chrome")
        .setChromeOptions(chromeOptions)
        .build();

    try {
        await driver.get("https://www.hltv.org/");

        // acceptation cookies
        try {
            await driver.findElement(webdriver.By.xpath('//*[@id="CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll"]')).click()
        } catch (e) {
            console.log("cookie déjà accepté")
        }

        // recuperation des liens des matchs
        let links = await driver.findElements(webdriver.By.className("hotmatch-box"))
        let tabs = links.map(async links => {
            return links.getAttribute("href").then((value) => { return value; })
        })
        let linksResult = await Promise.all(tabs);
        linksResult = linksResult.filter(result => !result.includes("play-in"))

        // aller sur le lien
        for (let i = 0; i < linksResult.length; i++) {
            await driver.get(linksResult[i]);
            await sleep(randomIntFromInterval(700, 1200))

            // recuperation des cotes de la premiere team
            let cotes1 = await driver.findElements(webdriver.By.css('#betting  table > tbody > tr > td:nth-child(2) > a'))
            let cotesText = cotes1.map(async cote => {
                return cote.getText().then(value => {
                    if (!isNaN(parseFloat(value)) && !(/[a-z]/i.test(value))) {
                        return parseFloat(value)
                    }
                })
            })

            let results1 = await Promise.all(cotesText);


            // recuperation des cotes de la premiere team
            let cotes2 = await driver.findElements(webdriver.By.css('#betting  table > tbody > tr > td:nth-child(4) > a'))
            cotesText = cotes2.map(async cote => {
                return cote.getText().then(value => {
                    if (!isNaN(parseFloat(value)) && !(/[a-z]/i.test(value))) {
                        return parseFloat(value)
                    }
                })
            })
            let results2 = await Promise.all(cotesText);

            // on retire toutes les cotes undefined
            results1 = results1.filter(result => result != undefined)
            results2 = results2.filter(result => result != undefined)

            // recuperation des cotes les plus hautes
            let cote1Max = Math.max.apply(Math, results1);
            let cote2Max = Math.max.apply(Math, results2);

            // ajout des cotes et du lien du bet dans le tableau des bets
            cotes.push({
                link: linksResult[i],
                cote1Max: cote1Max,
                cote2Max: cote2Max,
                betsure: 1 - (1/cote1Max) + (1/cote2Max)
            })
        }
        cotes = cotes.filter(cote => cote.betsure > 0)
        console.log(cotes)


    } catch (e) {
        console.log("Error:", e.message)
    }
    await driver.quit();
}
runTestWithCaps();

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}