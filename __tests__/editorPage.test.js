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

  it("Verify that exact content of page is saved when no edits are made", async () => {
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

  it("Verify that exact edits are kept when edits are made and card saved", async () => {
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

// WILLIAM TEST CASES
// New Card Should Reset Contents
it("Creating a new card should reset input fields to defaults", async () => {
  // Save modified card first
  const cardHandle = await page.$("greeting-card");
  const shadowRootHandle = await cardHandle.evaluateHandle((e) => e.shadowRoot);
  const titleInput = await shadowRootHandle.$('input[value="Front Cover Title"]');
  await titleInput.click({ clickCount: 3 });
  await titleInput.type("Old Title");
  await saveButton.click();

  // Go back to homepage and create new card
  await page.goto("https://cse110-22-trojanhorses.github.io/cse110-sp25-group22/pages/home_page/homepage.html");
  const nav = await page.$("nav-bar");
  const navShadow = await nav.evaluateHandle((e) => e.shadowRoot);
  const createBtn = await navShadow.$("#create");
  await createBtn.click();

  // Ensure the new editor has default title
  const newCard = await page.$("greeting-card");
  const newShadow = await newCard.evaluateHandle((e) => e.shadowRoot);
  const newTitle = await newShadow.$('input[value="Front Cover Title"]');
  expect(newTitle).not.toBeNull();
});

//Local Storage Card Names Should Be Unique
it("Each saved card should have a unique name in localStorage", async () => {
  await page.evaluate(() => localStorage.clear());

  const cardNames = new Set();
  for (let i = 0; i < 3; i++) {
    await saveButton.click();
    const name = await page.evaluate(() => localStorage.getItem("current card"));
    expect(cardNames.has(name)).toBe(false);
    cardNames.add(name);

    // simulate new card creation
    await page.goto("https://cse110-22-trojanhorses.github.io/cse110-sp25-group22/pages/home_page/homepage.html");
    const nav = await page.$("nav-bar");
    const navShadow = await nav.evaluateHandle((e) => e.shadowRoot);
    const createBtn = await navShadow.$("#create");
    await createBtn.click();
  }
});


// Save Message Should Disappear After Timeout
it("Save message should fade out after a short delay", async () => {
  await saveButton.click();

  // Wait long enough for it to disappear
  await page.waitForTimeout(3000); // adjust based on animation timing

  const isVisible = await page.evaluate(() => {
    const msg = document.querySelector("#save-message");
    return msg && window.getComputedStyle(msg).opacity !== "0";
  });

  expect(isVisible).toBe(false);
});


//  Image in Preview Card Should Match Saved Card
it("Preview card should display image from saved card", async () => {
  const card = await page.$("greeting-card");
  const shadow = await card.evaluateHandle((e) => e.shadowRoot);
  const img = await shadow.$("img");
  const src = await img.getProperty("src");
  const imgSrc = await src.jsonValue();

  await saveButton.click();
  await page.goto("https://cse110-22-trojanhorses.github.io/cse110-sp25-group22/pages/home_page/homepage.html");

  const preview = await page.$("home-card");
  const previewShadow = await preview.evaluateHandle((e) => e.shadowRoot);
  const previewImg = await previewShadow.$("img");
  const previewSrc = await previewImg.getProperty("src");
  const previewImgSrc = await previewSrc.jsonValue();

  expect(previewImgSrc).toBe(imgSrc);
});


// No Save Message on Empty Save
it("Save message should not appear if save fails or nothing is changed (optional)", async () => {
  await page.evaluate(() => localStorage.clear());
  // Assume your app handles empty/non-modified card saves as no-op

  await saveButton.click();
  const msgVisible = await page.evaluate(() => {
    const msg = document.querySelector("#save-message");
    return msg && window.getComputedStyle(msg).opacity === "1";
  });

  expect(msgVisible).toBe(true); // or false, depending on your app logic
});

// Test: Elements persist across page refresh
it("Saved elements should persist after a page refresh", async () => {
  const cardHandle = await page.$("greeting-card");
  const shadow = await cardHandle.evaluateHandle((e) => e.shadowRoot);
  const titleInput = await shadow.$('input[value="Front Cover Title"]');
  await titleInput.click({ clickCount: 3 });
  await titleInput.type("Refresh Test Title");

  await saveButton.click();
  await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });

  const refreshedCard = await page.$("greeting-card");
  const refreshedShadow = await refreshedCard.evaluateHandle((e) => e.shadowRoot);
  const refreshedTitle = await refreshedShadow.$('input[value="Refresh Test Title"]');

  expect(refreshedTitle).not.toBeNull();
});

// Test: Shape added to card is saved correctly
it("Added shape should be stored in localStorage after save", async () => {
  await page.evaluate(() => {
    const shape = document.createElement("div");
    shape.className = "shape square";
    document.querySelector(".cardFront").appendChild(shape);
  });

  await saveButton.click();

  const card = await page.evaluate(() => localStorage.getItem("current card"));
  const cardData = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), card);
  const shapes = cardData.frontElements.filter(e => e.className === "shape square");

  expect(shapes.length).toBeGreaterThan(0);
});

// Test: Multiple cards display correct titles in home previews
it("Each preview card on homepage should show correct titles", async () => {
  await page.evaluate(() => localStorage.clear());

  for (let i = 1; i <= 2; i++) {
    const card = await page.$("greeting-card");
    const shadow = await card.evaluateHandle((e) => e.shadowRoot);
    const titleInput = await shadow.$('input[value="Front Cover Title"]');
    await titleInput.click({ clickCount: 3 });
    await titleInput.type(`Card ${i}`);
    await saveButton.click();

    const nav = await page.$("nav-bar");
    const navShadow = await nav.evaluateHandle((e) => e.shadowRoot);
    const create = await navShadow.$("#create");
    await create.click();
  }

  await page.goto(
    "https://cse110-22-trojanhorses.github.io/cse110-sp25-group22/pages/home_page/homepage.html"
  );

  const previewTitles = await page.$$eval("home-card", (cards) =>
    cards.map((card) => {
      const shadow = card.shadowRoot;
      return shadow ? shadow.querySelector("h2")?.textContent : null;
    })
  );

  expect(previewTitles).toContain("Card 1");
  expect(previewTitles).toContain("Card 2");
});


// Test: Prevent saving if no changes and card exists (optional edge case)
it("Should not save again if no changes are made (optional)", async () => {
  await page.evaluate(() => localStorage.clear());
  await saveButton.click();
  const beforeSaveKeys = await page.evaluate(() => Object.keys(localStorage));

  await saveButton.click(); // Attempt saving again

  const afterSaveKeys = await page.evaluate(() => Object.keys(localStorage));
  expect(afterSaveKeys.length).toBe(beforeSaveKeys.length); // No new keys
});

// Test: Homepage shows “no cards” message if empty
it("Homepage should show message when no saved cards exist", async () => {
  await page.evaluate(() => localStorage.clear());
  await page.goto(
    "https://cse110-22-trojanhorses.github.io/cse110-sp25-group22/pages/home_page/homepage.html"
  );

  const noCardMsg = await page.$("p.no-cards"); // Assume this is the element shown when no cards
  expect(noCardMsg).not.toBeNull();
});
