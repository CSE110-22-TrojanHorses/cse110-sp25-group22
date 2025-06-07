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
          window.location.href = escape("../home_page/homepage.html");
        });
        button.className = "topleftimg";
        break;
      case 1:
        button.innerHTML = `<img src="../../assets/icons/top-bar-icons/disk.png" alt="Diagram">`;
        button.addEventListener("click", this.saveButton);
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

  /**
   * Saves elements in greeting card to local storage
   */
  saveButton() {
    if (document.querySelector("greeting-card")) {
      // get card DOM
      const card = document.querySelector("greeting-card").shadowRoot;

      // get inside and outside of cards
      const pages = card.querySelectorAll(".page-wrapper");
      const back = pages[0];
      const front = pages[1];
      const leftPage = pages[2];
      const rightPage = pages[3];

      // storage object to stringify
      const storage = {};

      // gets elements in order within each container
      storage.leftElements = getElements(leftPage);
      storage.rightElements = getElements(rightPage);
      storage.backElements = getElements(back);
      storage.frontElements = getElements(front);

      let date = new Date();
      storage.time = `Last Sync: ${date.getMonth() + 1}/${date.getDay() + 1}/${date.getFullYear()} @ ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`

      // adds data to local storage
      const curCard = localStorage.getItem("current card");
      if (!curCard || curCard == "NEW") {
        const cardName = `card ${localStorage.length}`
        localStorage.setItem(cardName, JSON.stringify(storage));
        localStorage.setItem("current card", cardName)
      } else {
        localStorage.setItem(curCard, JSON.stringify(storage));
      }
    }

    /**
     * Gets elements within the container
     * 
     * @param {Element} container 
     * @returns {Element[]} List of elements in order
     */
    function getElements(container) {
      // creates array from elements
      let elements = Array.from(container.getElementsByTagName("*"));
      for (let i = 0; i < elements.length; i++) {
        // gets outerHTML and value for inputs, gets only outerHTML for other element types
        if (elements[i].tagName == "INPUT") {
          elements[i] = [elements[i].tagName, elements[i].outerHTML, elements[i].value];
        } else {
          elements[i] = [elements[i].tagName, elements[i].outerHTML];
        }
      }
      return elements;
    }
  }
}
customElements.define("top-bar", TopBar);
