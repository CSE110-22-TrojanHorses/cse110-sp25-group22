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
    for (let i = 0; i < 3; i++) {
      let button = document.createElement("button");
      this.customizeButton(button, i);
      this.buttons.push(button);
      container.appendChild(button);
    }
    this.shadowRoot.append(style, container);
  }
  /**
   * Create and define functionality for features in the top bar
   * @param button
   * @param buttonNum
   * @returns {void}
   */
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
      const pages = card.querySelectorAll(".card");
      const outside = pages[0];
      const inside = pages[1];

      // storage object to stringify
      const storage = {};

      // gets elements in order within each container
      storage.outsideElements = getElements(outside);
      storage.insideElements = getElements(inside);

      let date = new Date();
      storage.time = `Last Sync: ${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}/${date.getFullYear()} @ 
                      ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;

      // adds data to local storage
      const curCard = localStorage.getItem("current card");
      if (!curCard || curCard == "NEW") {
        // adds new data to local storage
        const cardName = `card ${localStorage.length}`;
        localStorage.setItem(cardName, JSON.stringify(storage));
        localStorage.setItem("current card", cardName);
      } else {
        localStorage.setItem(curCard, JSON.stringify(storage)); // updates data that is stored
      }

      showSaveMessage();
    }

    /**
     * Gets elements within the container
     *
     * @param {Element} container - The container that the elements are contained in
     * @returns {Object[]} List of structured element data
     */
    function getElements(container) {
      // creates array from elements
      const elementContainers = container.getElementsByTagName("card-element");
      const elements = [];

      for (let cardElem of elementContainers) {
        // get the tagname and format the desired attributes as JSON object
        // goal: avoid direct HTML injection
        const root = cardElem.shadowRoot;
        const rawElement = root.querySelectorAll("*");

        if (!rawElement.length) continue;
        let outerElement = rawElement[0];
        const data = {};
        let type = "";

        if (outerElement.tagName == "TEXTAREA") {
          type = "TEXT";
          data.value = outerElement.value ?? "";
        } else if (outerElement.className.includes("shape")) {
          type = "SHAPE";
        } else {
          type = "IMAGE";
        }

        data.type = type;
        data.cardElementData = {};
        for (let attr of cardElem.attributes) {
          data.cardElementData[attr.name] = attr.value;
        }
        data.outerElemData = {};
        for (let attr of outerElement.attributes) {
          data.outerElemData[attr.name] = attr.value;
        }

        if (type != "TEXT") {
          const innerElements = [];
          const contents = outerElement.children;
          for (const child of contents) {
            const tag = child.tagName;
            const attributes = {};
            for (let attr of child.attributes) {
              attributes[attr.name] = attr.value;
            }
            innerElements.push([tag, attributes]);

            if (tag == "TEXTAREA") {
              data.value = child.value ?? "";
            }
          }
          data.innerElemData = innerElements;
        }

        elements.push(data);
      }
      return elements;
    }

    function showSaveMessage() {
      const message = document.getElementById("save-message");
      message.classList.add("show");
      setTimeout(() => {
        message.classList.remove("show");
      }, 2500);
    }
  }
}
customElements.define("top-bar", TopBar);
