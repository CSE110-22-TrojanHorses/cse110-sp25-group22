// Track selected tool and editable shape
window.selectedShape = null;
let activeShape = null;

window.addEventListener("shape-selected", (e) => {
  window.selectedShape = e.detail;
  document.body.style.cursor = "pointer";
});

window.addEventListener("DOMContentLoaded", init);

function init() {
  const mainElem = document.querySelector("main");
  const topBarContainer = document.querySelector("div.pagetop");
  const toolBar = document.createElement("tool-bar");
  const topBar = document.createElement("top-bar");
  mainElem.appendChild(toolBar);
  topBarContainer.appendChild(topBar);

  const card = document.querySelector(".cardFront");
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

  // Add shape to card
  card.addEventListener("click", (e) => {
    if (!window.selectedShape) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Skip star and heart (optional: remove this block if already removed from toolbar)
    if (window.selectedShape === "star" || window.selectedShape === "heart") {
      return;
    }

    let shape = document.createElement("div");
    shape.style.position = "absolute";
    shape.style.left = `${x - 100}px`;
    shape.style.top = `${y - 100}px`;
    shape.style.cursor = "move";

    switch (window.selectedShape) {
      case "square":
        shape.classList.add("square-shape");
        shape.style.width = "200px";
        shape.style.height = "200px";
        shape.style.backgroundColor = "red";
        break;
      case "rectangle":
        shape.classList.add("rectangle-shape");
        shape.style.width = "300px";
        shape.style.height = "150px";
        shape.style.backgroundColor = "red";
        break;
      case "circle":
        shape.classList.add("circle-shape");
        shape.style.width = "200px";
        shape.style.height = "200px";
        shape.style.borderRadius = "50%";
        shape.style.backgroundColor = "red";
        break;
      case "triangle":
        shape.classList.add("triangle-shape");
        shape.style.width = "0";
        shape.style.height = "0";
        shape.style.borderLeft = "100px solid transparent";
        shape.style.borderRight = "100px solid transparent";
        shape.style.borderBottom = "200px solid red";
        shape.style.background = "none";
        break;
    }

    shapesContainer.appendChild(shape);
    addResizeHandles(shape);
    window.selectedShape = null;
    document.body.style.cursor = "default";
    document.querySelectorAll(".shape-button").forEach(btn => btn.classList.remove("selected"));
  });

  // Select shape for editing
  shapesContainer.addEventListener("click", (e) => {
    const target = e.target.closest(".square-shape, .rectangle-shape, .circle-shape, .triangle-shape");
    if (!target) return;

    if (activeShape) activeShape.classList.remove("active-shape");
    activeShape = target;
    activeShape.classList.add("active-shape");

    const colorInput = document.createElement("input");
    colorInput.type = "color";
    colorInput.style.position = "absolute";
    colorInput.style.left = `${e.clientX}px`;
    colorInput.style.top = `${e.clientY}px`;
    colorInput.style.zIndex = 9999;

    colorInput.addEventListener("input", () => {
      if (activeShape.classList.contains("triangle-shape")) {
        activeShape.style.borderBottomColor = colorInput.value;
      } else {
        activeShape.style.backgroundColor = colorInput.value;
      }
    });

    colorInput.addEventListener("blur", () => {
      colorInput.remove();
    });

    document.body.appendChild(colorInput);
    colorInput.focus();
  });

  // Dragging
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
    const x = e.clientX - parentRect.left - offsetX;
    const y = e.clientY - parentRect.top - offsetY;
    selectedShape.style.left = `${x}px`;
    selectedShape.style.top = `${y}px`;
  }

  function stopDrag() {
    document.removeEventListener("mousemove", handleDrag);
    document.removeEventListener("mouseup", stopDrag);
    selectedShape = null;
  }

  function addResizeHandles(shape) {
    const resizer = document.createElement("div");
    resizer.style.width = "10px";
    resizer.style.height = "10px";
    resizer.style.background = "black";
    resizer.style.position = "absolute";
    resizer.style.right = "0";
    resizer.style.bottom = "0";
    resizer.style.cursor = "se-resize";
    resizer.style.zIndex = 10;

    shape.appendChild(resizer);

    let isResizing = false;
    resizer.addEventListener("mousedown", (e) => {
      e.stopPropagation();
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

// Deselect shape if clicking outside
document.addEventListener("mousedown", (e) => {
  const isShape = e.target.closest(".square-shape, .rectangle-shape, .circle-shape, .triangle-shape");
  if (!isShape && activeShape) {
    activeShape.classList.remove("active-shape");
    activeShape = null;
  }
});
