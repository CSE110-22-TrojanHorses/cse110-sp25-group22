class TopBar extends HTMLElement{
    constructor(){
        super();
        const shadow = this.attachShadow({mode:'open'});
        const style = document.createElement('style');
        this.buttons = [];
        for(let i = 0; i < 5; i++){
            let button = document.createElement('button');
            this.customizeButton(button, i);
            this.buttons.push(button);
            shadow.appendChild(button);
        }
        style.textContent = 
        `
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

        /*@media screen and (max-width: 1022px) and (max-height: 544px) {
            .cardFront {
                position: absolute;
                height: 100px;
                width: 100px;
                background-color: black;
                top: 193.5px;
                left: 422px;
                border-width: 2px;
                border-style: solid;
                border-color: black;
                background-color: transparent;
            }
        }*/
        `;
        shadow.appendChild(style);

    }

    customizeButton(button, buttonNum){
        switch(buttonNum){
            case 0:
                button.innerHTML = `<img src="assets/top-bar-imgs/apps.png" alt="Diagram">`;
                button.addEventListener('click', function(){
                    alert('Home clicked!');
                })
                button.className = 'topleftimg';
                break;
            case 1:
                button.innerHTML = `<img src="assets/top-bar-imgs/circle-user.png" alt="Diagram">`;
                button.addEventListener('click', function(){
                    alert('Profile clicked!');
                })
                button.className = 'toprightimg';
                break;
            case 2:
                button.innerHTML = `<img src="assets/top-bar-imgs/disk.png" alt="Diagram">`;
                button.addEventListener('click', function(){
                    alert('Save clicked!');
                })
                button.className = 'save';
                break;
            case 3:
                button.innerHTML = `<img src="assets/top-bar-imgs/download.png" alt="Diagram">`;
                button.addEventListener('click', function(){
                    alert('Download clicked!');
                })
                button.className = 'download';
                break;
            case 4:
                button.innerHTML = `<img src="assets/top-bar-imgs/share.png" alt="Diagram">`;
                button.addEventListener('click', function(){
                    alert('Share clicked!');
                })
                button.className = 'share';
                break;
        }
    }
}
customElements.define('top-bar', TopBar);

//  <button class="topleftimg" onclick="alert('Home clicked!')"><img src="assets/top-bar-imgs/apps.png" alt="Diagram"></button>
//             <button class="toprightimg" onclick="alert('Profile clicked!')"><img src="assets/top-bar-imgs/circle-user.png" alt="Diagram"></button>
//             <button class="save" onclick="alert('Save clicked!')"><img src="assets/top-bar-imgs/disk.png" alt="Diagram"></button>
//             <button class="download" onclick="alert('Download clicked!')"><img src="assets/top-bar-imgs/download.png" alt="Diagram"></button>
//             <button class="share" onclick="alert('Share clicked!')"><img src="assets/top-bar-imgs/share.png" alt="Diagram"></button>