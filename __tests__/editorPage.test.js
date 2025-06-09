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

  /* change to reflect new card: should be blank*/
  it.skip("Verify that saved card with no edits is blank", async () => {
    await saveButton.click();

    const card = await page.evaluate(() =>
      localStorage.getItem("current card")
    );
    const cardData = await page.evaluate(
      (key) => JSON.parse(localStorage.getItem(key)),
      card
    );

    expect(cardData).toHaveProperty("frontElements");
    expect(cardData).toHaveProperty("backElements");
    expect(cardData).toHaveProperty("leftElements");
    expect(cardData).toHaveProperty("rightElements");

    //front page
    const front = cardData.frontElements;
    const [title, img, message] = front;
    expect(title.value).toBe("Front Cover Title");
    expect(img.tag).toBe("IMG");
    expect(message.value).toBe("Front Message");

    //back page
    const back = cardData.backElements;
    expect(back.length).toBe(1);
    expect(back[0].attributes.placeholder).toBe("Back Cover");

    //left page
    const left = cardData.leftElements;
    expect(left.length).toBe(1);
    expect(left[0].attributes.placeholder).toBe("Left Page");

    //right page
    const right = cardData.rightElements;
    expect(right.length).toBe(1);
    expect(right[0].attributes.placeholder).toBe(
      "Feel free to write your custom contents..."
    );
  });

  /* need to be changed to reflect new local storage*/
  it.skip("Verify that exact edits are kept when edits are made and card saved", async () => {
    await page.evaluate(() => localStorage.clear());

    const cardHandle = await page.$("greeting-card");
    const shadowRootHandle = await cardHandle.evaluateHandle(
      (e) => e.shadowRoot
    );

    const titleInput = await shadowRootHandle.$(
      'input[value="Front Cover Title"]'
    );
    //select all text and replace with new title
    await titleInput.click({ clickCount: 3 });
    await titleInput.type("CONGRATS, GRAD!");

    await saveButton.click();
    await new Promise((resolve) => setTimeout(resolve, 200));

    //check that edits saved
    const card = await page.evaluate(() =>
      localStorage.getItem("current card")
    );
    const savedTitle = await page.evaluate((key) => {
      const data = JSON.parse(localStorage.getItem(key));
      const title = data.frontElements.find(
        (e) => e.tag === "INPUT" && e.value === "CONGRATS, GRAD!"
      );
      return title ? title.value : null;
    }, card);

    expect(savedTitle).toBe("CONGRATS, GRAD!");
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
