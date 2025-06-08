class ToolBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    const style = document.createElement("link");
    style.setAttribute("rel", "stylesheet");
    style.setAttribute("href", "navBars.css");
    const toolbar = document.createElement("div");
    toolbar.className = "features";
    this.buttons = [];
    for (let i = 0; i < 4; i++) {
      let button = document.createElement("button");
      this.customizeButton(button, i);
      this.buttons.push(button);
      toolbar.appendChild(button);
    }
    this.shadowRoot.append(style, toolbar);
  }

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

        if (!window.__fileInput) {
          // Create an invisible <input type="file"> to let user select an image
          window.__fileInput = document.createElement("input");
          window.__fileInput.type = "file"; // only allow files
          window.__fileInput.accept = "image/*"; // only allow image types
          window.__fileInput.style.display = "none"; // it's not visible in UI
          document.body.appendChild(window.__fileInput);
          // When user picks a file...
          window.__fileInput.addEventListener("change", () => {
            const f = window.__fileInput.files[0];   // user may cancel
            if (!f) return;
            const reader = new FileReader();
            reader.onload = e => openCropper(e.target.result); // send image to cropper
            reader.readAsDataURL(f);
            window.__fileInput.value = "";           // reset for next time
          });
        }
        // When button is clicked, open the file picker
        button.addEventListener("click", () => window.__fileInput.click());

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

customElements.define("tool-bar", ToolBar);
