/**
 * Waits until the DOM is fully loaded and then calls `init`.
 * Because JavaScript needs constant supervision before it does anything useful.
 */
window.addEventListener("DOMContentLoaded", init);

/**
 * Initializes the editor page by injecting the tool bar and top bar components into the DOM.
 * Assumes `main` and `.pagetop` already exist 
 */

function init() {
	const mainElem = document.querySelector('main');
    const topBarContainer = document.querySelector('div.pagetop')
    const toolBar = document.createElement('tool-bar');
    const topBar = document.createElement('top-bar');
    mainElem.appendChild(toolBar);
    topBarContainer.appendChild(topBar);
}