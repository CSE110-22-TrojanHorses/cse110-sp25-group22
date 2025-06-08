/**
 * index.js
 *
 * Powers the greeting card editor:
 * - Adds shapes to the card
 * - Allows dragging, resizing, recoloring
 * - Handles shape selection and deselection
 * - Deletes shape on Backspace/Delete
 */

// Track the selected shape from the toolbar
window.selectedShape = null;
let activeShape = null;

// When a toolbar button is clicked
window.addEventListener("shape-selected", (e) => {
  window.selectedShape = e.detail;
  console.log(e.detail);
  document.body.style.cursor = "pointer";
});

window.addEventListener("DOMContentLoaded", init);

function init() {
  // const mainElem = document.querySelector("main");
  // const topBarContainer = document.querySelector("div.pagetop");

  // const toolBar = document.querySelector("tool-bar");
  // const topBar = document.querySelector("top-bar");
  // mainElem.appendChild(toolBar);
  // topBarContainer.appendChild(topBar);
 
  // const card = document.querySelector(".cardFront");
  const card = document.querySelector(".card.outside");
  if (!card) {
    console.error("Error: .cardFront element not found.");
    return;
  }

  const shapesContainer = document.createElement("div");
  shapesContainer.id = "shapes-container";
  shapesContainer.style.position = "relative";
  shapesContainer.style.width = "100%";
  shapesContainer.style.height = "100%";
  card.appendChild(shapesContainer);

  // Add a shape to the card
  card.addEventListener("click", (e) => {
    if (!window.selectedShape) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const shape = document.createElement("div");
    shape.style.position = "absolute";
    shape.style.left = `${x - 100}px`;
    shape.style.top = `${y - 100}px`;
    shape.style.cursor = "move";

    switch (window.selectedShape) {
      case "square":
        shape.className = "square-shape";
        shape.style.width = "200px";
        shape.style.height = "200px";
        shape.style.backgroundColor = "red";
        break;
      case "rectangle":
        shape.className = "rectangle-shape";
        shape.style.width = "300px";
        shape.style.height = "150px";
        shape.style.backgroundColor = "red";
        break;
      case "circle":
        shape.className = "circle-shape";
        shape.style.width = "200px";
        shape.style.height = "200px";
        shape.style.borderRadius = "50%";
        shape.style.backgroundColor = "red";
        break;
      case "triangle":
        shape.className = "triangle-shape";
        shape.style.width = "0";
        shape.style.height = "0";
        shape.style.borderLeft = "100px solid transparent";
        shape.style.borderRight = "100px solid transparent";
        shape.style.borderBottom = "200px solid red";
        shape.style.background = "none";
        break;
    }

    shapesContainer.appendChild(shape);
    window.selectedShape = null;
    document.body.style.cursor = "default";
    document.querySelectorAll(".shape-button").forEach(btn => btn.classList.remove("selected"));
  });

  // Shape selection and recolor
  shapesContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("resizer")) return;

    const shape = e.target.closest(".square-shape, .rectangle-shape, .circle-shape, .triangle-shape");
    if (!shape) return;

    if (activeShape) activeShape.classList.remove("active-shape");
    activeShape = shape;
    activeShape.classList.add("active-shape");

    if (!activeShape.querySelector(".resizer")) {
      addResizeHandles(activeShape);
    }

    document.querySelectorAll("input[type='color']").forEach(picker => picker.remove());

    const colorPicker = document.createElement("input");
    colorPicker.type = "color";
    colorPicker.style.position = "fixed";
    colorPicker.style.left = `${e.clientX}px`;
    colorPicker.style.top = `${e.clientY}px`;
    colorPicker.style.zIndex = 9999;

    colorPicker.addEventListener("input", (event) => {
      if (!activeShape) return;
      const color = event.target.value;
      if (activeShape.classList.contains("triangle-shape")) {
        activeShape.style.borderBottomColor = color;
      } else {
        activeShape.style.backgroundColor = color;
      }
    });

    colorPicker.addEventListener("blur", () => {
      colorPicker.remove();
    });

    document.body.appendChild(colorPicker);
    colorPicker.focus();
  });

  // Dragging shapes
  let selectedShape = null;
  let offsetX = 0;
  let offsetY = 0;

  shapesContainer.addEventListener("mousedown", (e) => {
    const target = e.target.closest(".square-shape, .rectangle-shape, .circle-shape, .triangle-shape");
    if (!target) return;

    selectedShape = target;
    const rect = selectedShape.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    document.addEventListener("mousemove", handleDrag);
    document.addEventListener("mouseup", stopDrag);
  });

  function handleDrag(e) {
    if (!selectedShape) return;

    const parentRect = shapesContainer.getBoundingClientRect();
    const shapeRect = selectedShape.getBoundingClientRect();

    let x = e.clientX - parentRect.left - offsetX;
    let y = e.clientY - parentRect.top - offsetY;

    x = Math.max(0, Math.min(x, shapesContainer.clientWidth - shapeRect.width));
    y = Math.max(0, Math.min(y, shapesContainer.clientHeight - shapeRect.height));

    selectedShape.style.left = `${x}px`;
    selectedShape.style.top = `${y}px`;
  }

  function stopDrag() {
    document.removeEventListener("mousemove", handleDrag);
    document.removeEventListener("mouseup", stopDrag);
    selectedShape = null;
  }

  // Add resizer
  function addResizeHandles(shape) {
    const resizer = document.createElement("div");
    resizer.className = "resizer";
    Object.assign(resizer.style, {
      width: "10px",
      height: "10px",
      background: "black",
      position: "absolute",
      right: "0",
      bottom: "0",
      cursor: "se-resize",
      zIndex: "10"
    });

    shape.appendChild(resizer);

    let isResizing = false;

    resizer.addEventListener("mousedown", (e) => {
      e.stopPropagation();
      if (!shape.classList.contains("active-shape")) return;
      isResizing = true;
      document.addEventListener("mousemove", resize);
      document.addEventListener("mouseup", stopResize);
    });

    function resize(e) {
      if (!isResizing) return;
      const rect = shape.getBoundingClientRect();
      const newWidth = e.clientX - rect.left;
      const newHeight = e.clientY - rect.top;

      if (shape.classList.contains("triangle-shape")) {
        shape.style.borderLeftWidth = `${newWidth / 2}px`;
        shape.style.borderRightWidth = `${newWidth / 2}px`;
        shape.style.borderBottomWidth = `${newHeight}px`;
      } else {
        shape.style.width = `${newWidth}px`;
        shape.style.height = `${newHeight}px`;
      }
    }

    function stopResize() {
      isResizing = false;
      document.removeEventListener("mousemove", resize);
      document.removeEventListener("mouseup", stopResize);
    }
  }
}

// Deselect shape on outside click
/*document.addEventListener("mousedown", (e) => {
  const isShape = e.target.closest(".square-shape, .rectangle-shape, .circle-shape, .triangle-shape");
  if (!isShape && e.target != document.querySelectorAll("input[type='color']")) {
    activeShape.classList.remove("active-shape");
    const resizer = activeShape.querySelector(".resizer");
    if (resizer) resizer.style.background = "transparent";
    activeShape = null;
  }
});*/

// Delete active shape with Backspace/Delete
document.addEventListener("keydown", (e) => {
  if ((e.key === "Backspace" || e.key === "Delete") && activeShape) {
    activeShape.remove();
    activeShape = null;
  }
});
