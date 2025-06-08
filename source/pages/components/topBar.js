/**
 * Custom Web Component representing the horizontal top bar.
 * Comes with five iconic buttons: Home, Save, Download, Share, and Profile.
 * Basically, everything you need to look productive without doing much.
 * @customElement
 * @extends HTMLElement
 */
class TopBar extends HTMLElement {
  /**
   * Constructs the top bar, loads external CSS,
   * creates five beautifully generic buttons, and shoves it all into Shadow DOM.
   */
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
   
    // External stylesheet for layout and button styling
    const style = document.createElement("link");
    style.setAttribute("rel", "stylesheet");
    style.setAttribute("href", "navBars.css");
    
    // Main container for the top navigation bar
    const container = document.createElement("nav");
    container.classList.add("navcontainer");
    
    // Generate and customize 5 buttons
    this.buttons = [];
    for (let i = 0; i < 5; i++) {
      let button = document.createElement("button");
      this.customizeButton(button, i);
      this.buttons.push(button);
      container.appendChild(button);
    }
    // Inject styles and content into Shadow DOM
    this.shadowRoot.append(style, container);
  }
  /**
   * Customizes a top bar button depending on its index.
   * Assigns icon, functionality, and styling class.
   * @param {HTMLButtonElement} button - The button to customize.
   * @param {number} buttonNum - Button index (0: Home, 1: Save, 2: Download, 3: Share, 4: Profile)
   */
  customizeButton(button, buttonNum) {
    switch (buttonNum) {
      case 0:
        button.innerHTML = `<img src="../../assets/icons/top-bar-icons/apps.png" alt="Diagram">`;
        button.addEventListener("click", function () {
          window.location.href = escape("../homepage.html");
        });
        button.className = "topleftimg";
        break;
      case 1:
        button.innerHTML = `<img src="../../assets/icons/top-bar-icons/disk.png" alt="Diagram">`;
        button.addEventListener("click", function () {
          alert("Save clicked!");
        });
        button.className = "save";
        break;
      case 2:
        button.innerHTML = `<img src="../../assets/icons/top-bar-icons/download.png" alt="Diagram">`;
        button.addEventListener("click", function () {
          alert("Download clicked!");
        });
        button.className = "download";
        break;
      case 3:
        button.innerHTML = `<img src="../../assets/icons/top-bar-icons/share.png" alt="Diagram">`;
        button.addEventListener("click", function () {
          alert("Share clicked!");
        });
        button.className = "share";
        break;
      case 4:
        button.innerHTML = `<img src="../../assets/icons/top-bar-icons/circle-user.png" alt="Diagram">`;
        button.addEventListener("click", function () {
          alert("Profile clicked!");
        });
        button.className = "toprightimg";
        break;
    }
  }
}
/**
 * Registers the <top-bar> custom element so it can actually be used in HTML.
 * Otherwise, it’s just a sad row of broken buttons.
 */
customElements.define("top-bar", TopBar);
