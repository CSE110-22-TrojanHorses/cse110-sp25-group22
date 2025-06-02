class TopBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    const style = document.createElement("link");
    style.setAttribute("rel", "stylesheet");
    style.setAttribute("href", "navBars.css");
    const container = document.createElement("nav");
    container.classList.add("navcontainer");
    this.buttons = [];
    for (let i = 0; i < 5; i++) {
      let button = document.createElement("button");
      this.customizeButton(button, i);
      this.buttons.push(button);
      container.appendChild(button);
    }
    this.shadowRoot.append(style, container);
  }

  customizeButton(button, buttonNum) {
    switch (buttonNum) {
      case 0:
        button.innerHTML = `<img src="../../assets/icons/top-bar-icons/apps.png" alt="Diagram">`;
        button.addEventListener("click", function () {
          window.location.href = escape("../homepage.html");
        });
        button.className = "topleftimg";
        break;
      case 1:
        button.innerHTML = `<img src="../../assets/icons/top-bar-icons/disk.png" alt="Diagram">`;
        button.addEventListener("click", async function () {
          if (document.querySelector("greeting-card")) {
            // get card DOM
            const card = document.querySelector("greeting-card").shadowRoot;

            // get inside and outside of cards
            const inside = card.querySelector(".inside");
            const outside = card.querySelector(".outside");

            // array of element types that are used
            const elementTypes = ["img", "input", "h2", "p"];

            // storage object to stringify
            const storage = {};
            storage.insideElements = [];
            storage.outsideElements = [];

            // store arrays for each element type and get the outerHTML for each element
            for (let i = 0; i < elementTypes.length; i++) {
              const insideElementList = Array.from(inside.getElementsByTagName(elementTypes[i]));
              for (let j = 0; j < insideElementList.length; j++) {
                if (elementTypes[i] == "input") {
                  insideElementList[j] = [insideElementList[j].outerHTML, insideElementList[j].value]; 
                } else {
                  insideElementList[j] = insideElementList[j].outerHTML;
                }
              }
              const outsideElementList = Array.from(outside.getElementsByTagName(elementTypes[i]));
              for (let j = 0; j < outsideElementList.length; j++) {
                if (elementTypes[i] == "input") {
                  outsideElementList[j] = [outsideElementList[j].outerHTML, outsideElementList[j].value]; 
                } else {
                  outsideElementList[j] = outsideElementList[j].outerHTML;
                }
              }
              storage.insideElements.push(insideElementList);
              storage.outsideElements.push(outsideElementList);
            }

            // adds data to local storage
            localStorage.setItem("card data", JSON.stringify(storage));
          }
        });
        button.className = "save";
        break;
      case 2:
        button.innerHTML = `<img src="../../assets/icons/top-bar-icons/download.png" alt="Diagram">`;
        button.addEventListener("click", function () {
          alert("Download clicked!");
        });
        button.className = "download";
        break;
      case 3:
        button.innerHTML = `<img src="../../assets/icons/top-bar-icons/share.png" alt="Diagram">`;
        button.addEventListener("click", function () {
          alert("Share clicked!");
        });
        button.className = "share";
        break;
      case 4:
        button.innerHTML = `<img src="../../assets/icons/top-bar-icons/circle-user.png" alt="Diagram">`;
        button.addEventListener("click", function () {
          alert("Profile clicked!");
        });
        button.className = "toprightimg";
        break;
    }
  }
}
customElements.define("top-bar", TopBar);
