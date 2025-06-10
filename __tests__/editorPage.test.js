/* global page */
describe("Basic user flow for website", () => {
  // First visit website
  let saveButton;
  beforeEach(async () => {
    await page.goto(
      "https://cse110-22-trojanhorses.github.io/cse110-sp25-group22/pages/editor_page/index.html"
    );
    const topBar = await page.$("top-bar");
    const shadow = await topBar.evaluateHandle((e) => e.shadowRoot);
    saveButton = await shadow.$(".save");
  });

  afterEach(async () => {
    await page.evaluate(() => localStorage.clear());
  });

  // Save button functionality
  it("Clicking save button should show save message", async () => {
    console.log("Checking that save message flashes");
    await saveButton.click();
    // account for fade in
    await page.waitForFunction(() => {
      const checkAppear = document.querySelector("#save-message");
      return (
        checkAppear && window.getComputedStyle(checkAppear).opacity === "1"
      );
    });

    const saveMessage = await page.$("#save-message");
    const opacity = await page.evaluate((e) => {
      return window.getComputedStyle(e).opacity;
    }, saveMessage);

    expect(opacity).toBe("1");
  });

  it("Make sure no duplicates when same card is saved", async () => {
    console.log(
      "Testing that multiple saves doesn't change card count in storage"
    );
    await page.evaluate(() => localStorage.clear());
    // first save
    await saveButton.click();

    const save1Storage = await page.evaluate(() => Object.keys(localStorage));
    const savedCardName = await page.evaluate(() =>
      localStorage.getItem("current card")
    );
    // save 3x
    for (let i = 0; i < 3; i++) {
      await saveButton.click();
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    const allKeys = await page.evaluate(() => Object.keys(localStorage));
    const cardNamePostSaves = await page.evaluate(() =>
      localStorage.getItem("current card")
    );

    // there should be 2 keys: 1 for current card and one that saves content to overwrite
    expect(allKeys.length).toBe(save1Storage.length);
    expect(allKeys).toContain("current card");
    expect(cardNamePostSaves).toBe(savedCardName); //should be same card
  });

  it("Returning home after saving edits should produce a preview", async () => {
    await page.evaluate(() => localStorage.clear());
    await saveButton.click();

    await page.goto(
      "https://cse110-22-trojanhorses.github.io/cse110-sp25-group22/pages/home_page/homepage.html"
    );

    await page.waitForSelector("home-card");
    const previewCard = await page.$("home-card");
    expect(previewCard).not.toBeNull();
  });

  it("Returning home without saving edits should produce no preview cards", async () => {
    await page.evaluate(() => localStorage.clear());
    await page.goto(
      "https://cse110-22-trojanhorses.github.io/cse110-sp25-group22/pages/home_page/homepage.html"
    );

    const previewCards = await page.$$("home-card");
    expect(previewCards.length).toBe(0);
  });

  it("Repeatedly creating new cards and saving them should give us the expected number of cards ", async () => {
    await page.evaluate(() => localStorage.clear());

    for (let i = 0; i < 3; i++) {
      await page.goto(
        "https://cse110-22-trojanhorses.github.io/cse110-sp25-group22/pages/editor_page/index.html"
      );

      const editorNav = await page.$("top-bar");
      const editorShadow = await editorNav.evaluateHandle((e) => e.shadowRoot);
      const save = await editorShadow.$(".save");
      await save.click();

      await page.goto(
        "https://cse110-22-trojanhorses.github.io/cse110-sp25-group22/pages/home_page/homepage.html"
      );

      const homeNav = await page.$("nav-bar");
      const homeShadow = await homeNav.getProperty("shadowRoot");
      const createButton = await homeShadow.$("#create");
      await createButton.click();
    }

    await page.goto(
      "https://cse110-22-trojanhorses.github.io/cse110-sp25-group22/pages/home_page/homepage.html"
    );
    const previewCards = await page.$$("home-card");
    expect(previewCards.length).toBe(3);
  });
});
