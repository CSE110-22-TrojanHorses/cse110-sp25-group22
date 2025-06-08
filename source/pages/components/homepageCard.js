class HomepageCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    const card = document.createElement("div");
    card.setAttribute("data-name", "tmp");
    card.classList.add("card");

    // Sets up style of homepage card
    const style = document.createElement("link");
    style.setAttribute("rel", "stylesheet");
    style.setAttribute("href", "homepageCard.css");
    this.shadowRoot.append(style, card);
  }

  /**
   * Sets the data-name of the card to name
   * Gets card data from any stored data with the name as the key
   * @param {string} name - name of the card
   */
  set name(name) {
    if (!name) return;
    const card = this.shadowRoot.querySelector('[data-name="tmp"]');
    const miniCard = document.createElement("div");

    // gets stored data to fill the card
    const cardData = JSON.parse(localStorage.getItem(name));
    const frontElements = cardData.frontElements;
    for (let element of frontElements) {
      const { tag, attributes = {}, value = "" } = element;
      const preview = document.createElement(tag);
      if (attributes) {
        Object.entries(attributes).forEach(([key, val]) =>
          preview.setAttribute(key, val)
        );
      }

      if (tag === "INPUT") {
        preview.value = value;
        preview.readOnly = true;
      }

      miniCard.append(preview);
    }

    // adds the card name and timestamp
    const nameLabel = document.createElement("label");
    nameLabel.innerText = name;
    const timeLabel = document.createElement("label");
    timeLabel.innerText = cardData.time;
    card.append(miniCard, nameLabel, timeLabel);
    card.setAttribute("data-name", name);
  }
}

// Defines element name to create HomepageCard
customElements.define("home-card", HomepageCard);

window.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector("section");
  const cardContainer = document.createElement("section");

  // change text in homepage if there is card data stored
  if (localStorage.length > 1) {
    document.querySelector("p").innerText =
      "Click the '+' option to create more greeting cards!";
  }
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);

    // for all card data, create a new home-card element
    if (key != "current card") {
      const card = document.createElement("home-card");
      card.name = key;
      card.contentEditable = "false";
      cardContainer.append(card);

      // on double click, create a menu to edit or delete the card
      card.addEventListener("dblclick", (event) => {
        console.log("double click!");
        const menu = document.createElement("div");
        menu.classList.add("menu");

        // sets location of the menu to start where the mouse was
        menu.style.left = event.clientX + "px";
        menu.style.top = event.clientY + "px";
        const editLabel = document.createElement("label");
        editLabel.classList.add("edit");
        editLabel.innerText = "Edit";

        // if edit is clicked, open the editor page and set this to be the current card
        editLabel.addEventListener("click", () => {
          localStorage.setItem("current card", key);
          window.open("../editor_page/index.html", "_self");
        });
        const deleteLabel = document.createElement("label");
        deleteLabel.classList.add("delete");
        deleteLabel.innerText = "Delete";

        // if delete is clicked, remove the home-card and its data from local storage
        deleteLabel.addEventListener("click", () => {
          localStorage.removeItem(key);
          card.remove();
          menu.remove(); // close the menu

          // change homepage text if there are no cards being shown
          if (localStorage.length <= 1) {
            document.querySelector("p").innerText =
              "Click the '+' option to create your first greeting card!";
          }
        });
        menu.append(editLabel, deleteLabel);
        container.append(menu);
      });

      // if anywhere else on the card is clicked, then the menu disappears
      card.addEventListener("click", () => {
        const menu = document.querySelector(".menu");
        if (menu) {
          menu.remove();
        }
      });
    }
  }
  container.append(cardContainer);
});
