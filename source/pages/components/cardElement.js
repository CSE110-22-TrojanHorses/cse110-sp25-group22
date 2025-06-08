class CardElement extends HTMLElement{
  static idCounter = 0;
  constructor(){
    super();
    this.shadow = this.attachShadow({mode:"open"});
    this.x = 0;
    this.y = 0;
    this.type = null;
    this.elem = null;
    this.writingToTextBox = false;
    this.elemID = CardElement.idCounter++;
  }

  getElemID(){
    return this.elemID;
  }

  static get observedAttributes() {
    return ["type", "pos"];
  }

  //calls upon cardElem setAttributes
  attributeChangedCallback(name, oldVal, newVal){
    // console.log("callbac called");
    if(name === "type"){
        this.createCardElement(newVal)
    } else if(name === "pos"){
        if(oldVal !== newVal)
            this.moveElem(newVal);
    }
  }

  createCardElement(elemType){
    let [parentType, subType] = elemType.split("-");
    this.type = parentType;
    if(parentType === "textBox")
      this.makeTextBox();
    else if(parentType === "shape")
      this.makeShape(subType);//subType is shapeType
    else if(parentType === "image")
      this.makeImage(subType);//subType is dataURL
    this.elem.addEventListener("click", (e) =>{
      // console.log("Event read");

      if(this.type === "textBox"){
        const textArea = this.elem.querySelector("textarea");
        const rect = textArea.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        const padding = 8; // match your CSS

        const isInsideTextArea = (
          x > padding &&
          x < rect.width - padding &&
          y > padding &&
          y < rect.height - padding
        );
        if(isInsideTextArea)
          this.writingToTextBox = true;
        else
          this.writingToTextBox = false;
      }
      const event = new CustomEvent("elemClicked", { 
        bubbles: true,
        composed: true,
        detail: [this.elemID, this.elem]});
      window.dispatchEvent(event);
    });
  }

  makeTextBox(){
    const form = document.createElement("form");
    form.id = `${this.ID}`;
    this.elem = form;
    const textArea = document.createElement("textarea");
    textArea.placeholder = "Start text here...";
    form.appendChild(textArea);
    // form.style.border = "1px solid red";
    this.shadow.appendChild(form);
    textArea.addEventListener("focus", () =>{
      this.writingToTextBox = true;
      console.log("Writing to text box!");
    });

  }

  makeShape(shapeType){
    const shape = document.createElement("div");
    shape.id = `${this.ID}`;
    this.elem = shape;
    switch (shapeType) {
      case "square":
        shape.className = "square-shape";
        shape.style.width = "200px";
        shape.style.height = "200px";
        shape.style.backgroundColor = "red";
        break;
      case "rectangle":
        shape.className = "rectangle-shape";
        shape.style.width = "300px";
        shape.style.height = "150px";
        shape.style.backgroundColor = "red";
        break;
      case "circle":
        shape.className = "circle-shape";
        shape.style.width = "200px";
        shape.style.height = "200px";
        shape.style.borderRadius = "50%";
        shape.style.backgroundColor = "red";
        break;
      case "triangle":
        shape.className = "triangle-shape";
        shape.style.width = "0";
        shape.style.height = "0";
        shape.style.borderLeft = "100px solid transparent";
        shape.style.borderRight = "100px solid transparent";
        shape.style.borderBottom = "200px solid red";
        shape.style.background = "none";
        break;
    }
    const resizer = document.createElement("div");
    resizer.className = "resizer";
    Object.assign(resizer.style, {
      width: "10px",
      height: "10px",
      background: "black",
      position: "absolute",
      right: "0",
      bottom: "0",
      cursor: "se-resize",
      zIndex: "10"
    });
    shape.appendChild(resizer);
    let isResizing = false;
    resizer.addEventListener("mousedown", (e) => {
      e.stopPropagation();
      isResizing = true;
      document.addEventListener("mousemove", (b) => {
        if (!isResizing) return;
        const rect = shape.getBoundingClientRect();
        const newWidth = b.clientX - rect.left;
        const newHeight = b.clientY - rect.top;
        if (shapeType === "triangle") {
          shape.style.borderLeftWidth = `${newWidth / 2}px`;
          shape.style.borderRightWidth = `${newWidth / 2}px`;
          shape.style.borderBottomWidth = `${newHeight}px`;
        } else {
          shape.style.width = `${newWidth}px`;
          shape.style.height = `${newHeight}px`;
        }
      });
      document.addEventListener("mouseup", () => {
        isResizing = false;
      });
    });
    this.shadow.appendChild(shape);
  }

   

  makeImage(dataURL){
    const img = document.createElement("img");
    img.id = `${this.elemID}`;
    this.elem = img;
    img.src = dataURL;
    img.alt = "Cropped Image";
    // console.log(dataURL);
    this.shadow.appendChild(img);
  }
  moveElem(pos){
    // console.log("move elem called for: " + this.type);
    let [x, y] = pos.split(","); //gets str values of x and y
    this.x = Number(x);
    this.y = Number(y);
    if(this.type === "textBox"){
      const form = this.elem;
      const textArea = form.querySelector(`textarea`);
      form.style.position = "absolute";
      form.style.left = `${this.x}px`;
      form.style.top = `${this.y}px`; //set
      textArea.style.width = `300px`;
      textArea.style.height = `50px`;
      textArea.padding = `8px`;
    } else if (this.type === "shape"){
      const shape = this.elem;
      shape.style.position = "absolute";
      shape.style.left = `${this.x}px`;
      shape.style.top = `${this.y}px`; //set
    } else if (this.type === "image"){
      const img = this.elem;
      //set position
      img.style.position = "absolute";
      img.style.left = `${this.x}px`;
      img.style.top = `${this.y}px`; //set
      //
    }

  }
}

customElements.define("card-element", CardElement);
