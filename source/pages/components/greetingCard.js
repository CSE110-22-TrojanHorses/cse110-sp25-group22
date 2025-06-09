const PADDING = 16;

class GreetingCard extends HTMLElement {
  constructor() {
    super();
    this.facingInside = false;
    this.lastFocusedEditable = null;
    this.attachShadow({ mode: "open" });
    this.setupStyles();
    this.setupStructure();
    this.setupEventListeners();
    this.selectedElem;
  }

  setupStyles() {
    const style = document.createElement("link");
    style.setAttribute("rel", "stylesheet");
    style.setAttribute("href", "cardFormat.css");
    this.shadowRoot.append(style);
  }

  setupStructure() {
    // This is the container to encapsulate inside and outside
    const container = document.createElement("div");
    container.classList.add("card-container");

    // Outside cover of card
    const outside = document.createElement("div");
    outside.classList.add("card", "outside");

<<<<<<< HEAD
    const backCover = document.createElement("div");
    backCover.contentEditable = true;
    backCover.classList.add("page", "back-cover");
    backCover.textContent = "Back Cover";
    backCover.addEventListener(
      "focus",
      () => (this.lastFocusedEditable = backCover)
    );
    const frontCover = document.createElement("div");
    frontCover.classList.add("page", "front-cover");
    frontCover.contentEditable = true;
    frontCover.addEventListener(
      "focus",
      () => (this.lastFocusedEditable = frontCover)
    );

    // Inside Contents of card
    const inside = document.createElement("div");
    inside.classList.add("card", "inside", "hidden");

    container.append(outside, inside);
    this.shadowRoot.append(container);

    //colr picker
    const colorPicker = document.createElement("input");
    colorPicker.id = "colorPicker";
    colorPicker.type = "color";
    colorPicker.style.display = "none";
    this.shadowRoot.append(colorPicker);
  }

  setupEventListeners() {
    this.addEventListener("click", this.handleClick.bind(this));
    this.addEventListener("mouseover", this.handleMouseOver.bind(this));
    window.addEventListener("elemClicked", this.handleElemClicked.bind(this));
    document.addEventListener(
      "keydown",
      this.handlerDeleteSelectedElem.bind(this)
    );
    const colorPicker = this.shadowRoot.getElementById("colorPicker");
    colorPicker.addEventListener("input", this.handlePickColor.bind(this));
  }

  handleClick(e) {
    const toolBar = document.getElementById("tBar");
    if (toolBar.getMode() === "textBox") {
      this.addCardElement("textBox", e.clientX, e.clientY);
    } else if (toolBar.getMode() === "shape") {
      let shapeType = toolBar.selectedShape;
      if (shapeType) {
        this.addCardElement(`shape-${shapeType}`, e.clientX, e.clientY);
      } else console.error("Shape type not picked yet!");
    } else if (toolBar.getMode() === "image") {
      if (toolBar.getImageReady()) {
        let dataURL = toolBar.getDataURL();
        console.log(dataURL);
        this.addCardElement(`image-${dataURL}`, e.clientX, e.clientY);
      }
    } else if (toolBar.getMode() === "edit") {
      // searchCardElem()
    } else {
      // console.log("Not saved", e.target.value);
    }
    toolBar.resetMode();
  }

  handleMouseOver() {
    const toolBar = document.getElementById("tBar");
    //to change cursor if in different mode on card

    if (toolBar.getMode() === "textBox") {
      this.style.cursor = "text"; //when in text mode cursor changes!
      // console.log("Bruh");
    } else {
      this.style.cursor = "pointer";
    }
  }

