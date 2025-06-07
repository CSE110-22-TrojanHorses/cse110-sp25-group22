/**
 * Redesigned ToolBar Web Component
 *
 * This replaces the old static toolbar with a cleaner, modular version.
 * What's better:
 * - Uses Shadow DOM so styles don't leak or clash
 * - Adds a dropdown to choose between square, rectangle, circle, triangle
 * - Emits custom "shape-selected" events for card clicks
 * - Highlights selected shapes
 * - Removed unused shapes (star, heart) to clean things up
 *
 * Basically, it's now easier to expand, style, and maintain.
 */

class ToolBar extends HTMLElement {
  // All styles are scoped to this component via Shadow DOM
  toolBarStyleContent = `
    html, body, main { width: 100%; height: 100%; }

    .pagetop {
      position: relative;
      height: 80px;
      width: 110%;
      margin-top: -9px;
      margin-left: -9px;
    }

    .topsquare {
      height: 80px;
      width: 110%;
      top: 0px;
      background-color: black;
      position: absolute;
      z-index: 1;
    }

    img {
      height: 44px;
      width: 44px;
    }

    .flip {
      position: absolute;
      border: black;
      border-width: 2px;
      border-style: solid;
      background: white;
      top: 140px;
      left: 722px;
    }

    button {
      border: none;
      background: none;
    }

    button:hover {
      background-color: rgb(244, 192, 127);
    }

    .featurebar {
      height: 350px;
      width: 100px;
      margin-top: 100px;
      margin-left: 30px;
      border-width: 5px;
      border-style: solid;
      border-radius: 1cm;
      border-color: black;
      background-color: transparent;
      z-index: 1;
    }

    .featureicons {
      position: relative;
      left: 56px;
      top: 50px;
      z-index: 2;
    }

    .select { position: absolute; bottom: 335px; }
    .addText { position: absolute; bottom: 250px; }
    .shapes { position: absolute; bottom: 165px; }
    .addImage { position: absolute; bottom: 80px; }

    .cardFront {
      position: absolute;
      height: 346px;
      width: 596px;
      background-color: transparent;
      top: 193.5px;
      left: 422px;
      border-width: 2px;
      border-style: solid;
      border-color: black;
    }

    body {
      overflow: hidden;
    }

    .shape-button.selected {
      outline: 2px solid blue;
    }
  `;

  constructor() {
    super();
    // Create a shadow root to encapsulate everything
    const shadow = this.attachShadow({ mode: "open" });

    // Toolbar container that holds all the feature buttons
    const featureIcons = document.createElement("div");
    featureIcons.className = "featureicons";
    this.buttons = [];

    // Generate 4 buttons: select, add image, shapes menu, add text
    for (let i = 0; i < 4; i++) {
      const button = document.createElement("button");
      this.customizeButton(button, i);
      this.buttons.push(button);
      featureIcons.appendChild(button);
    }

    // Add styles and icons to the shadow DOM
    const style = document.createElement("style");
    style.textContent = this.toolBarStyleContent;

    shadow.appendChild(featureIcons);
    shadow.appendChild(style);
  }

  // Closes the shape menu if it's already open
  closeShapeMenuIfOpen() {
    const existingMenu = this.shadowRoot.querySelector(".shape-menu");
    if (existingMenu) {
      existingMenu.remove();
      this.shapeMenu = null;
    }
  }

  // Handles each toolbar button's setup
  customizeButton(button, buttonNum) {
    const closeMenu = this.closeShapeMenuIfOpen.bind(this);

    switch (buttonNum) {
      case 0: // Select tool
        button.innerHTML = `<img src="../../assets/icons/tool-bar-icons/location-arrow.png" alt="Select">`;
        button.addEventListener("click", () => {
          closeMenu();
          setTimeout(() => alert("Select clicked!"), 0);
        });
        button.className = "select";
        break;

      case 1: // Add image
        button.innerHTML = `<img src="../../assets/icons/tool-bar-icons/add-image.png" alt="Add Image">`;
        button.addEventListener("click", () => {
          closeMenu();
          setTimeout(() => alert("Add Image clicked!"), 0);
        });
        button.className = "addImage";
        break;

      case 2: // Shape picker (opens dropdown)
        button.innerHTML = `<img src="../../assets/icons/tool-bar-icons/resources.png" alt="Shapes">`;
        button.addEventListener("click", () => this.toggleShapeMenu());
        button.className = "shapes";
        break;

      case 3: // Add text
        button.innerHTML = `<img src="../../assets/icons/tool-bar-icons/text.png" alt="Add Text">`;
        button.addEventListener("click", () => {
          closeMenu();
          setTimeout(() => alert("Add Text clicked!"), 0);
        });
        button.className = "addText";
        break;
    }
  }

  // Opens or closes the dropdown to choose shape type
  toggleShapeMenu() {
    // If it's already open, close it
    const existingMenu = this.shadowRoot.querySelector(".shape-menu");
    if (existingMenu) {
      existingMenu.remove();
      this.shapeMenu = null;
      return;
    }

    // We only support these shapes (no heart/star anymore)
    const shapeList = ["square", "rectangle", "circle", "triangle"];
    this.shapeMenu = document.createElement("div");
    this.shapeMenu.classList.add("shape-menu");

    // Style the dropdown menu
    Object.assign(this.shapeMenu.style, {
      display: "flex",
      position: "absolute",
      top: "250px",
      left: "130px",
      gap: "8px",
      zIndex: "3",
      background: "white",
      padding: "6px",
      border: "1px solid black",
      borderRadius: "8px",
    });

    // Add a button for each shape
    shapeList.forEach((shape) => {
      const shapeBtn = document.createElement("button");
      shapeBtn.textContent = shape;
      shapeBtn.classList.add("shape-button");
      shapeBtn.dataset.shape = shape;

      // When clicked, send an event to let the app know which shape was picked
      shapeBtn.addEventListener("click", () => {
        window.dispatchEvent(new CustomEvent("shape-selected", { detail: shape }));

        // Highlight the selected button and unhighlight others
        const allBtns = this.shapeMenu.querySelectorAll(".shape-button");
        allBtns.forEach((btn) => btn.classList.remove("selected"));
        shapeBtn.classList.add("selected");
      });

      this.shapeMenu.appendChild(shapeBtn);
    });

    // Add the menu to the shadow DOM
    this.shadowRoot.appendChild(this.shapeMenu);
  }
}

// Register the custom element so we can use <tool-bar>
customElements.define("tool-bar", ToolBar);
