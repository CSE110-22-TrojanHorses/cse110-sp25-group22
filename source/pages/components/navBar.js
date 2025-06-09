/**
 * Masterfully handcrafted Custom Web Component representing the navigation bar.
 *Gives you two buttons: one to go home and one to start “creating” things.
 * @customElement
 * @extends HTMLElement
*/
class NavBar extends HTMLElement {
  /**
   * Constructs the navigation bar, creates two buttons (Home and Create),
   * links a stylesheet (which better have your styles), and
   * injects it all into the Shadow DOM for a clean styling sandbox.
   */
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    
    // Create the <nav> container for the buttons
    const nav = document.createElement("nav");

    // Sets up buttons in navigation bar
    const homeButton = document.createElement("button");
    homeButton.addEventListener("click", () => {
      window.open('../home_page/homepage.html', '_self');
    })
    homeButton.id = "home";

    // if add is clicked, then set the current card to NEW so that a new card is initialized
    const addButton = document.createElement("button");
    addButton.addEventListener("click", () => {
      localStorage.setItem("current card", "NEW");
      window.open('../editor_page/index.html', '_self');
    })
    addButton.id = "create";
    nav.append(homeButton, addButton);

    // Link external stylesheet to make it look not-1995 we are modern after all
    const style = document.createElement("link");
    style.setAttribute("rel", "stylesheet");
    style.setAttribute("href", "homepage.css");
    //Stuff it all into the Shadow DOM nice and clean
    this.shadowRoot.append(style, nav);
  }
}

/**
 * Registers the <nav-bar> custom element, because otherwise it’s just a meaningless tag.
 * This is necessary for the browser to recognize it as a custom element.
 */
customElements.define("nav-bar", NavBar);
