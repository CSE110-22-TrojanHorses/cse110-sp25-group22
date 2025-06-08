class GreetingCard extends HTMLElement {
  constructor() {
    super();
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

  // handles toggle functionality
  flipInside.addEventListener("click", () => {
    card.showInside();
    flipInside.classList.add("hidden");
    flipOutside.classList.remove("hidden");
  });

  flipOutside.addEventListener("click", () => {
    card.showOutside();
    flipOutside.classList.add("hidden");
    flipInside.classList.remove("hidden");
  });
});

customElements.define("greeting-card", GreetingCard);
