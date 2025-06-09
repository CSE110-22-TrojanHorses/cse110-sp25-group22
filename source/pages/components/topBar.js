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
        button.addEventListener("click", this.saveButton);
        button.className = "save";
        break;
      case 2:
        button.innerHTML = `<img src="../../assets/icons/top-bar-icons/download.png" alt="Diagram">`;
        button.addEventListener("click", async function () {
          try{
            const greetingCard = document.querySelector('greeting-card');
            const shadow = greetingCard?.shadowRoot;

            const visibleCard = shadow.querySelector('.card:not(.hidden)');
            if (!visibleCard){
              alert("Could not find a visible card to export.");
              return;
            }

            const canvas = await html2canvas(visibleCard, {
              scale: 2,
              useCORS: true
            });

            const imgData = canvas.toDataURL('image/png');
            const {jsPDF} = window.jspdf;
            const pdf = new jsPDF('landscape', 'pt', 'a4');

            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            const imgWidth = canvas.width;
            const imgHeight = canvas.height;

            // scale
            const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
            const scaledWidth = imgWidth * ratio;
            const scaledHeight = imgHeight * ratio;

            // center
            const x = (pageWidth - scaledWidth) / 2;
            const y = (pageHeight - scaledHeight) / 2;


            pdf.addImage(imgData, 'PNG', x, y, scaledWidth, scaledHeight);
            pdf.save('greeting-card.pdf');
          } catch (err) {
            console.error("Download error:", err);
            alert("Something went wrong when downloading!");
          }
          // alert("Download clicked!");
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
      const leftPage = pages[0];
      const rightPage = pages[1];
      const back = card.querySelector(".back-cover");
      const front = card.querySelector(".front-cover")

      // array of element types that are used
      const elementTypes = ["img", "input", "h2", "p"];

      // storage object to stringify
      const storage = {};
      storage.leftElements = [];
      storage.rightElements = [];
      storage.backElements = [];
      storage.frontElements = [];

      // gets elements of each type within each container
      for (let i = 0; i < elementTypes.length; i++) {
        const leftElementList = getElements(leftPage, elementTypes[i]);
        const rightElementList = getElements(rightPage, elementTypes[i]);
        const backElementList = getElements(back, elementTypes[i]);
        const frontElementList = getElements(front, elementTypes[i]);

        storage.leftElements.push(leftElementList);
        storage.rightElements.push(rightElementList);
        storage.backElements.push(backElementList);
        storage.frontElements.push(frontElementList);
      }

      // adds data to local storage
      localStorage.setItem("card data", JSON.stringify(storage));
    }

    /**
     * Gets elements of a specified type within the container
     * 
     * @param {Element} container 
     * @param {string} type 
     * @returns {Element[]} List of elements of a specified type
     */
    function getElements(container, type) {
      // creates array from elements of a specified type
      let elements = Array.from(container.getElementsByTagName(type));
      for (let i = 0; i < elements.length; i++) {
        // gets outerHTML and value for inputs, gets only outerHTML for other element types
        if (type == "input") {
          elements[i] = [elements[i].outerHTML, elements[i].value];
        } else {
          elements[i] = elements[i].outerHTML;
        }
      }
      return elements;
    }
  }
}
customElements.define("top-bar", TopBar);
