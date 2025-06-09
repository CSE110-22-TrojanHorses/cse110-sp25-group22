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
      storage.time = `Last Sync: ${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDay() + 1).padStart(2, "0")}/${date.getFullYear()} @ 
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
      const rawElements = container.getElementsByTagName("*");
      const elements = [];

      for (let elem of rawElements) {
        // get the tagname and format the desired attributes as JSON object
        // goal: avoid direct HTML injection
        const tag = elem.tagName;
        const data = { tag };

        data.attributes = {};
        for (let attr of elem.attributes) {
          data.attributes[attr.name] = attr.value;
        }

        if (tag === "TEXTAREA") {
          data.value = elem.value;
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
