const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

describe('Sample Test', function () {
  this.timeout(30000); // 30 seconds timeout

  let driver;

  before(async function () {
    driver = await new Builder().forBrowser('chrome').build();
  });

  after(async function () {
    await driver.quit();
  });

  it('homepage test-1097656', async function () {
    await driver.get('https://sanbox.services.zapdroid.io/');

    // check that 'Welcome to Acme' text is present in body
    const text = await driver.findElement(By.tagName('body')).getText();
    assert(text.includes('Welcome to Acme'));



  });
  it('homepage test another -1097657', async function () {
    await driver.get('https://sanbox.services.zapdroid.io/');

    // check that 'Welcome to Acme' text is present in body
    const text = await driver.findElement(By.tagName('body')).getText();
    assert(text.includes('non existing text'));

    

  });
});
