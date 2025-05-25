/* global page */
describe('my first test with jest-puppeteer', () => {
  beforeEach(async () => {
    await page.goto('http://localhost:9999');
  });

  it('can count', async () => {
    const counter = await page.$('#counter');
    const btn = await page.$('#btn');
    let counterText = await page.evaluate(
          el => el.textContent, counter
    )
    expect(+counterText).toEqual(0);
    // cick the button
    await btn.click();
    // expect counter to increament
    counterText = await page.evaluate(el => el.textContent, counter)
    expect(+counterText).toEqual(1);
  });
})