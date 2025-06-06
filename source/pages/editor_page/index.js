// Load the page when ready
window.selectedShape = null;

window.addEventListener("shape-selected", (e) => {
  window.selectedShape = e.detail;
  document.body.style.cursor = "pointer";
});

window.addEventListener("DOMContentLoaded", init);

function init() {
  const mainElem = document.querySelector('main');
  const topBarContainer = document.querySelector('div.pagetop');
  const toolBar = document.createElement('tool-bar');
  const topBar = document.createElement('top-bar');
  mainElem.appendChild(toolBar);
  topBarContainer.appendChild(topBar);

  const card = document.querySelector('.cardFront');
  if (!card) {
    console.error("Error: .cardFront element not found.");
    return;
  }

  const shapesContainer = document.createElement('div');
  shapesContainer.id = 'shapes-container';
  shapesContainer.style.position = 'relative';
  shapesContainer.style.width = '100%';
  shapesContainer.style.height = '100%';
  card.appendChild(shapesContainer);

  card.addEventListener('click', (e) => {
    if (!window.selectedShape) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let shape;
    if (window.selectedShape === 'star' || window.selectedShape === 'heart') {
      shape = createSVGShape(window.selectedShape);
      shape.style.position = 'absolute';
      shape.style.left = `${x - 100}px`;
      shape.style.top = `${y - 100}px`;
    } else {
      shape = document.createElement('div');
      shape.style.position = 'absolute';
      shape.style.left = `${x - 100}px`;
      shape.style.top = `${y - 100}px`;
      shape.style.cursor = 'move';

      switch (window.selectedShape) {
        case 'square':
          shape.classList.add('square-shape');
          shape.style.width = '200px';
          shape.style.height = '200px';
          shape.style.backgroundColor = 'red';
          break;
        case 'rectangle':
          shape.classList.add('rectangle-shape');
          shape.style.width = '300px';
          shape.style.height = '150px';
          shape.style.backgroundColor = 'red';
          break;
        case 'circle':
          shape.classList.add('circle-shape');
          shape.style.width = '200px';
          shape.style.height = '200px';
          shape.style.borderRadius = '50%';
          shape.style.backgroundColor = 'red';
          break;
        case 'triangle':
          shape.classList.add('triangle-shape');
          shape.style.width = '0';
          shape.style.height = '0';
          shape.style.borderLeft = '100px solid transparent';
          shape.style.borderRight = '100px solid transparent';
          shape.style.borderBottomWidth = '200px';
          shape.style.borderBottomStyle = 'solid';
          shape.style.borderBottomColor = 'red';
          shape.style.background = 'none';
          break;
      }
    }

    shapesContainer.appendChild(shape);
    addResizeHandles(shape);
    window.selectedShape = null;
    document.body.style.cursor = 'default';
    document.querySelectorAll('.shape-button').forEach(btn => btn.classList.remove('selected'));
  });

  let activeShape = null;
  shapesContainer.addEventListener('click', (e) => {
    const target = e.target.closest('.square-shape, .rectangle-shape, .circle-shape, .triangle-shape, svg');
    if (!target) return;

    if (activeShape) activeShape.classList.remove('active-shape');
    activeShape = target;
    activeShape.classList.add('active-shape');

    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.style.position = 'absolute';
    colorInput.style.left = `${e.clientX}px`;
    colorInput.style.top = `${e.clientY}px`;
    colorInput.style.zIndex = 9999;

    colorInput.addEventListener('input', () => {
      if (activeShape.classList.contains('triangle-shape')) {
        activeShape.style.borderBottomColor = colorInput.value;
      } else if (activeShape.tagName === 'svg'.toUpperCase()) {
        activeShape.querySelector('path').setAttribute('fill', colorInput.value);
      } else {
        activeShape.style.backgroundColor = colorInput.value;
      }
    });

    colorInput.addEventListener('blur', () => {
      colorInput.remove();
    });

    document.body.appendChild(colorInput);
    colorInput.focus();
  });

  let selectedShape = null;
  let offsetX = 0;
  let offsetY = 0;

  shapesContainer.addEventListener('mousedown', (e) => {
    const target = e.target.closest('.square-shape, .rectangle-shape, .circle-shape, .triangle-shape, svg');
    if (!target) return;

    selectedShape = target;
    const rect = selectedShape.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', stopDrag);
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
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', stopDrag);
    selectedShape = null;
  }

  function createSVGShape(type) {
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', 200);
    svg.setAttribute('height', 200);
    svg.style.width = '200px';
    svg.style.height = '200px';
    svg.style.position = 'absolute';

    const path = document.createElementNS(svgNS, 'path');
    path.setAttribute('fill', type === 'star' ? 'gold' : 'pink');

    if (type === 'star') {
      path.setAttribute('d', 'M100 10 L120 70 H180 L130 110 L150 170 L100 130 L50 170 L70 110 L20 70 H80 Z');
    } else if (type === 'heart') {
      path.setAttribute('d', 'M100 170 L40 100 A30 30 0 0 1 100 40 A30 30 0 0 1 160 100 Z');
    }

    svg.appendChild(path);
    return svg;
  }

  function addResizeHandles(shape) {
    const resizer = document.createElement('div');
    resizer.style.width = '10px';
    resizer.style.height = '10px';
    resizer.style.background = 'black';
    resizer.style.position = 'absolute';
    resizer.style.right = '0';
    resizer.style.bottom = '0';
    resizer.style.cursor = 'se-resize';
    resizer.style.zIndex = 10;

    shape.appendChild(resizer);

    let isResizing = false;
    resizer.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      isResizing = true;
      document.addEventListener('mousemove', resize);
      document.addEventListener('mouseup', stopResize);
    });

    function resize(e) {
      if (!isResizing) return;
      const rect = shape.getBoundingClientRect();
      const newWidth = e.clientX - rect.left;
      const newHeight = e.clientY - rect.top;

      if (shape.classList.contains('triangle-shape')) {
        shape.style.borderLeftWidth = `${newWidth / 2}px`;
        shape.style.borderRightWidth = `${newWidth / 2}px`;
        shape.style.borderBottomWidth = `${newHeight}px`;
      } else {
        shape.style.width = `${newWidth}px`;
        shape.style.height = `${newHeight}px`;
        if (shape.tagName === 'svg'.toUpperCase()) {
          shape.setAttribute('width', newWidth);
          shape.setAttribute('height', newHeight);
        }
      }
    }

    function stopResize() {
      isResizing = false;
      document.removeEventListener('mousemove', resize);
      document.removeEventListener('mouseup', stopResize);
    }
  }
}
