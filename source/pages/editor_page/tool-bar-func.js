class ToolBar extends HTMLElement {
  toolBarStyleContent = `
    html, body, main {width: 100%; height: 100%; }

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
    const shadow = this.attachShadow({ mode: "open" });

    const featureIcons = document.createElement("div");
    featureIcons.className = "featureicons";
    this.buttons = [];

    for (let i = 0; i < 4; i++) {
      let button = document.createElement("button");
      this.customizeButton(button, i);
      this.buttons.push(button);
      featureIcons.appendChild(button);
    }

    const style = document.createElement("style");
    style.textContent = this.toolBarStyleContent;

    shadow.appendChild(featureIcons);
    shadow.appendChild(style);
  }

  closeShapeMenuIfOpen() {
    const existingMenu = this.shadowRoot.querySelector(".shape-menu");
    if (existingMenu) {
      existingMenu.remove();
      this.shapeMenu = null;
    }
  }

  customizeButton(button, buttonNum) {
    const closeMenu = this.closeShapeMenuIfOpen.bind(this);

    switch (buttonNum) {
      case 0:
        button.innerHTML = `<img src="../../assets/icons/tool-bar-icons/location-arrow.png" alt="Select">`;
        button.addEventListener("click", () => {
          closeMenu();
          setTimeout(() => {
            alert("Select clicked!");
          }, 0);
        });
        button.className = "select";
        break;

      case 1:
        button.innerHTML = `<img src="../../assets/icons/tool-bar-icons/add-image.png" alt="Add Image">`;
        button.addEventListener("click", () => {
          closeMenu();
          setTimeout(() => {
            alert("Add Image clicked!");
          }, 0);
        });
        button.className = "addImage";
        break;

      case 2:
        button.innerHTML = `<img src="../../assets/icons/tool-bar-icons/resources.png" alt="Shapes">`;
        button.addEventListener("click", () => this.toggleShapeMenu());
        button.className = "shapes";
        break;

      case 3:
        button.innerHTML = `<img src="../../assets/icons/tool-bar-icons/text.png" alt="Add Text">`;
        button.addEventListener("click", () => {
          closeMenu();
          setTimeout(() => {
            alert("Add Text clicked!");
          }, 0);
        });
        button.className = "addText";
        break;
    }
  }

  toggleShapeMenu() {
    const existingMenu = this.shadowRoot.querySelector(".shape-menu");
    if (existingMenu) {
      existingMenu.remove();
      this.shapeMenu = null;
      return;
    }

    // Removed "star" and "heart"
    const shapeList = ["square", "rectangle", "circle", "triangle"];
    this.shapeMenu = document.createElement("div");
    this.shapeMenu.classList.add("shape-menu");
    this.shapeMenu.style.display = "flex";
    this.shapeMenu.style.position = "absolute";
    this.shapeMenu.style.top = "250px";
    this.shapeMenu.style.left = "130px";
    this.shapeMenu.style.gap = "8px";
    this.shapeMenu.style.zIndex = "3";
    this.shapeMenu.style.background = "white";
    this.shapeMenu.style.padding = "6px";
    this.shapeMenu.style.border = "1px solid black";
    this.shapeMenu.style.borderRadius = "8px";

    shapeList.forEach((shape) => {
      const shapeBtn = document.createElement("button");
      shapeBtn.textContent = shape;
      shapeBtn.classList.add("shape-button");
      shapeBtn.dataset.shape = shape;

      shapeBtn.addEventListener("click", () => {
        window.dispatchEvent(new CustomEvent("shape-selected", { detail: shape }));

        const allBtns = this.shapeMenu.querySelectorAll(".shape-button");
        allBtns.forEach((btn) => btn.classList.remove("selected"));
        shapeBtn.classList.add("selected");
      });

      this.shapeMenu.appendChild(shapeBtn);
    });

    this.shadowRoot.appendChild(this.shapeMenu);
  }
}

customElements.define("tool-bar", ToolBar);
