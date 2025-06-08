class ToolBar extends HTMLElement {

  constructor() {
    super();
    this.addingCardElem = false;
    this.cropperInit = false;
    this.mode = "edit";
    this.selectedShape = null;
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
    this.addShapeEventListeners();
    this.shadowRoot.append(style, toolbar);
    this.cropperManager = new CropperManager();
  }

  // Closes the shape menu if it's already open
  closeShapeMenuIfOpen() {
    const existingMenu = this.shadowRoot.querySelector(".shape-menu");
    if (existingMenu) {
      existingMenu.remove();
      this.shapeMenu = null;
    }
  }

  static get observedAttributes() {
    return ["addingCardElem", "mode"];
  }

  attributeChangedCallback(name, oldVal, newVal){
    if(name === "mode"){
        this.mode = newVal;
        if(this.mode !== "select" || this.mode !== "edit")
          this.addingCardElem = true;
        else
          this.addingCardElem = false;
    }
  }

  getMode(){
    // console.log(this.mode);
    return this.mode;
  }

  resetMode(){
    this.mode = "edit";
  }

  customizeButton(button, buttonNum) {
    const closeMenu = this.closeShapeMenuIfOpen.bind(this);
    switch (buttonNum) {
      case 0:
        button.innerHTML = `<img src="../../assets/icons/tool-bar-icons/location-arrow.png" alt="Diagram">`;
        button.addEventListener("click", () => {
          closeMenu();
          // alert("Select clicked!");
          this.addingCardElem = false;
          this.mode = "select";
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
            reader.onload = e => this.cropperManager.openCropper(e.target.result); // send image to cropper
            reader.readAsDataURL(f);
            window.__fileInput.value = "";           // reset for next time
          });
        }
        // When button is clicked, open the file picker
        button.addEventListener("click", () => {
          //set ok and cancel buttons if img button clicked
          if(!this.cropperInit){
            this.cropperManager.initControls();
            this.cropperInit = true;
          }
          //open file directory
          this.cropperManager.toggleImgSelection();
          this.addingCardElem = true;
          this.mode = "image";
        });
        button.className = "addImage";
        break;
      case 2:
        button.innerHTML = `<img  src="../../assets/icons/tool-bar-icons/resources.png" alt="Diagram">`;
        button.addEventListener("click", () => {
          this.toggleShapeMenu();
          // alert("Shapes clicked!");
          this.addingCardElem = true;
          this.mode = "shape";
        });
        button.className = "shapes";
        break;
      case 3:
        button.innerHTML = `<img  src="../../assets/icons/tool-bar-icons/text.png" alt="Diagram">`;
        button.addEventListener("click", () => {
        closeMenu();
        this.addingCardElem = true;
        this.mode = "textBox";
        // console.log("Mode set to:", this.mode);
        // alert("Add Text clicked!");
        });
        button.className = "addText";
        break;
    }
  }

  //
  //SHAPES RELATED FUNCTIONS
  //

  addShapeEventListeners(){
    window.addEventListener("shape-selected", (e) => {
      this.selectedShape = e.detail;

      // console.log("BUDDY" + e.detail);
      // document.body.style.cursor = "pointer";
    });
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

  //
  //IMG related function(s)
  //

  getImageReady(){
    return this.cropperManager.imageReady;
  }

  getImageURL(){
    return this.cropperManager.dataURL;
  }
}

customElements.define("tool-bar", ToolBar);

//
//Custom cropper manager class
//

class CropperManager{
    constructor(){
      this.activeCropper = null;
      this.targetImg = null;
      this.okBtn = null;
      this.cancelBtn = null;
      this.dataURL = null;
      this.imageReady = true;
    }

    //ONLY CALLED WHEN BUTTONS LOADED
    initControls(){
      this.okBtn = document.getElementById("crop-ok");
      this.cancelBtn = document.getElementById("crop-cancel");
      this.addOkBtnEventListener();
      this.addCancelBtnEventListener();
    }

    toggleImgSelection(){
      window.__fileInput.click();
    }

    /**
    * @param dataURL         image to show in Cropper
    * @param existingImg  null = user picked new file
    */
    openCropper(dataURL, existingImg = null) {
      //set the image to be cropped
      this.targetImg = existingImg;
      // show cropper modal and load image
      const modal = document.getElementById("cropper-modal");
      const img = document.getElementById("cropper-image");
      img.src = dataURL;
      modal.classList.remove("hidden");

      if (this.activeCropper) 
      this.activeCropper.destroy();
      this.activeCropper = new Cropper(img, { viewMode: 1 });
    }

    closeCropper() {
      // hide crop and destroy crop instance
      document.getElementById("cropper-modal").classList.add("hidden");
      if (this.activeCropper) { 
      this.activeCropper.destroy(); 
      this.activeCropper = null; 
      }
      this.targetImg = null;
    }

    addOkBtnEventListener(){
      this.okBtn.addEventListener("click", () => {
      console.log("Image cropped!");
      if (!this.activeCropper) return;
      //get image url save to instance var (so greeting card can use)
      this.dataURL = this.activeCropper.getCroppedCanvas().toDataURL("image/png");
      this.closeCropper();
      this.imageReady = true;
    });
    }

    addCancelBtnEventListener(){
      this.cancelBtn.addEventListener("click", () => {
        console.log("Cancelled Instead!");
        this.closeCropper();
        this.dataURL = null; //if cancel don't want to store dataurl
        this.imageReady = false;
      });
    }
}
