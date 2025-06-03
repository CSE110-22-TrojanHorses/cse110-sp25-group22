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
    if(name === "type"){
        this.createElement(newVal)
    } else if(name === "pos"){
        this.moveElem(newVal);
    }

  }

  createElement(type){
    if(type === "textBox")
        this.makeTextBox();
  }
  
  makeTextBox(){
    const form = document.createElement("form");
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Start text here...";
    form.appendChild(input);
    this.shadow.appendChild(form);
  }

//   makeShape(shadow){

//   }

//   makeImage(shadow){
//     const image
//   }
  moveElem(pos){

  }
}
customElements.define("card-element", CardElement);