//where we actually load the page
window.addEventListener("DOMContentLoaded", init);

function init() {
	const mainElem = document.querySelector('main');
    const toolBar = document.createElement('tool-bar');
    mainElem.appendChild(toolBar);
}