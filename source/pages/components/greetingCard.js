const PADDING = 16;

class GreetingCard extends HTMLElement {
  constructor() {
    super();
    this.facingInside = false;
    this.attachShadow({ mode: "open" });
    const style = document.createElement("link");
    style.setAttribute("rel", "stylesheet");
    style.setAttribute("href", "cardFormat.css");

    // This is the container to encapsulate inside and outside
    const container = document.createElement("div");
    container.classList.add("card-container");

    // Outside covers
    const outside = document.createElement("div");
    outside.classList.add("card", "outside");

    const backCover = document.createElement("input");
    backCover.setAttribute("type", "text");
    backCover.setAttribute("value", "Back Cover");
    backCover.classList.add("page", "back-cover");
    const frontCover = document.createElement("div");
    frontCover.classList.add("page", "front-cover");
    frontCover.contentEditable = true;
    const title = document.createElement("h2");
    title.textContent = "Front Cover Title";

    // feel free to fix this part, it's just a prototype
    const img = document.createElement("img");
    img.src = "../../assets/icons/example.png"; // custom image link
    img.alt = "Cover Image";
    img.classList.add("cover-image");
    const message = document.createElement("p");
    message.textContent = "Front Message";
    // frontCover.append(title, img, message);
    // outside.append(backCover, frontCover);

    // Inside Contents
    const inside = document.createElement("div");
    inside.classList.add("card", "inside", "hidden");

    // Left page
    const leftWrapper = document.createElement("div");
    leftWrapper.classList.add("page-wrapper");
    const leftLabel = document.createElement("div");
    const leftPage = document.createElement("input");
    leftPage.setAttribute("type", "text");
    leftPage.setAttribute("placeholder", "Left Page");
    leftPage.classList.add("page", "left");
    // leftWrapper.append(leftLabel, leftPage);

    // Right page
    const rightWrapper = document.createElement("div");
    rightWrapper.classList.add("page-wrapper");
    const rightLabel = document.createElement("div");
    const rightPage = document.createElement("input");
    rightPage.setAttribute("type", "text");
    rightPage.setAttribute(
      "placeholder",
      "Feel free to write your custom contents..."
    );
    rightPage.classList.add("page", "right");
    // rightWrapper.append(rightLabel, rightPage);

    inside.append(leftWrapper, rightWrapper);
    container.append(outside, inside);

    this.shadowRoot.append(style, container);
    this._img = img;
    this._rightPage = rightPage;
    
    // Save image change
    img.addEventListener("load", () => {
      localStorage.setItem(this._storageKeys.imageURL, img.src);
    });
  }

  // when we show inside contents, we should hide outside cover
  showInside() {
    this.shadowRoot.querySelector(".inside").classList.remove("hidden");
    this.shadowRoot.querySelector(".outside").classList.add("hidden");
  }

  // when we show outside covers, we should hide inside contents
  showOutside() {
    this.shadowRoot.querySelector(".inside").classList.add("hidden");
    this.shadowRoot.querySelector(".outside").classList.remove("hidden");
  }

  setCoverImage(url) {
    //set image by url. might be useful
    if (this._img) {
      this._img.src = url;
    }
  }

  addCardElement(type, x, y) {
    let cardFace;
    if (this.facingInside)
      cardFace = this.shadowRoot.querySelector(".inside");
    else{
      cardFace = this.shadowRoot.querySelector(".outside");
    }
    let rect = cardFace.getBoundingClientRect(); //this used to get position properties of the cardFace
    let newX = x - rect.left - PADDING;
    let newY = y - rect.top - PADDING;
    console.log(`${newX}, ${newY}`);
    //handles all
    const cardElem = document.createElement("card-element");

    cardElem.setAttribute("type", type);
    cardElem.setAttribute("pos", `${newX},${newY}`);
    // console.log("Appending card element:", cardElem);
    cardFace.append(cardElem);
    // if (type === "textBox") {
    //   const cardElem = document.createElement("card-element");
    //   cardElem.setAttribute("type", "textBox");
    //   cardElem.setAttribute("pos", `${newX},${newY}`);
    //   // console.log("Appending card element:", cardElem);
    //   cardFace.append(cardElem);
    // }
    // else if(type === "shape") {
    //   const cardElem = document.createElement("card-element");
    //   cardElem.setAttribute("type", "shape");
    //   cardElem.setAttribute("pos", `${newX},${newY}`);
    //   // console.log("Appending card element:", cardElem);
    //   cardFace.append(cardElem);
    // }
    // else if(type === "image"){
    //   //something
    // }
  }
}



//handles toggle functionality
window.addEventListener("DOMContentLoaded", () => {
  const card = document.querySelector("greeting-card");
  const flipInside = document.getElementById("flip-inside");
  const flipOutside = document.getElementById("flip-outside");
  let toolBar = document.getElementById("tBar");
  console.log(toolBar);
  flipInside.addEventListener("click", () => {
    card.showInside();
    flipInside.classList.add("hidden");
    flipOutside.classList.remove("hidden");
    card.facingInside = true;
  });

  flipOutside.addEventListener("click", () => {
    card.showOutside();
    flipOutside.classList.add("hidden");
    flipInside.classList.remove("hidden");
    card.facingInside = false;
  });

  //to change cursor if in different mode on card
  card.addEventListener("mouseover", () => {
    
    if(toolBar.getMode() === "textBox"){
      card.style.cursor = "text";//when in text mode cursor changes!
      // console.log("Bruh");
    }
    else{
      card.style.cursor = "pointer";
    }
  });

//for clicking on card
card.addEventListener("click", (e) => {
  // console.log(e.target.tagName);
  console.log(toolBar.mode)
  if (toolBar.getMode() === "textBox") {
    card.addCardElement("textBox", e.clientX, e.clientY);
    console.log("Added text box element!");
  }
  if(toolBar.getMode() === "shape"){
    let shapeType = toolBar.selectedShape;
    if(shapeType){
      card.addCardElement(`shape-${shapeType}`, e.clientX, e.clientY);
      console.log("Added shape");
    }
    else
      console.error("Shape type not picked yet!");
  }
 else {
    console.log("Not saved", e.target.value);

  }
});


});

customElements.define("greeting-card", GreetingCard);
