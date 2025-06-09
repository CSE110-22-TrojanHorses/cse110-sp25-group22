/**
 * A custom web component representing an interactive card element, which can be
 * a text box, shape, or image. Supports dragging, resizing, and editing.
 *
 * @class
 * @extends HTMLElement
 */
class CardElement extends HTMLElement {
  /**
   * Static counter used to assign a unique ID to each card element instance.
   * @type {number}
   * @static
   */
  static idCounter = 0;

  /**
   * Creates a new CardElement instance and initializes its shadow DOM and internal state.
   *
   * @constructor
   */
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.x = 0;
    this.y = 0;
    this.type = null;
    this.elem = null;
    this.writingToTextBox = false;
    this.isResizing = false;
    this.elemID = CardElement.idCounter++;
  }

  /**
   * Get the ID of an element
   * @returns {String}
   */
  getElemID() {
    return this.elemID;
  }

  /**
   * This is primarily used to set attributeChangedCallback.
   * Whenever setAttribute to type or pos are called,
   * attributeChangedCallback is called.
   * @returns {Array}
   */
  static get observedAttributes() {
    return ["type", "pos"];
  }

  /**
   * Only allows for type attribute (for determining which card element to make) to be set once.
   * If setAttribute called for position (used for initial position of element), send value into moveElem
   * @param {string} name
   * @param {string} oldVal
   * @param {string} newVal
   */
  attributeChangedCallback(name, oldVal, newVal) {
    if (name === "type") {
      if (oldVal == null) this.createCardElement(newVal);
    } else if (name === "pos") {
      if (oldVal !== newVal) this.moveElem(newVal);
    }
  }

  /**
   * Creates a custom card element according to the designated type through the parameter by calling
   * the respective function. Calls function that gives card elements dragability. Also creates custom event to globally know when
   * the card element was clicked (for purposes of selection and deletion).
   * @param {String} elemType
   */
  createCardElement(elemType) {
    let [parentType, subType] = elemType.split("-");
    this.type = parentType;
    if (parentType === "textBox") this.makeTextBox();
    else if (parentType === "shape")
      this.makeShape(subType); //subType is shapeType
    else if (parentType === "image") this.makeImage(subType); //subType is dataURL
    this.elem.addEventListener("click", (e) => {
      if (this.type === "textBox") {
        const rect = this.elem.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        const padding = 8;

        const isInsideTextArea =
          x > padding &&
          x < rect.width - padding &&
          y > padding &&
          y < rect.height - padding;
        if (isInsideTextArea) this.writingToTextBox = true;
        else this.writingToTextBox = false;
      }
      const event = new CustomEvent("elemClicked", {
        bubbles: true,
        composed: true,
        detail: [this.type, this.elem],
      });
      window.dispatchEvent(event);
    });
    this.makeDraggable(this.elem);
  }

  /**
   * Function that creates the textbox element. Which is just a textArea.
   * Sets id to textArea element.
   * @return {void}
   */
  makeTextBox() {
    const textArea = document.createElement("textarea");
    textArea.id = `${this.elemID}`;
    this.elem = textArea;
    textArea.placeholder = "Start text here...";
    // form.style.border = "1px solid red";
    this.shadow.appendChild(textArea);
    textArea.addEventListener("focus", () => {
      this.writingToTextBox = true;
    });
  }

  /**
   * Function that creates the shape element. Adds a resizer so shapes can be resized. As well as the resizer's
   * event handler so that the shape element can be resized properly.
   * @param {String} shapeType
   */
  makeShape(shapeType) {
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
      zIndex: "10",
    });
    shape.appendChild(resizer);

    resizer.addEventListener("mousedown", (e) => {
      e.stopPropagation();
      this.isResizing = true;
      document.addEventListener("mousemove", (b) => {
        if (!this.isResizing) return;
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

  /**
   * Function that create an image element from a URL. Adds a resizer so images can be resized. Similar kind of resizer with
   * similar properties as in shape element
   * @param {URL} dataURL
   */
  makeImage(dataURL) {
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
      zIndex: "10",
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

  /**
   * Takes in pos string which is in from x,y. That is split to get x and y,
   * for a given element, their initial position and size is set.
   * @param {string} url
   */
  moveElem(pos) {
    let [x, y] = pos.split(","); //gets str values of x and y
    this.x = Number(x);
    this.y = Number(y);
    if (this.type === "textBox") {
      const textArea = this.elem;
      textArea.style.position = "absolute";
      textArea.style.left = `${this.x}px`;
      textArea.style.top = `${this.y}px`; //set position
      textArea.style.width = `300px`;
      textArea.style.height = `50px`; //set initial size
      textArea.padding = `8px`;
    } else if (this.type === "shape") {
      const shape = this.elem;
      shape.style.position = "absolute";
      shape.style.left = `${this.x}px`;
      shape.style.top = `${this.y}px`; //set
    } else if (this.type === "image") {
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

  /**
   * Make the card element draggable by assigning the dragMouseDown function to the event-handler
   * onmousedown attribute
   * @param {CardElement} e
   */
  makeDraggable(elem) {
    let pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;

    elem.onmousedown = dragMouseDown;

    /**
     * Define functionality for movement with respect to mouse.
     * @param {MouseEvent} e
     */
    function dragMouseDown(e) {
      if (this.isResizing || this.writingToTextBox) return;
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }

    /**
     * Define functonality to drag an element by altering its positions
     * @param {MouseEvent} e
     */
    function elementDrag(e) {
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      elem.style.top = elem.offsetTop - pos2 + "px";
      elem.style.left = elem.offsetLeft - pos1 + "px";
    }

    /**
     * Stop drag by deactivating event-handler attributes
     */
    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }
}

customElements.define("card-element", CardElement);