  handleElemClicked(e) {
    const colorPicker = this.shadowRoot.getElementById("colorPicker");
    let [elemID, elem] = e.detail;

    //border on click
    if (this.selectedElem) {
      this.selectedElem.style.border = "none";
    }
    if (elem != null) {
      elem.style.border = "2px solid cornflowerblue";
    }

    //get xy of elem (to decide where to put colorpicker)

    let rect = elem.getBoundingClientRect();
    let x = rect.left;
    let y = rect.top;
    let height = rect.height;
    //set color picker
    colorPicker.style.display = "block";
    colorPicker.style.position = "absolute";
    colorPicker.style.left = `${x}px`;
    colorPicker.style.top = `${y + height}px`;
    this.selectedElem = elem;

    //if click outside an element, want to hide colorPicker
    //check for existing global listeners: remove them
    if (this._outsideClickListener) {
      document.removeEventListener("click", this._outsideClickListener);
    }
    //set up an listener to see if any clicks happen
    this._outsideClickListener = (event) => {
      const elementClicked = this.selectedElem.contains(event.target);
      const pickerClicked = colorPicker.contains(event.target);
      if (!elementClicked && !pickerClicked) {
        this.selectedElem.style.border = "none";
        colorPicker.style.display = "none";
        this.selectedElem = null;
        //now remove global listener
        document.removeEventListener("click", this._outsideClickListener);
        this._outsideClickListener = null;
      }
    };

    setTimeout(() => {
      document.addEventListener("click", this._outsideClickListener);
    }, 100);
  }

  handlePickColor(e) {
    const toolBar = document.getElementById("tBar");
    // toolBar.shapeType;
    if (this.selectedElem) {
      const color = e.target.value;
      if (toolBar.selectedShape == "triangle") {
        this.selectedElem.style["border-bottom-color"] = color;
      }
      this.selectedElem.style.backgroundColor = color;
    }
  }

  handlerDeleteSelectedElem(e) {
    if (this.selectedElem) {
      const host = this.selectedElem.getRootNode().host;
      // console.log(this.selectedElem);
      console.log(host.writingToTextBox);
      console.log(host.type);
      if (host.type === "textBox" && host.writingToTextBox) {
        // console.lo
        return;
      }
      if ((e.key === "Backspace" || e.key === "Delete") && this.selectedElem) {
        this.selectedElem.remove();
        this.selectedElem = null;
      }
    }
=======
    // Inside Contents
    const inside = document.createElement("div");
    inside.classList.add("card", "inside", "hidden");

    // Back page
    const backCover = document.createElement("div");
    backCover.classList.add("page-wrapper", "back");

    // Front page
    const frontCover = document.createElement("div");
    frontCover.classList.add("page-wrapper", "front");

    // Left page
    const leftWrapper = document.createElement("div");
    leftWrapper.classList.add("page-wrapper", "left");

    // Right page
    const rightWrapper = document.createElement("div");
    rightWrapper.classList.add("page-wrapper", "right");

    outside.append(backCover, frontCover);
    inside.append(leftWrapper, rightWrapper);
    container.append(outside, inside);
    this.shadowRoot.append(style, container);
  }

  /**
   * Initializes greeting card content
   */
  init() {
    // Get pages from document
    const backCover = this.shadowRoot.querySelector(".page-wrapper.back");
    const frontCover = this.shadowRoot.querySelector(".page-wrapper.front");
    const leftWrapper = this.shadowRoot.querySelector(".page-wrapper.left");
    const rightWrapper = this.shadowRoot.querySelector(".page-wrapper.right");

    // Back elements
    const backText = document.createElement("input");
    backText.setAttribute("type", "text");
    backText.setAttribute("placeholder", "Back Cover");
    backText.classList.add("page", "back");
    backCover.append(backText);

    // Front elements
    frontCover.contentEditable = true;
    const title = document.createElement("input");
    title.setAttribute("type", "text");
    title.setAttribute("value", "Front Cover Title");
    const img = document.createElement("img");
    img.src = "../../assets/icons/example.png";
    img.alt = "Cover Image";
    img.classList.add("cover-image");
    const message = document.createElement("input");
    message.setAttribute("type", "text");
    message.setAttribute("value", "Front Message");
    frontCover.append(title, img, message);

    // Left page elements
    const leftPage = document.createElement("input");
    leftPage.setAttribute("type", "text");
    leftPage.setAttribute("placeholder", "Left Page");
    leftPage.classList.add("page", "left");
    leftWrapper.append(leftPage);

    // Right page elements
    const rightPage = document.createElement("input");
    rightPage.setAttribute("type", "text");
    rightPage.setAttribute(
      "placeholder",
      "Feel free to write your custom contents..."
    );
    rightPage.classList.add("page", "right");
    rightWrapper.append(rightPage);

    this._img = img;
    this._rightPage = rightPage;
  }

