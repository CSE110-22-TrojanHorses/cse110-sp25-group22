class NavBar extends HTMLElement {
  /**
   * Creates Navigation Bar
   */
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });

    const nav = document.createElement("nav");

    // Sets up buttons in navigation bar
    nav.innerHTML = `
      <!-- Shape Buttons -->
      <button class="shape-button" data-shape="square" title="Square">⬛</button>
      <button class="shape-button" data-shape="circle" title="Circle">⚫</button>
      <button class="shape-button" data-shape="rectangle" title="Rectangle">▭</button>
      <button class="shape-button" data-shape="triangle" title="Triangle">🔺</button>
      <button class="shape-button" data-shape="star" title="Star">⭐</button>
      <button class="shape-button" data-shape="heart" title="Heart">❤️</button>

      <!-- Navigation Buttons -->
      <button id="home" onclick="window.open('homepage.html', '_self')"></button>
      <button id="create" onclick="window.open('./editor_page/index.html', '_self')"></button>
    `;

    // Sets up style of navigation bar
    let style = document.createElement("style");
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
      }

      .shape-button {
        width: 40px;
        height: 40px;
        margin-left: 8px;
        background-color: #222;
        color: white;
        border: 1px solid white;
        font-size: 20px;
        cursor: pointer;
      }

      .shape-button.selected {
        background-color: #f4c07f;
        border: 2px solid yellow;
      }
    `;

    shadow.append(nav);
    shadow.append(style);

    // Add interactivity for shape selection
    const buttons = shadow.querySelectorAll(".shape-button");
    buttons.forEach(button => {
  button.addEventListener("click", () => {
    const selected = button.getAttribute("data-shape");
    
    // Dispatch a custom event with shape name
    window.dispatchEvent(new CustomEvent("shape-selected", {
      detail: selected
    }));

    buttons.forEach(btn => btn.classList.remove("selected"));
    button.classList.add("selected");
  });
});

  }
}

// Defines element name to create NavBar
customElements.define("nav-bar", NavBar);