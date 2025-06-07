class HomepageCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        const card = document.createElement("div");
        card.setAttribute("data-name", "tmp")
        card.classList.add("card");
        
        // Sets up style of homepage card
        const style = document.createElement("link");
        style.setAttribute("rel", "stylesheet");
        style.setAttribute("href", "homepageCard.css");
        this.shadowRoot.append(style, card);
    }

    /**
     * 
     */
    set name(name) {
        if (!name) return;
        const card = this.shadowRoot.querySelector('[data-name="tmp"]')
        const miniCard = document.createElement("div");
        const cardData = JSON.parse(localStorage.getItem(name));
        const frontElements = cardData.frontElements;
        for (let i = 0; i < frontElements.length; i++) {
            const tmp = document.createElement("div");
            tmp.innerHTML = frontElements[i][1];
            let element;
            if (frontElements[i][0] == "INPUT") {
                element = tmp.querySelector("input");
                element.value = frontElements[i][2];
                element.readOnly = true;
            } else {
                element = tmp.querySelector("img");
            }
            miniCard.append(element);
            tmp.remove();
        }
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
    if (localStorage.length > 1) {
        document.querySelector("p").innerText = "Click the '+' option to create more greeting cards!"
    }
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key != "current card") {
            const card = document.createElement("home-card");
            card.name = key;
            card.contentEditable = "false";
            cardContainer.append(card);
            card.addEventListener("dblclick", (event) => {
                console.log("double click!");
                const menu = document.createElement("div");
                menu.classList.add("menu");
                menu.style.left = event.clientX + 'px';
                menu.style.top = event.clientY + 'px';
                const editLabel = document.createElement("label");
                editLabel.classList.add("edit");
                editLabel.innerText = "Edit";
                editLabel.addEventListener("click", () => {
                    localStorage.setItem("current card", key);
                    window.open("../editor_page/index.html", "_self");
                })
                const deleteLabel = document.createElement("label");
                deleteLabel.classList.add("delete");
                deleteLabel.innerText = "Delete";
                deleteLabel.addEventListener("click", () => {
                    localStorage.removeItem(key);
                    card.remove();
                    menu.remove();
                    if (localStorage.length <= 1) {
                        document.querySelector("p").innerText = "Click the '+' option to create your first greeting card!"
                    }
                })
                menu.append(editLabel, deleteLabel);
                container.append(menu);
                console.log(menu);
            })
            card.addEventListener("click", () => {
                const menu = document.querySelector(".menu");
                if (menu) {
                    menu.remove();
                }
            })
        }
    }
    container.append(cardContainer);
})