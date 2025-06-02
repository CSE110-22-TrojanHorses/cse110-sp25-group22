/**
 * Masterfully handcrafted Custom Web Component representing the navigation bar.
 * Gives you two buttons: one to go home and one to start “creating” things.
 * @customElement
 * @extends HTMLElement
 */
class NavBar extends HTMLElement {
    /**
   * Constructs the navigation bar, creates two buttons (Home and Create),
   * for now dark mode CSS on it, and inserts everything into Shadow DOM.
   */
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });

    const nav = document.createElement("nav");

    // Sets up buttons in navigation bar
    nav.innerHTML = `
        <button id="home" onclick="window.open('homepage.html', '_self')"></button>
        <button id="create" onclick="window.open('./editor_page/index.html', '_self')"></button>`; // Add onclick when edit page is created

    // Sets up style of navigation bar
    let style = document.createElement("style");
    /**
     * CSS to make the buttons square, black, and hopefully aesthetic.
     * @type {string}
     */
    style.textContent = `
        button {
            width: 50px;
            height: 50px;
            background-size: cover;
            background-color: black;
            border: 0px;
        }

        button:hover {
            background-color: rgb(244, 192, 127);
        }

        #home {
            background-image: url("../assets/icons/top-bar-icons/apps.png");
        }

        #create {
            background-image: url("../assets/icons/top-bar-icons/plus.png");
        }

        nav {
            background-color: black;
            display: flex;
            justify-content: space-between;
            padding: 15px;
        }

        * {
            margin: 0;
        }`;
    shadow.append(nav);
    shadow.append(style);
  }
}

/**
 * Registers the <nav-bar> custom element, because otherwise it’s just a meaningless tag.
 */
customElements.define("nav-bar", NavBar);
