class NavBar extends HTMLElement {
  /**
   * Creates Navigation Bar
   */
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    const nav = document.createElement("nav");

    // Sets up buttons in navigation bar
    const homeButton = document.createElement("button");
    homeButton.addEventListener("click", () => {
      window.open('../home_page/homepage.html', '_self');
    })
    homeButton.id = "home";
    const addButton = document.createElement("button");
    addButton.addEventListener("click", () => {
      localStorage.setItem("current card", "NEW");
      window.open('../editor_page/index.html', '_self');
    })
    addButton.id = "create";
    nav.append(homeButton, addButton);

    // Sets up style of navigation bar
    const style = document.createElement("link");
    style.setAttribute("rel", "stylesheet");
    style.setAttribute("href", "homepage.css");
    this.shadowRoot.append(style, nav);
  }
}

// Defines element name to create NavBar
customElements.define("nav-bar", NavBar);
