const PADDING = 8;

/**
 * A custom web component representing a greeting card editor.
 *
 * Provides editable front/back covers and inside pages, along with tools for
 * adding and customizing text, images, and shapes. Also handles card flipping,
 * color picking, and user interactions with added elements.
 *
 * @class
 * @extends HTMLElement
 */
class GreetingCard extends HTMLElement {
  /**
   * Constructor for the greeting card
   * Sets up styles, divs to be the card background (basically the canvas that we draw)
   * and also sets up event listeners relating to the greeting card
   */
  constructor() {
    super();
    // Setting all the vars that we will need
    this.facingInside = false;
    // Keep track of where the user last edited
    this.lastFocusedEditable = null;
    //Shadow Dom that we will be using
    this.attachShadow({ mode: "open" });
    // Set up listener ,styles, and the structure
    this.setupStyles();
    this.setupStructure();
    this.setupEventListeners();
    // Vars for the selected elems that are used later
    this.selectedElem;
    this.selectedElemType;
  }

  /**
   * Set style attributes
   * @return {void}
   */
  setupStyles() {
    const style = document.createElement("link");
    style.setAttribute("rel", "stylesheet");
    style.setAttribute("href", "cardFormat.css");
    this.shadowRoot.append(style);
  }

  /**
   * Initializes the DOM structure of the card element,
   * including the front/back covers, inside content, and color picker.
   * @return {void}
   */
  setupStructure() {
    // This is the container to encapsulate inside and outside
    const container = document.createElement("div");
    container.classList.add("card-container");

    // Outside cover of card
    const outside = document.createElement("div");
    outside.classList.add("card", "outside");

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

    //color picker
    const colorPicker = document.createElement("input");
    colorPicker.id = "colorPicker";
    colorPicker.type = "color";
    colorPicker.style.display = "none";
    this.shadowRoot.append(colorPicker);
  }

  /**
   * Attaches all relevant event listeners to the card element,
   * including click, mouseover, color picking, and delete key handling.
   * @returns {void}
   */
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

  /**
   * Handles the clicks for the background
   *
   * @param {MouseEvent} e
   */
  handleClick(e) {
    const toolBar = document.getElementById("tBar");
    // add text box at the cursor position
    if (toolBar.getMode() === "textBox") {
      this.addCardElement("textBox", e.clientX, e.clientY);
      // add the users shape
    } else if (toolBar.getMode() === "shape") {
      let shapeType = toolBar.selectedShape;
      if (shapeType) {
        this.addCardElement(`shape-${shapeType}`, e.clientX, e.clientY);
      } else console.error("Shape type not picked yet!");
      // add it as an image
    } else if (toolBar.getMode() === "image") {
      if (toolBar.getImageReady()) {
        let dataURL = toolBar.getDataURL();
        this.addCardElement(`image-${dataURL}`, e.clientX, e.clientY);
      }
    }
    // reset tool bar to prevent duplicate actions and bugs
    toolBar.resetMode();
  }

  /**
   * Change cursor according to mode that tool bar is in.
   */
  handleMouseOver() {
    const toolBar = document.getElementById("tBar");
    //to change cursor if in different mode on card

    if (toolBar.getMode() === "textBox") {
      this.style.cursor = "text"; //when in text mode cursor changes!
    } else {
      this.style.cursor = "pointer";
    }
  }

