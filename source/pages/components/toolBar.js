class ToolBar extends HTMLElement {
     
  constructor() {
    super();
    this.addingCardElem = false;
    this.mode = "edit";
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

  // static get observedAttributes() {
  //   return ["addingCardElem", "mode"];
  // }

  // attributeChangedCallback(name, oldVal, newVal){
  //   if(name === "mode"){
  //       this.mode = newVal;
  //       if(this.mode !== "select" || this.mode !== "edit")
  //         this.addingCardElem = true;
  //       else
  //         this.addingCardElem = false;
  //   }

  // }

  customizeButton(button, buttonNum) {
    switch (buttonNum) {
      case 0:
        button.innerHTML = `<img src="../../assets/icons/tool-bar-icons/location-arrow.png" alt="Diagram">`;
        button.addEventListener("click", function () {
          alert("Select clicked!");
          this.addingCardElem = false;
          this.mode = "select";
        });
        button.className = "select";
        break;
      case 1:
        button.innerHTML = `<img src="../../assets/icons/tool-bar-icons/add-image.png" alt="Diagram">`;
        button.addEventListener("click", function () {
          alert("Add Image clicked!");
          this.addingCardElem = true;
          this.mode = "image";
        });
        button.className = "addImage";
        
        break;
      case 2:
        button.innerHTML = `<img  src="../../assets/icons/tool-bar-icons/resources.png" alt="Diagram">`;
        button.addEventListener("click", function () {
          alert("Shapes clicked!");
          this.addingCardElem = true;
          this.mode = "shape";
        });
        button.className = "shapes";
        break;
      case 3:
        button.innerHTML = `<img  src="../../assets/icons/tool-bar-icons/text.png" alt="Diagram">`;
      

        button.addEventListener("click", () => {
  this.addingCardElem = true;
  this.mode = "textBox";
  console.log("Mode set to:", this.mode); 
});


        button.className = "addText";
        break;
    }
  }
}

customElements.define("tool-bar", ToolBar);
