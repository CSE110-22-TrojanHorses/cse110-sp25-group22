/* global page */
describe("Basic user flow for website", () => {
  // First visit website
  beforeEach(async () => {
    await page.goto(
      "https://cse110-22-trojanhorses.github.io/cse110-sp25-group22/pages/home_page/homepage.html"
    );
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
      return localStorage.getItem("current card");
    });
    expect(storedValue).toBe("test card");
  }, 6000);
  it("homepage card load with no card", async () => {
    // no card in storage
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: "networkidle0" });

    // expect no <homepage-card> (or whatever tag you use)
    const card = await page.$("home-card");
    expect(card).toBeNull();
  });

  it("homepage card double click", async () => {
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
  const homepageCard = await page.$("home-card");
    // double‑click it
    await Promise.all([
      homepageCard.click({ clickCount: 2 }),
    ]);
    
    await page.waitForSelector(".menu", { visible: true });
    const editOption = await page.$eval(".menu .edit", el => el.textContent);
    const deleteOption = await page.$eval(".menu .delete", el => el.textContent);

    expect(editOption).toMatch(/Edit/i);
    expect(deleteOption).toMatch(/Delete/i);
  }, 10000);

  it("homepage card edit", async () => {
        await page.evaluate((cardStr) => {
        localStorage.clear();
        localStorage.setItem("test card", cardStr);
        localStorage.setItem("current card", "test card");
  }, testCard);
   const navBar = await page.$("nav-bar");
    const shadow = await navBar.getProperty("shadowRoot");
    const homeButton = await shadow.$("#home");
    await Promise.all([
    page.waitForNavigation({ waitUntil: "networkidle0" }), 
   homeButton.click(),
  ]);
  const homepageCard = await page.$("home-card");
    // double‑click it
    await Promise.all([
      homepageCard.click({ clickCount: 2 }),
    ]);
    
    await page.waitForSelector(".menu", { visible: true });
    await Promise.all([
      page.click(".menu .edit"),
      page.waitForNavigation({ waitUntil: "networkidle0" }),
    ]);

    expect(page.url()).toMatch(/index\.html/);;
  },8000);

it("homepage card delete", async () => {
  await page.evaluate((cardStr) => {
    localStorage.clear();
    localStorage.setItem("test card", cardStr);
    localStorage.setItem("current card", "test card");
  }, testCard);

  const navBar = await page.$("nav-bar");
  const shadow = await navBar.getProperty("shadowRoot");
  const homeButton = await shadow.$("#home");

  await Promise.all([
    homeButton.click(),
    page.waitForNavigation({ waitUntil: "networkidle0" }),
  ]);

  const homepageCard = await page.$("home-card");
  await homepageCard.click({ clickCount: 2 });

  await page.waitForSelector(".menu", { visible: true });
  await page.click(".menu .delete");

  // Wait a bit for UI update

  const cardAfterDelete = await page.$("home-card");
  expect(cardAfterDelete).toBeNull();

  const cardInStorage = await page.evaluate(() => localStorage.getItem("test card"));
  expect(cardInStorage).toBeNull();
}, 8000);

 it("homepage card delete all", async () => {
  await page.evaluate((cardStr) => {
    localStorage.clear();
    localStorage.setItem("test card", cardStr);
    localStorage.setItem("test card 2", cardStr);
    localStorage.setItem("current card", "test card");
  }, testCard);

  const navBar = await page.$("nav-bar");
  const shadow = await navBar.getProperty("shadowRoot");
  const homeButton = await shadow.$("#home");

  await Promise.all([
    homeButton.click(),
    page.waitForNavigation({ waitUntil: "networkidle0" }),
  ]);

  const cards = await page.$$("home-card");
  for (const card of cards) {
    await card.click({ clickCount: 2 });
    await page.waitForSelector(".menu", { visible: true });
    await page.click(".menu .delete");
  }

  const remainingCards = await page.$$("home-card");
  expect(remainingCards.length).toBe(0);

  const keys = await page.evaluate(() => Object.keys(localStorage));
  expect(keys.length).toBe(1);
}, 10000);
  it("add button click", async () => {
    const navBar = await page.$("nav-bar");
    const shadow = await (await navBar.getProperty("shadowRoot")).asElement();
    const homeBtn = await shadow.$("#create");

    await Promise.all([
      homeBtn.click(),
      page.waitForNavigation({ waitUntil: "networkidle0" }),
    ]);

    expect(page.url()).toMatch(/index\.html$/);
  });
  
});
