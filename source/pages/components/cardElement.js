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
    this.isResizing = false;
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
        if(oldVal == null)
          this.createCardElement(newVal)
    } else if(name === "pos"){
        if(oldVal !== newVal)
            this.moveElem(newVal);
    }
  }

  createCardElement(elemType){
    let [parentType, subType] = elemType.split("-");
    this.type = parentType;
    console.log(parentType, subType);
    if(parentType === "textBox")
      this.makeTextBox();
    else if(parentType === "shape")
      this.makeShape(subType);//subType is shapeType
    else if(parentType === "image")
      this.makeImage(subType);//subType is dataURL
    this.elem.addEventListener("click", (e) =>{
      // console.log("Event read");

      if(this.type === "textBox"){
        const rect = this.elem.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        const padding = 8;
        
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
        detail: [this.type, this.elem]});
        window.dispatchEvent(event);
      });
  }

  makeTextBox(){
    const textArea = document.createElement("textarea");
    textArea.id = `${this.elemID}`;
    this.elem = textArea;
    textArea.placeholder = "Start text here...";
    // form.style.border = "1px solid red";
    this.shadow.appendChild(textArea);
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
    }
    const resizer = document.createElement("div");
    resizer.className = "resizer";
    Object.assign(resizer.style, {
      width: "10px",
      height: "10px",
      background: "transparent",
      position: "absolute",
      right: "0",
      bottom: "0",
      cursor: "se-resize",
      zIndex: "10"
    });
    shape.appendChild(resizer);
    
    resizer.addEventListener("mousedown", (e) => {
      e.stopPropagation();
      this.isResizing = true;
      document.addEventListener("mousemove", (b) => {
        if (!this.isResizing) return;
        console.log("Bruh");
        const rect = shape.getBoundingClientRect();
        const newWidth = b.clientX - rect.left;
        const newHeight = b.clientY - rect.top;
        shape.style.width = `${newWidth}px`;
        shape.style.height = `${newHeight}px`;
      });
      document.addEventListener("mouseup", () => {
        this.isResizing = false;
      });
    });
    this.shadow.appendChild(shape);
  }

  makeImage(dataURL){
    const wrapper = document.createElement("div");
    const img = document.createElement("img");
    img.src = dataURL;
    wrapper.id = `${this.elemID}`;
    this.elem = wrapper;
    const resizer = document.createElement("div");
    resizer.className = "resizer";
    Object.assign(resizer.style, {
      width: "10px",
      height: "10px",
      background: "transparent",
      position: "absolute",
      right: "0",
      bottom: "0",
      cursor: "se-resize",
      zIndex: "10"
    });
    wrapper.appendChild(resizer);

    resizer.addEventListener("mousedown", (e) => {
      e.stopPropagation();
      this.isResizing = true;
      document.addEventListener("mousemove", (b) => {
        if (!this.isResizing) return;
        const rect = wrapper.getBoundingClientRect();
        const newWidth = b.clientX - rect.left;
        const newHeight = b.clientY - rect.top;
        wrapper.style.width = `${newWidth}px`;
        wrapper.style.height = `${newHeight}px`;
      });
      document.addEventListener("mouseup", () => {
        this.isResizing = false;
      });
    });
    wrapper.appendChild(img);
    this.shadow.appendChild(wrapper);
    this.setAttribute("type", "image");
  }

  moveElem(pos){
    // console.log("move elem called for: " + this.type);
    let [x, y] = pos.split(","); //gets str values of x and y
    this.x = Number(x);
    this.y = Number(y);
    if(this.type === "textBox"){
      const textArea = this.elem;
      textArea.style.position = "absolute";
      textArea.style.left = `${this.x}px`;
      textArea.style.top = `${this.y}px`; //set
      textArea.style.width = `300px`;
      textArea.style.height = `50px`;
      textArea.padding = `8px`;
    } else if (this.type === "shape"){
      const shape = this.elem;
      shape.style.position = "absolute";
      shape.style.left = `${this.x}px`;
      shape.style.top = `${this.y}px`; //set
    } else if (this.type === "image"){
      const wrapper = this.elem;
      wrapper.style.width = `500px`;
      wrapper.style.height = `225px`;
      //set position
      wrapper.style.position = "absolute";
      wrapper.style.left = `${this.x}px`;
      wrapper.style.top = `${this.y}px`; //set
      const img = wrapper.querySelector("img");

      //width heigh
      img.style.width = `100%`;
      img.style.height = `100%`;
    }

  }
}

customElements.define("card-element", CardElement);
