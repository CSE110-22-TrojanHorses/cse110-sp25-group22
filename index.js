//where we actually load the page
window.addEventListener("DOMContentLoaded", init);

function init() {
	const mainElem = document.querySelector('main');
    const topBarContainer = document.querySelector('div.pagetop')
    const toolBar = document.createElement('tool-bar');
    const topBar = document.createElement('top-bar');
    mainElem.appendChild(toolBar);
    topBarContainer.appendChild(topBar);
}