let lastFocusedEditable = null;
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

    const backCover = document.createElement("div");
    backCover.contentEditable = true;
    backCover.classList.add("page", "back-cover");
    backCover.textContent = "Back Cover";
    backCover.addEventListener("focus", () => lastFocusedEditable = backCover);
    const frontCover = document.createElement("div");
    frontCover.classList.add("page", "front-cover");
    frontCover.contentEditable = true;
    frontCover.addEventListener("focus", () => lastFocusedEditable = frontCover);
    const title = document.createElement("h2");
    title.textContent = "Front Cover Title";

    // feel free to fix this part, it's just a prototype
    const img = document.createElement("img");
    img.src = "../../assets/icons/example.png"; // custom image link
    img.alt = "Cover Image";
    img.style.width = "100%";
    img.style.height = "auto";
    img.style.display = "block";
    img.ondblclick = () => openCropper(img.src, img);

    const wrapper = document.createElement("div");
    wrapper.style.resize = "both";
    wrapper.style.overflow = "auto";
    wrapper.style.display = "inline-block";
    wrapper.style.border = "2px dashed #aaa";
    wrapper.contentEditable = "false";
    wrapper.appendChild(img);

    wrapper.addEventListener("click", (e) => {
      e.stopPropagation();
      const root = this.shadowRoot;
      root.querySelectorAll(".selected").forEach(el => el.classList.remove("selected"));
      wrapper.classList.add("selected");
    });

    const spacer = document.createElement("div");
    spacer.innerHTML = "<br>";

    const message = document.createElement("p");
    message.textContent = "Front Message";
    frontCover.append(title, wrapper, spacer, message);
    outside.append(backCover, frontCover);

    // Inside Contents
    const inside = document.createElement("div");
    inside.classList.add("card", "inside", "hidden");

    // Left page
    const leftWrapper = document.createElement("div");
    leftWrapper.classList.add("page-wrapper");
    const leftLabel = document.createElement("div");
    const leftPage = document.createElement("div");
    leftPage.contentEditable = true;
    leftPage.classList.add("page", "left");
    leftPage.textContent = "Left Page";
    leftWrapper.append(leftLabel, leftPage);

    // Right page
    const rightWrapper = document.createElement("div");
    rightWrapper.classList.add("page-wrapper");
    const rightLabel = document.createElement("div");
    const rightPage = document.createElement("div");
    rightPage.contentEditable = true;
    rightPage.classList.add("page", "right");
    rightPage.textContent = "Feel free to write your custom contents...";
    rightWrapper.append(rightLabel, rightPage);

    inside.append(leftWrapper, rightWrapper);
    container.append(outside, inside);

    this.shadowRoot.append(style, container);
    this._img = img;
    this._rightPage = rightPage;

    leftPage.addEventListener("focus", () => lastFocusedEditable = leftPage);
    rightPage.addEventListener("focus", () => lastFocusedEditable = rightPage);

    // Save image change
    img.addEventListener("load", () => {
      localStorage.setItem(this._storageKeys.imageURL, img.src);
    });

    // double-click any picture to re-crop 
    this.shadowRoot.addEventListener("dblclick", e => {
      if (e.target.tagName === "IMG") openCropper(e.target.src, e.target);
    });

    // Allow selecting/deselecting images for resizing + auto-wrap dragged images
    this.shadowRoot.addEventListener("click", e => {
      const root = this.shadowRoot;
      if (e.target.tagName === "IMG") {
        root.querySelectorAll(".selected").forEach(el => el.classList.remove("selected"));
        const wrapper = e.target.closest("div");

        if (wrapper && wrapper.style.resize) {
          // already wrapped
          wrapper.classList.add("selected");
        } else {
          // re-wrap orphaned img
          const img = e.target;
          const parent = img.parentNode;
          const newWrapper = document.createElement("div");
          newWrapper.style.resize = "both";
          newWrapper.style.overflow = "auto";
          newWrapper.style.display = "inline-block";
          newWrapper.style.border = "2px dashed #aaa";
          newWrapper.contentEditable = "false";
          newWrapper.classList.add("selected");
          img.replaceWith(newWrapper);
          newWrapper.appendChild(img);

          newWrapper.addEventListener("click", ev => {
            ev.stopPropagation();
            root.querySelectorAll(".selected").forEach(el => el.classList.remove("selected"));
            newWrapper.classList.add("selected");
          });

          const spacer = document.createElement("div");
          spacer.innerHTML = "<br>";
          parent.insertBefore(spacer, newWrapper.nextSibling);
        }
      } else {
        root.querySelectorAll(".selected").forEach(el => el.classList.remove("selected"));
      }
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
let activeCropper, targetImg;

/**
 * @param dataURL         image to show in Cropper
 * @param existingImg  null = user picked new file
 */
function openCropper(dataURL, existingImg = null) {
  //set the image to be cropped
  targetImg = existingImg;
  // show cropper modal and load image
  const modal = document.getElementById("cropper-modal");
  const img = document.getElementById("cropper-image");
  img.src = dataURL;
  modal.classList.remove("hidden");

  if (activeCropper) activeCropper.destroy();
  activeCropper = new Cropper(img, { viewMode: 1 });
}

function closeCropper() {
  // hide crop and destroy crop instance
  document.getElementById("cropper-modal").classList.add("hidden");
  if (activeCropper) { 
    activeCropper.destroy(); 
    activeCropper = null; 
  }
  targetImg = null;
}

window.addEventListener("DOMContentLoaded", () => {
  const okBtn = document.getElementById("crop-ok");
  const cancelBtn = document.getElementById("crop-cancel");

  if (!okBtn || !cancelBtn) return;

  okBtn.addEventListener("click", () => {
    if (!activeCropper) return;
    const dataURL = activeCropper.getCroppedCanvas().toDataURL("image/png");

    if (targetImg) {
      // user starts recroppoing an existing image
      targetImg.src = dataURL;  // replaced the existing one with the one after cropped
    } else {
      const card = document.querySelector("greeting-card");
      const root = card.shadowRoot;

      if (root.querySelector(".outside:not(.hidden)")) {
        // we are cropping in the outside cover
        if (lastFocusedEditable && lastFocusedEditable.classList.contains("back-cover")) {
          // user is editing the back cover
          const img = document.createElement("img"); // Create new image element
          img.src = dataURL;
          img.style.width = "100%";
          img.style.height = "auto";
          img.style.display = "block";
          img.ondblclick = () => openCropper(img.src, img);  // enable recropping

          const wrapper = document.createElement("div");
          wrapper.style.resize = "both";  // allow manually resize
          wrapper.style.overflow = "hidden";
          wrapper.style.display = "inline-block";
          wrapper.style.border = "2px dashed #aaa";
          wrapper.contentEditable = "false";
          wrapper.classList.add("selected");
          wrapper.appendChild(img);

          wrapper.addEventListener("click", (e) => {
            // enable reselecting the image on click
            e.stopPropagation();
            root.querySelectorAll(".selected").forEach(el => el.classList.remove("selected"));
            wrapper.classList.add("selected");
          });

          const spacer = document.createElement("div"); // add space after adding image for typing
          spacer.innerHTML = "<br>";
          lastFocusedEditable.appendChild(wrapper); // Insert the resizable image
          lastFocusedEditable.appendChild(spacer); // add the spacer we created
        }
        else if (lastFocusedEditable && lastFocusedEditable.classList.contains("front-cover")) {
          //cropping in the front cover
          // the logic is similar to the back cover
          const img = document.createElement("img");
          img.src = dataURL;
          img.style.width = "100%";
          img.style.height = "auto";
          img.style.display = "block";
          img.ondblclick = () => openCropper(img.src, img);

          const wrapper = document.createElement("div");
          wrapper.style.resize = "both";
          wrapper.style.overflow = "hidden";
          wrapper.style.display = "inline-block";
          wrapper.style.border = "2px dashed #aaa";
          wrapper.contentEditable = "false";
          wrapper.classList.add("selected");
          wrapper.appendChild(img);

          wrapper.addEventListener("click", (e) => {
            e.stopPropagation();
            root.querySelectorAll(".selected").forEach(el => el.classList.remove("selected"));
            wrapper.classList.add("selected");
          });

          const spacer = document.createElement("div");
          spacer.innerHTML = "<br>";
          lastFocusedEditable.appendChild(wrapper);
          lastFocusedEditable.appendChild(spacer);
        }

      } else if (lastFocusedEditable) {
        // for inside pages
        const img = document.createElement("img");
        img.src = dataURL;
        img.style.width = "100%";
        img.style.height = "auto";
        img.style.display = "block";
        img.ondblclick = () => openCropper(img.src, img);

        const wrapper = document.createElement("div");
        wrapper.style.resize = "both";
        wrapper.style.overflow = "hidden";
        wrapper.style.display = "inline-block";
        wrapper.style.border = "2px dashed #aaa";
        wrapper.contentEditable = "false";
        wrapper.classList.add("selected");
        wrapper.appendChild(img);

        wrapper.addEventListener("click", (e) => {
          e.stopPropagation();
          root.querySelectorAll(".selected").forEach(el => el.classList.remove("selected"));
          wrapper.classList.add("selected");
        });

        const spacer = document.createElement("div");
        spacer.innerHTML = "<br>";
        lastFocusedEditable.appendChild(wrapper);
        lastFocusedEditable.appendChild(spacer);
      }
    }

    closeCropper();
  });

  cancelBtn.addEventListener("click", closeCropper);
});