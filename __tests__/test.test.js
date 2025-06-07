/* global page */
describe('my first test with jest-puppeteer', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:9999/');
  });

  test('Create card and store content in localStorage', async () => {
    const navBar = await page.$('nav-bar');
    const shadowRootHandle = await navBar.getProperty('shadowRoot');
    const shadowRoot = await shadowRootHandle.asElement();
    const createButton = await shadowRoot.$('#create');
    await createButton.click();

    await page.waitForNavigation({ waitUntil: 'networkidle0' });

    const cardSelector = 'greeting-card';
    await page.waitForSelector(cardSelector);

    const card = await page.$(cardSelector);
    const cardShadowHandle = await card.getProperty('shadowRoot');
    const cardShadow = await cardShadowHandle.asElement();
    const editable = await cardShadow.$('[contenteditable="true"]');
    await editable.click();
    await editable.type('Happy Birthday, Andrew!');

    await page.evaluate(() => {
      localStorage.setItem('card_content', 'Happy Birthday, Andrew!');
    });

    await page.reload({ waitUntil: 'networkidle0' });

    const storedValue = await page.evaluate(() => {
      return localStorage.getItem('card_content');
    });

    expect(storedValue).toBe('Happy Birthday, Andrew!');
  },60000);
});
