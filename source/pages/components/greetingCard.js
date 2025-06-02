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
    frontCover.append(title, img, message);

    outside.append(backCover, frontCover);

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
    leftWrapper.append(leftLabel, leftPage);

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
    rightWrapper.append(rightLabel, rightPage);

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
}

//handles toggle functionality
window.addEventListener("DOMContentLoaded", () => {
  const card = document.querySelector("greeting-card");
  const flipInside = document.getElementById("flip-inside");
  const flipOutside = document.getElementById("flip-outside");

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
