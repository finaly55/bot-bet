// The sample test script in this section is compatible with JSON wire protocol-based 
// client bindings. Check out our W3C-based scripts in 
// the selenium-4 branch of the same repository.
const webdriver = require('selenium-webdriver');
const { By } = require('selenium-webdriver');
const assert = require('assert');
// Input capabilities
const capabilities = {
 'os_version' : '11',
 'resolution' : '1920x1080',
 'browserName' : 'Chrome',
 'browser_version' : 'latest',
 'os' : 'Windows',
 'name': 'BStack-[NodeJS] Sample Test', // test name
 'build': 'BStack Build Number 1' // CI/CD job or build name
}
async function runTestWithCaps () {
  let driver = new webdriver.Builder().withCapabilities(capabilities).build();
  try{
    await driver.get("https://google.com/");
    
  } catch(e) {
    //marking the test as Failed if product has not been added to the cart
    console.log("Error:", e.message)
    await driver.executeScript(
      'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "Some elements failed to load."}}'
    );
  }
  await driver.quit();
}
runTestWithCaps(); 