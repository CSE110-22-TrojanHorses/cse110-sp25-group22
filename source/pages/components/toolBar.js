/**
 * A handcrafted vertical toolbar Web Component.
 * Offers four essential buttons to simulate productivity:
 * Select, Add Image, Add Shapes, and Add Text.
 * @customElement
 * @extends HTMLElement
 */
class ToolBar extends HTMLElement {
  /**
   * Constructs the toolbar:
   * - Creates the Shadow DOM
   * - Links external CSS for styling
   * - Generates four buttons and customizes each one
   */
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    
    // Link to external stylesheet (must define .features and button styles)
    const style = document.createElement("link");
    style.setAttribute("rel", "stylesheet");
    style.setAttribute("href", "navBars.css");
    
    // Main container for toolbar buttons
    const toolbar = document.createElement("div");
    toolbar.className = "features";
    
    // Create and store buttons
    this.buttons = [];
    for (let i = 0; i < 4; i++) {
      let button = document.createElement("button");
      this.customizeButton(button, i);
      this.buttons.push(button);
      toolbar.appendChild(button);
    }

    // Add style and toolbar to the Shadow DOM
    this.shadowRoot.append(style, toolbar);
  }
  /**
   * Customizes a button based on its index:
   * 0 = Select, 1 = Add Image, 2 = Shapes, 3 = Add Text.
   * Sets inner HTML with icons, click behavior, and class names.
   *
   * @param {HTMLButtonElement} button - The button to customize.
   * @param {number} buttonNum - Index of the tool type.
   */
  customizeButton(button, buttonNum) {
    switch (buttonNum) {
      case 0:
        button.innerHTML = `<img src="../../assets/icons/tool-bar-icons/location-arrow.png" alt="Diagram">`;
        button.addEventListener("click", function () {
          alert("Select clicked!");
        });
        button.className = "select";
        break;
      case 1:
        button.innerHTML = `<img src="../../assets/icons/tool-bar-icons/add-image.png" alt="Diagram">`;
        button.addEventListener("click", function () {
          alert("Add Image clicked!");
        });
        button.className = "addImage";
        break;
      case 2:
        button.innerHTML = `<img  src="../../assets/icons/tool-bar-icons/resources.png" alt="Diagram">`;
        button.addEventListener("click", function () {
          alert("Shapes clicked!");
        });
        button.className = "shapes";
        break;
      case 3:
        button.innerHTML = `<img  src="../../assets/icons/tool-bar-icons/text.png" alt="Diagram">`;
        button.addEventListener("click", function () {
          alert("Add Text clicked!");
        });
        button.className = "addText";
        break;
    }
  }
}
/**
 * Registers the <tool-bar> custom element.
 * Without this, it's just a bunch of meaningless hyphens.
 */
customElements.define("tool-bar", ToolBar);
