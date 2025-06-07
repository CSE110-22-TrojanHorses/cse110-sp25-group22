/* global page */
describe('Basic user flow for website', () => {
    // First visit website
    beforeEach(async () => {
        await page.goto('http://localhost:5501/source/pages/home_page/homepage.html');
    });
    
    let testCard = `{"leftElements":[["INPUT","<input type="text" placeholder="Left Page" class="page left">",""]],
    "rightElements":[["INPUT","<input type="text" placeholder="Feel free to write your custom contents..." class="page right">",""]],
    "backElements":[["INPUT","<input type="text" placeholder="Back Cover" class="page back">",""]],
    "frontElements":[["INPUT","<input type="text" value="Front Cover Title">","Front Cover Title"],
    ["IMG","<img src="../../assets/icons/example.png" alt="Cover Image" class="cover-image">"],
    ["INPUT","<input type="text" value="Front Message">","Front Message"]],"time":"Last Sync: 6/6/2025 @ 23:9:47"}`;
    
    it.skip('home button click', async () => {
        const navBar = await page.$("nav-bar");
        const shadow = await navBar.getProperty("shadowRoot");
        const homeButton = await shadow.$("#home");
        await homeButton.click();
        expect(window.location.pathname, "/source/pages/home_page/homepage.html");
    });

    it.skip('homepage card load with card', async () => {
        localStorage.clear();
        localStorage.setItem("current card", "test card");
        localStorage.setItem("test card", testCard);
        const navBar = await page.$("nav-bar");
        const shadow = await navBar.getProperty("shadowRoot");
        const homeButton = await shadow.$("#home");
        await homeButton.click();
        
    });

    it.skip('homepage card load with no card', async () => {

    });

    it.skip('homepage card double click', async () => {

    });

    it.skip('homepage card edit', async () => {

    });

    it.skip('homepage card delete', async () => {

    });

    it.skip('homepage card delete all', async () => {

    });

    it.skip('add button click', async () => {

    });

})