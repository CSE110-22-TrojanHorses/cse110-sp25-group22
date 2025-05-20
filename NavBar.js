class NavBar extends HTMLElement {
    
    /**
     * Creates Navigation Bar
     */
    constructor() {
        super();
        const shadow = this.attachShadow({mode: "open"});
        const nav = document.createElement("nav");

        // Sets up buttons in navigation bar
        nav.innerHTML = `
        <button id="home" onclick="window.open('homepage.html', '_self')"></button>
        <button id="create"></button>`; // Add onclick when edit page is created

        // Sets up style of navigation bar
        let style = document.createElement("style");
        style.innerHTML = `
        button {
            width: 50px;
            height: 50px;
            background-size: cover;
            background-color: black;
            border: 0px;
        }
        #home {
            background-image: url("assets/home_button.png");
        }

        #create {
            background-image: url("assets/plus_button.png");
        }

        nav {
            background-color: black;
            display: flex;
            justify-content: space-between;
            padding: 15px;
        }

        * {
            margin: 0;
        }`;
        shadow.append(nav);
        shadow.append(style);
    }

}

// Defines element name to create NavBar
customElements.define('nav-bar', NavBar);