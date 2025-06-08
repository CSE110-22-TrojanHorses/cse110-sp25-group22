/**
 * A handcrafted greeting card Web Component.
 * Editable front, back, and inside pages — think arts & crafts, minus the glue.
 * @customElement
 * @extends HTMLElement
 */
class GreetingCard extends HTMLElement {
  /**
   * Builds the greeting card UI, wires up DOM structure,
   * loads external styles, and hides the inside until flipped.
   */
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    // Link the stylesheet because plain HTML just won’t cut it
    const style = document.createElement("link");
    style.setAttribute("rel", "stylesheet");
    style.setAttribute("href", "cardFormat.css");

    // Root container that holds both outside and inside of the card
    const container = document.createElement("div");
    container.classList.add("card-container");

    // Outside covers of the card
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

    // Placeholder image for now, replace as needed
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
    // Attach everything to the shadow of DOM :), kidding just the shadow DOM
    this.shadowRoot.append(style, container);
    // Cache for later use
    this._img = img;
    this._rightPage = rightPage;

    // Save image src to local storage when it loads. you know what they say, "presistance is the ... i forogot the rest"
    img.addEventListener("load", () => {
      localStorage.setItem(this._storageKeys.imageURL, img.src);
    });
  }


  /**
   * Shows the inside pages of the card.
   * Useful for when you’re feeling introspective.
   */
  showInside() {
    this.shadowRoot.querySelector(".inside").classList.remove("hidden");
    this.shadowRoot.querySelector(".outside").classList.add("hidden");
  }
  /**
   * Shows the front and back covers of the card.
   * Because sometimes the message can wait.
   */
  showOutside() {
    this.shadowRoot.querySelector(".inside").classList.add("hidden");
    this.shadowRoot.querySelector(".outside").classList.remove("hidden");
  }
  /**
   * Changes the cover image.
   * @param {string} url - Direct link to a new image.
   */
  setCoverImage(url) {
    if (this._img) {
      this._img.src = url;
    }
  }
}

/**
 * Hook up flip buttons after the DOM has settled.
 * Enables toggling between card front and inside views.
 */
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
/**
 * Registers the <greeting-card> custom element.
 * This is necessary for the browser to recognize it as a custom element.
 */
customElements.define("greeting-card", GreetingCard);
