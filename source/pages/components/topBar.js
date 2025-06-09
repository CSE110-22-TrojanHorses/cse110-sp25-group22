class TopBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    const style = document.createElement("link");
    style.setAttribute("rel", "stylesheet");
    style.setAttribute("href", "navBars.css");
    const container = document.createElement("nav");
    container.classList.add("navcontainer");
    this.buttons = [];
    for (let i = 0; i < 5; i++) {
      let button = document.createElement("button");
      this.customizeButton(button, i);
      this.buttons.push(button);
      container.appendChild(button);
    }
    this.shadowRoot.append(style, container);
  }
/**
 * Create and define functionality for features in the top bar
 * @param button
 * @param buttonNum
 * @returns {void}
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
customElements.define("top-bar", TopBar);