  /**
   * Handles event for clicking on a card element. If the element is a shape, show
   * the color picker. Display a resizer for all the elements. Make the become the newly
   * selected element. Adds border around selected element. Also handles selecting another
   * card element or just clicking away in an empty part of the card (resets values,
   * gets rid of color picker, and gets rid of borrder around old selected element)
   * @param {elemClicked} e
   * @returns {void}
   */
  handleElemClicked(e) {
    const colorPicker = this.shadowRoot.getElementById("colorPicker");
    let [type, elem] = e.detail;

    //border on click
    if (this.selectedElem) {
      this.selectedElem.style.border = "none";
    }
    if (elem != null) {
      elem.style.border = "2px solid cornflowerblue";
      if (type !== "textBox") {
        const resizer = elem.querySelector(".resizer");
        resizer.style.backgroundColor = "black";
      } else if (type === "textBox") {
        elem.style.resize = "both";
      } else console.error("Selected elem should not be null!");
    }

    //get xy of elem (to decide where to put colorpicker)

    let rect = elem.getBoundingClientRect();
    let x = rect.left;
    let y = rect.top;
    let height = rect.height;
    //set color picker
    if (type === "shape") {
      colorPicker.style.display = "block";
      colorPicker.style.position = "absolute";
      colorPicker.style.left = `${x}px`;
      colorPicker.style.top = `${y + height}px`;
    } else {
      colorPicker.style.display = "none";
    }
    this.selectedElem = elem;
    this.selectedElemType = type;

    //if click outside an element, want to hide colorPicker
    //check for existing global listeners: remove them
    if (this._outsideClickListener) {
      document.removeEventListener("click", this._outsideClickListener);
    }
    //set up an listener to see if any clicks happen
    this._outsideClickListener = (event) => {
      const path = event.composedPath();
      const elementClicked = path.includes(this.selectedElem);
      const pickerClicked = path.includes(colorPicker);

      if (!elementClicked && !pickerClicked) {
        if (this.selectedElem) {
          this.selectedElem.style.border = "none";
          if (this.selectedElemType !== "textBox") {
            const resizer = this.selectedElem.querySelector(".resizer");
            resizer.style.backgroundColor = "transparent";
          } else if (this.selectedElemType === "textBox") {
            this.selectedElem.style.resize = "none"; //gets rid of resizer
          }
        }
        colorPicker.style.display = "none";
        this.selectedElem = null;
        this.selectedElemType = null;
        //now remove global listener
        document.removeEventListener("click", this._outsideClickListener);
        this._outsideClickListener = null;
      }
    };

    setTimeout(() => {
      document.addEventListener("click", this._outsideClickListener);
    }, 100);
  }

  /**
   * Handles color picking by applying the selected color to the currently selected element.
   * @param {Event} e - The input event triggered when the user picks a color.
   * @returns {void}
   */
  handlePickColor(e) {
    if (this.selectedElem) {
      const color = e.target.value;
      this.selectedElem.style.backgroundColor = color;
    }
  }

  /**
   * Delete selected element when backspace is pressed
   * and prevents deleting the text box by accident
   * @param {Event} e
   */
  handlerDeleteSelectedElem(e) {
    if (this.selectedElem) {
      const host = this.selectedElem.getRootNode().host;
      if (this.selectedElemType === "textBox" && host.writingToTextBox) {
        return;
      }
      if ((e.key === "Backspace" || e.key === "Delete") && this.selectedElem) {
        this.selectedElem.remove();
        this.selectedElem = null;
        const colorPicker = this.shadowRoot.getElementById("colorPicker");
        colorPicker.style.display = "none";
      }
    }
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

      if (tag === "TEXTAREA") {
        cardContent.value = value;
      }
      if (tag === "IMG") {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/*";
        fileInput.style.display = "none";

        cardContent.style.cursor = "pointer";
        cardContent.addEventListener("click", () => fileInput.click());

        fileInput.addEventListener("change", (e) => {
          const file = e.target.files[0];
          if (file) {
            const validTypes = ["image/png", "image/jpeg"];
            if (!validTypes.includes(file.type)) {
              alert("Please select a PNG or JPG image.");
              fileInput.value = "";
              return;
            }
            const reader = new FileReader();
            reader.onload = (event) => {
              cardContent.src = event.target.result;
            };
            reader.readAsDataURL(file);
          }
        });

        container.appendChild(fileInput); // ⬅️ add the hidden input to the DOM
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
   * show the outside of the face card
   * and hide the inside
   *
   * @returns {void}
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

  /**
   * Access the color picker element
   * @returns {void}
   */
  getColorPicker() {
    return this.shadowRoot.getElementById("colorPicker");
  }

  /**
   * Adds a new card-element of the specified type to the currently visible card face (inside or outside),
   * positioning it based on the provided x and y coordinates.
   *
   * @param {string} type - The type of card element to create (e.g., "textBox", "shape-circle", "image-[dataURL]").
   * @param {number} x - The x-coordinate relative to the click position on the page.
   * @param {number} y - The y-coordinate relative to the click position on the page.
   * @returns {void}
   */
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
    cardFace.append(cardElem);
  }
}

/**
 * Handles toggle functionality of flipping the card.
 */
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
  //separate event handlers
  flipInside.addEventListener("click", () => {
    card.showInside();
    flipInside.classList.add("hidden");
    flipOutside.classList.remove("hidden");
    card.facingInside = true;
  });

  // flip back to the outside
  flipOutside.addEventListener("click", () => {
    card.showOutside();
    flipOutside.classList.add("hidden");
    flipInside.classList.remove("hidden");
    card.facingInside = false;
  });
});

customElements.define("greeting-card", GreetingCard);
