# Team Page   
[View our Team page](admin/team.md)

# Status Video 1   
[Status Video #1 Youtube Link](https://youtu.be/EruypN3kkbo)    
[Status Video #1 Repo Link](admin/videos/statusvideo1.mp4)

# Greeting Card Editor – CSE110 Group 22

## Overview

This is the interactive editor for a greeting card web app. Users can add, move, and delete basic shapes on a card using a custom toolbar and navigation bar. The project uses Web Components with encapsulated styles and DOM logic.

---

## My Contribution

I implemented the shape-adding functionality for the editor page:

- Shape selection via toolbar and nav bar (square, circle, rectangle, triangle)
- Inserting shapes on the card at click position
- Moving shapes via dragging or arrow keys
- Deleting shapes using the backspace key
- Visually highlighting selected tools
- Integrating event-driven shape selection and placement

---

## Key Files (under `source/pages/editor_page/`)

| File              | Purpose                                                                 |
|-------------------|-------------------------------------------------------------------------|
| `index.html`      | Editor layout. Hosts card area and imports component scripts.           |
| `index.js`        | Main logic: initializes components, listens for shape selection events, handles shape placement and interactions. |
| `tool-bar-func.js`| Web Component for the horizontal shape selector toolbar.                |
| `top-bar-func.js` | Web Component for the top menu/navigation bar (if present).             |
| `NavBar.js`       | Combined navigation + shape selector bar using buttons and shadow DOM. Emits `"shape-selected"` events and handles visual feedback. |
| `style.css`       | Editor page styling, including card canvas and layout responsiveness.   |

---

## Note

### Why I Changed the Original File Structure

However, I decided to refactor the functionality into a single script file (`index.js` under `editor_page/`) for the following reasons:

- **Simplified debugging** – Managing all shape-related behavior (adding, dragging, recoloring, deleting) in one place made it easier to trace issues.
- **Faster development** – I could iterate quickly without jumping across multiple component files.
- **Easier for the team** – Some teammates were less familiar with custom elements and Shadow DOM, so this approach lowered the barrier for collaboration.
- **More control** – I had direct access to the DOM and styles without worrying about shadow encapsulation or scoped CSS.

This change made the editor easier to build, test, and refine—especially under project deadlines.


Some files were later refactored and renamed under `source/pages/components/`. My original work was developed in the `editor_page/` folder structure.

