/* global page */
describe('Basic user flow for website', () => {
    // First visit website
    beforeEach(async () => {
        await page.goto('https://cse110-22-trojanhorses.github.io/cse110-sp25-group22/pages/editor_page/index.html');
    });

    // Save button functionality
    it('save button no edits', async () => {
        await page.goto("https://cse110-22-trojanhorses.github.io/cse110-sp25-group22/pages/editor_page/index.html",{ waitUntil: "networkidle0" });
        await page.waitForSelector("top-bar");
        const saveBtn = await page.evaluateHandle(() => {
            const topBar = document.querySelector("top-bar");
            if (!topBar) return null;
            const shadow = topBar.shadowRoot;
            return shadow?.querySelector(".save") || null;
        });
        if (!saveBtn) {
            throw new Error("Save button not found in shadow DOM.");
        }
        await Promise.all([
            saveBtn.click(),
        ]);
        const unchangedCard = await page.evaluate(() => localStorage.getItem("current card"));
        expect(unchangedCard).toBe("card 1");
          
    }, 60000);
/*
    it.skip('save button with edits', async() => {

    });

    it.skip('home button with edits no save', async() => {

    });

    it.skip('home button with no edits no save', async() => {

    });

    it.skip('home button with edits and save', async() => {

    });

    it.skip('home button with no edits and save', async() => {

    });

    it.skip('load card data when add button is clicked', async() => {

    });

    it.skip('load card data when edit button is clicked', async() => {

    });
    */
})
