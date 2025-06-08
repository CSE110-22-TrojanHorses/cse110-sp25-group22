class NavBar extends HTMLElement {
  /**
   * Creates Navigation Bar
   */
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    const nav = document.createElement("nav");

    // Sets up buttons in navigation bar
    nav.innerHTML = `
        <button id="home" onclick="window.open('homepage.html', '_self')"></button>
        <button id="create" onclick="window.open('./editor_page/index.html', '_self')"></button>`; // Add onclick when edit page is created

    // Sets up style of navigation bar
    const style = document.createElement("link");
    style.setAttribute("rel", "stylesheet");
    style.setAttribute("href", "homepage.css");
    this.shadowRoot.append(style, nav);
  }
}

// Defines element name to create NavBar
customElements.define("nav-bar", NavBar);