  /**
   * Fills greeting card content based on stored data with specified key
   * @param {string} key - key to use to get the stored data
   */
  loadData(key) {
    // Get pages from document
    const backCover = this.shadowRoot.querySelector(".page-wrapper.back");
    const frontCover = this.shadowRoot.querySelector(".page-wrapper.front");
    const leftWrapper = this.shadowRoot.querySelector(".page-wrapper.left");
    const rightWrapper = this.shadowRoot.querySelector(".page-wrapper.right");

    // Get card data
    const cardData = JSON.parse(localStorage.getItem(key));
    this.populateContainer(backCover, cardData.backElements);
    this.populateContainer(frontCover, cardData.frontElements);
    this.populateContainer(leftWrapper, cardData.leftElements);
    this.populateContainer(rightWrapper, cardData.rightElements);
>>>>>>> 25dbf756131de0752b63323ef8848caf5aa80425
  }

  /**
   * Adds elements to container based on stored card data
   * @param {HTMLElement} container - container where the elements are added to
   * @param {Array} elementList - list of elements to add
   */
  populateContainer(container, elementList) {
    for (const elementInfo of elementList) {
      const { tag, attributes = {}, value = "" } = elementInfo;
      const cardContent = document.createElement(tag);

      if (attributes) {
        Object.entries(attributes).forEach(([key, val]) =>
          cardContent.setAttribute(key, val)
        );
      }

      if (tag === "INPUT") {
        cardContent.value = value;
      }

      container.appendChild(cardContent);
    }
  }

  /**
   * Hide outside contents and show inside contents
   */
  showInside() {
    this.shadowRoot.querySelector(".inside").classList.remove("hidden");
    this.shadowRoot.querySelector(".outside").classList.add("hidden");
  }

  /**
   * Hide inside contents and show outside contents
   */
  showOutside() {
    this.shadowRoot.querySelector(".inside").classList.add("hidden");
    this.shadowRoot.querySelector(".outside").classList.remove("hidden");
  }

  /**
   * Sets the image source to the given URL
   * @param {URL} url
   */
  setCoverImage(url) {
    //set image by url. might be useful
    if (this._img) {
      this._img.src = url;
    }
  }

  getColorPicker() {
    return this.shadowRoot.getElementById("colorPicker");
  }

  addCardElement(type, x, y) {
    let cardFace;
    if (this.facingInside) cardFace = this.shadowRoot.querySelector(".inside");
    else {
      cardFace = this.shadowRoot.querySelector(".outside");
    }
    let rect = cardFace.getBoundingClientRect(); //this used to get position properties of the cardFace
    let newX = x - rect.left - PADDING;
    let newY = y - rect.top - PADDING;

    const cardElem = document.createElement("card-element");
    cardElem.setAttribute("type", type);
    cardElem.setAttribute("pos", `${newX},${newY}`);
    // console.log("Appending card element:", cardElem);
    cardFace.append(cardElem);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const card = document.querySelector("greeting-card");

  // loads data if the current card data exists in storage, otherwise initialize card with default
  if (localStorage.getItem("current card")) {
    const key = localStorage.getItem("current card");
    if (localStorage.getItem(key)) {
      card.loadData(key);
    } else {
      card.init();
    }
  } else {
    card.init();
  }
  const flipInside = document.getElementById("flip-inside");
  const flipOutside = document.getElementById("flip-outside");
<<<<<<< HEAD
  //separate event handlers
=======

  // handles toggle functionality
>>>>>>> 25dbf756131de0752b63323ef8848caf5aa80425
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
});

customElements.define("greeting-card", GreetingCard);
