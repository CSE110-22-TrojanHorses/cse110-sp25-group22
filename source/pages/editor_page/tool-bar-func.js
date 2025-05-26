/*const Mode = {
    SCROLL: 0,
    EDIT: 1
};*/ //can add more modes later on, we will work with this for right now
class ToolBar extends HTMLElement {
  toolBarStyleContent = `
        html, body, main {width: 100%; height: 100%;}

        .pagetop {
            position: relative;
            height: 80px;
            width: 110%;
            margin-top: -9px;
            margin-left: -9px;
        }

        .topsquare {
            height: 80px;
            width: 110%;
            top: 0px;
            background-color: black;
            position: absolute;
            z-index: 1;
        }

        .topleftimg {
            position: absolute;
            top: 20px;
            left: 20px;
            background-color: black;
            z-index: 2;
        }

        .toprightimg {
            position: absolute;
            top: 20px;
            left: 95vw;
            background-color: black;
            z-index: 2;
        }

        img {
            height: 44px;
            width: 44px;
        }

        .save {
            position: absolute;
            z-index: 2;
            left: 100px;
            top: 20px;
        }

        .download {
            position: absolute;
            z-index: 2;
            left: 180px;
            top: 20px;
        }

        .share {
            position: absolute;
            z-index: 2;
            left: 260px;
            top: 20px;
        }

        .flip {
            position: absolute;
            border: black;
            border-width: 2px;
            border-style: solid;
            background: white;
            top: 140px;
            left: 722px;
        }

        button {
            border: none;
            background: none;
        }

        button:hover {
            background-color: rgb(244, 192, 127);
        }

        .featurebar {
            height: 350px;
            width: 100px;
            margin-top: 100px;
            margin-left: 30px;
            border-width: 5px;
            border-style: solid;
            border-radius: 1cm;
            border-color: black;
            background-color: transparent;
            z-index: 1;
        }

        .featureicons {
            position: relative;
            left: 56px;
            top: 50px;
            z-index: 2;
        }

        .select {
            position: absolute;
            bottom: 335px;
        }

        .addText {
            position: absolute;
            bottom: 250px;
        }

        .shapes {
            position: absolute;
            bottom: 165px;
        }

        .addImage {
            position: absolute;
            bottom: 80px;
        }

        .cardFront {
            position: absolute;
            height: 346px;
            width: 596px;
            background-color: black;
            top: 193.5px;
            left: 422px;
            border-width: 2px;
            border-style: solid;
            border-color: black;
            background-color: transparent;
        }

        body {
            overflow: hidden;
        }
    `;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    const featureIcons = document.createElement("div");
    featureIcons.className = "featureicons";

    // define this.buttons
    this.buttons = [];

    for (let i = 0; i < 4; i++) {
      let button = document.createElement("button");
      this.customizeButton(button, i);
      this.buttons.push(button);
      featureIcons.appendChild(button);
    }

    // Create and configure color picker
    const colorWrapper = document.createElement("div");
    colorWrapper.style.marginTop = "300px";
    colorWrapper.style.textAlign = "center";

    const colorCircle = document.createElement("div");
    colorCircle.id = "color-circle";
    colorCircle.style.width = "24px";
    colorCircle.style.height = "24px";
    colorCircle.style.borderRadius = "50%";
    colorCircle.style.backgroundColor = "#cccccc";
    colorCircle.style.border = "1px solid #888";
    colorCircle.style.cursor = "pointer";
    colorCircle.title = "Pick background color";

    const colorInput = document.createElement("input");
    colorInput.type = "color";
    colorInput.style.display = "none";

    colorCircle.addEventListener("click", () => colorInput.click());

    colorInput.addEventListener("input", (e) => {
      const color = e.target.value;
      colorCircle.style.backgroundColor = color;

      const card = document.querySelector(".cardFront");
      if (card) {
        card.style.backgroundColor = color;
      }
    });

    colorWrapper.appendChild(colorCircle);
    colorWrapper.appendChild(colorInput);

    // ✅ define style element
    const style = document.createElement("style");
    style.textContent = this.toolBarStyleContent;

    // Append everything to shadow DOM
    shadow.appendChild(featureIcons);
    shadow.appendChild(colorWrapper);
    shadow.appendChild(style);
  }

  customizeButton(button, buttonNum) {
    switch (buttonNum) {
      case 0:
        button.innerHTML = `<img src="../../assets/icons/tool-bar-icons/location-arrow.png" alt="Diagram">`;
        button.addEventListener("click", function () {
          alert("Select clicked!");
        });
        button.className = "select";
        break;
      case 1:
        button.innerHTML = `<img src="../../assets/icons/tool-bar-icons/add-image.png" alt="Diagram">`;
        button.addEventListener("click", function () {
          alert("Add Image clicked!");
        });
        button.className = "addImage";
        break;
      case 2:
        button.innerHTML = `<img  src="../../assets/icons/tool-bar-icons/resources.png" alt="Diagram">`;
        button.addEventListener("click", function () {
          alert("Shapes clicked!");
        });
        button.className = "shapes";
        break;
      case 3:
        button.innerHTML = `<img  src="../../assets/icons/tool-bar-icons/text.png" alt="Diagram">`;
        button.addEventListener("click", function () {
          alert("Add Text clicked!");
        });
        button.className = "addText";
        break;
    }
  }
}

customElements.define("tool-bar", ToolBar);

//  <div class="featurebar"></div>
//         <div class="featureicons">
//             <button class="select" onclick="alert('Select clicked!')"><img src="location-arrow.png" alt="Diagram"></button>
//             <button class="addImage"  onclick="alert('Add Image clicked!')"> <img src="add-image.png" alt="Diagram"></button>
//             <button class="shapes" onclick="alert('Shapes clicked!')"><img  src="resources.png" alt="Diagram"></button>
//             <button class="addText" onclick="alert('Add Text clicked!')"><img  src="text.png" alt="Diagram"></button>
//         </div>
