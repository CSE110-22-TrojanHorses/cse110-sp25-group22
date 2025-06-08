class CardElement extends HTMLElement{
  constructor(){
    super();
    this.shadow = this.attachShadow({mode:"open"});
    this.x = 0;
    this.y = 0;
    this.type = null;
    // const style = document.createElement("style");
  }

  static get observedAttributes() {
    return ["type", "pos"];
  }

  attributeChangedCallback(name, oldVal, newVal){
    console.log("callbac called");
    if(name === "type"){
        this.createElement(newVal)
    } else if(name === "pos"){
        if(oldVal !== newVal)
            this.moveElem(newVal);
    }
  }

  createElement(type){
    if(type === "textBox")
        this.makeTextBox();
  }

  makeTextBox(){
    const form = document.createElement("form");
    const textArea = document.createElement("textarea");
    textArea.rows = "text";
    textArea.placeholder = "Start text here...";
    form.appendChild(textArea);
    form.style.border = "1px solid red";
    this.shadow.appendChild(form);
  }

//   makeShape(shadow){

//   }

//   makeImage(shadow){
//     const image
//   }
  moveElem(pos){
    let [x, y] = pos.split(","); //gets str values of x and y
    this.x = Number(x);
    this.y = Number(y);
    const form = this.shadow.querySelector("form");
    const textArea = form.querySelector("textarea");
    form.style.position = "absolute";
    form.style.left = `${this.x}px`;
    form.style.top = `${this.y}px`; //set
    textArea.style.width = `300px`;
    textArea.style.height = `50px`;
  }
}
customElements.define("card-element", CardElement);