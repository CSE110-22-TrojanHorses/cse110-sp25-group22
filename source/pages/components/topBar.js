// components/toolBar.js
class ToolBar extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });

    const featureIcons = document.createElement("div");
    featureIcons.className = "featureicons";
    const style = document.createElement("style");
    style.textContent = `
      .featureicons {
        position: relative;
        left: 56px;
        top: 50px;
        z-index: 2;
        display: flex;
        flex-direction: column;
        gap: 2rem;
      }
      button {
        border: none;
        background: none;
        cursor: pointer;
      }
      button:hover {
        background-color: rgb(244, 192, 127);
        border-radius: 4px;
      }
      .select { bottom: 335px; }
      .addText { bottom: 250px; }
      .shapes { bottom: 165px; }
      .addImage { bottom: 80px; }
    `;

    shadow.appendChild(style);
    shadow.appendChild(featureIcons);

    const iconFiles = [
      "select.png",
      "add-image.png",
      "shapes.png",
      "upload-icon.png"
    ];

    iconFiles.forEach((file, i) => {
      const button = document.createElement("button");
      button.innerHTML = `<img src="../../assets/icons/tool-bar-icons/${file}" alt="icon">`;

      switch (i) {
        case 1:
          if (!window.__fileInput) {
            window.__fileInput = document.createElement("input");
            window.__fileInput.type = "file";
            window.__fileInput.accept = "image/*";
            window.__fileInput.style.display = "none";
            document.body.appendChild(window.__fileInput);

            window.__fileInput.addEventListener("change", () => {
              const f = window.__fileInput.files[0];
              if (!f) return;
              const reader = new FileReader();
              reader.onload = e => openCropper(e.target.result);
              reader.readAsDataURL(f);
              window.__fileInput.value = "";
            });
          }
          button.addEventListener("click", () => window.__fileInput.click());
          button.className = "addImage";
          break;

        default:
          break;
      }

      featureIcons.appendChild(button);
    });
  }
}
customElements.define("tool-bar", ToolBar);


// components/greetingCard.js additions (append after class definition)
let activeCropper, targetImg;

function openCropper(dataURL, existingImg = null) {
  targetImg = existingImg;
  const modal = document.getElementById("cropper-modal");
  const img = document.getElementById("cropper-image");
  img.src = dataURL;
  modal.classList.remove("hidden");

  if (activeCropper) activeCropper.destroy();
  activeCropper = new Cropper(img, { viewMode: 1 });
}

function closeCropper() {
  document.getElementById("cropper-modal").classList.add("hidden");
  if (activeCropper) {
    activeCropper.destroy();
    activeCropper = null;
  }
  targetImg = null;
}

// Attach cropper‑modal buttons *after* the whole DOM exists so the elements are guaranteed
// to be present (fixes the “buttons do nothing” bug).
window.addEventListener("DOMContentLoaded", () => {
  const okBtn     = document.getElementById("crop-ok");
  const cancelBtn = document.getElementById("crop-cancel");
  if (!okBtn || !cancelBtn) return; // modal might not be injected on some pages

  okBtn.addEventListener("click", () => {
    if (!activeCropper) return;
    const dataURL = activeCropper.getCroppedCanvas().toDataURL("image/png");

    /* — Insert or replace — */
    if (targetImg) {
      targetImg.src = dataURL; // re‑crop existing
    } else {
      const card = document.querySelector("greeting-card");
      const root = card.shadowRoot;
      if (root.querySelector(".outside:not(.hidden)")) {
        // we’re on the cover – replace the cover picture
        root.querySelector(".cover-image").src = dataURL;
      } else {
        // we’re viewing INSIDE – add to left page
        const left = root.querySelector(".left.page-wrapper, .left") || root.querySelector(".left");
        const img  = document.createElement("img");
        img.src    = dataURL;
        img.style.width = "100%";
        left.appendChild(img);
        img.ondblclick = () => openCropper(img.src, img);
      }
    }
    closeCropper();
  });

  cancelBtn.addEventListener("click", closeCropper);
});


// Inside the greeting-card constructor
this.shadowRoot.addEventListener("dblclick", e => {
  if (e.target.tagName === "IMG") openCropper(e.target.src, e.target);
});
