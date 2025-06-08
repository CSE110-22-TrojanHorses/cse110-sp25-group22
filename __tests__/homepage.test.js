/* global page */
describe("Basic user flow for website", () => {
  // First visit website
  beforeEach(async () => {
    await page.goto(
      "https://cse110-22-trojanhorses.github.io/cse110-sp25-group22/pages/home_page/homepage.html");
      await page.evaluate(() => localStorage.clear());
  });

let testCard = `{
  "leftElements": [["INPUT", "<input type=\\"text\\" placeholder=\\"Left Page\\" class=\\"page left\\">", ""]],
  "rightElements": [["INPUT", "<input type=\\"text\\" placeholder=\\"Feel free to write your custom contents...\\" class=\\"page right\\">", ""]],
  "backElements": [["INPUT", "<input type=\\"text\\" placeholder=\\"Back Cover\\" class=\\"page back\\">", ""]],
  "frontElements": [
    ["INPUT", "<input type=\\"text\\" value=\\"Front Cover Title\\">", "Front Cover Title"],
    ["IMG", "<img src=\\"../../assets/icons/example.png\\" alt=\\"Cover Image\\" class=\\"cover-image\\">"],
    ["INPUT", "<input type=\\"text\\" value=\\"Front Message\\">", "Front Message"]
  ],
  "time": "Last Sync: 6/6/2025 @ 23:9:47"
}`;


    it("NavBar ‘home’ button stays on homepage", async () => {
    const navBar = await page.$("nav-bar");
    const shadow = await (await navBar.getProperty("shadowRoot")).asElement();
    const homeBtn = await shadow.$("#home");

    await Promise.all([
      homeBtn.click(),
      page.waitForNavigation({ waitUntil: "networkidle0" }),
    ]);

    expect(page.url()).toMatch(/homepage\.html$/);
  });

  it("homepage card load with card", async () => {
   await page.evaluate((cardStr) => {
  localStorage.clear();
  localStorage.setItem("test card", cardStr);
  localStorage.setItem("current card", "test card");
}, testCard);

    const navBar = await page.$("nav-bar");
    const shadow = await navBar.getProperty("shadowRoot");
    const homeButton = await shadow.$("#home");
    await Promise.all([
    page.waitForNavigation({ waitUntil: "networkidle0" }), // or "domcontentloaded"
   homeButton.click(),
  ]);
    const storedValue = await page.evaluate(() => {
    return localStorage.getItem('current card');
  });
  expect(storedValue).toBe("test card");
  }, 6000);
  /*
  it.skip("homepage card load with no card", async () => {
    localStorage.clear();
  });

  it.skip("homepage card double click", async () => {});

  it.skip("homepage card edit", async () => {});

  it.skip("homepage card delete", async () => {});

  it.skip("homepage card delete all", async () => {});

  it.skip("add button click", async () => {});
  */
});
