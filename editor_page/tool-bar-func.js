const Mode = {
    SCROLL: 0,
    EDIT: 1
}; //can add more modes later on, we will work with this for right now

class ToolBar extends HTMLElement{
    constructor(){
        super();
        let mode = Mode['SCROLL'];
        const shadow = this.attachShadow({mode:'open'});
        const featureIcons = document.createElement('div');
        featureIcons.className = 'featureicons';
        const style = document.createElement('style');
        this.buttons = [];
        for(let i = 0; i < 4; i++) {
            let button = document.createElement('button');
            this.customizeButton(button, i);
            this.buttons.push(button);
            featureIcons.appendChild(button);
        }
        style.textContent = `
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
    }*/`;
        shadow.appendChild(featureIcons);
        shadow.appendChild(style);
    }

    customizeButton(button, buttonNum){

        switch(buttonNum){
            case 0:
                button.innerHTML = `<img src="assets/tool-bar-imgs/location-arrow.png" alt="Diagram">`;
                button.addEventListener('click', function(){
                    alert('Select clicked!');
                })
                button.className = 'select';
                break;
            case 1:
                button.innerHTML = `<img src="assets/tool-bar-imgs/add-image.png" alt="Diagram">`;
                button.addEventListener('click', function(){
                    alert('Add Image clicked!');
                })
                button.className = 'addImage';
                break;
            case 2:
                button.innerHTML = `<img  src="assets/tool-bar-imgs/resources.png" alt="Diagram">`;
                button.addEventListener('click', function(){
                    alert('Shapes clicked!');
                })
                button.className = 'shapes';
                break;
            case 3:
                button.innerHTML = `<img  src="assets/tool-bar-imgs/text.png" alt="Diagram">`;
                button.addEventListener('click', function(){
                    alert('Add Text clicked!');
                })
                button.className = 'addText';
                break;
        }
    }
}

customElements.define('tool-bar', ToolBar);



//  <div class="featurebar"></div>
//         <div class="featureicons">
//             <button class="select" onclick="alert('Select clicked!')"><img src="location-arrow.png" alt="Diagram"></button>
//             <button class="addImage"  onclick="alert('Add Image clicked!')"> <img src="add-image.png" alt="Diagram"></button>
//             <button class="shapes" onclick="alert('Shapes clicked!')"><img  src="resources.png" alt="Diagram"></button>
//             <button class="addText" onclick="alert('Add Text clicked!')"><img  src="text.png" alt="Diagram"></button>
//         </div>