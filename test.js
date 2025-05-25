const btn = document.querySelector('#btn');
const counter = document.querySelector('#counter');
btn.addEventListener('click', () => {
  counter.textContent = +counter.textContent + 1;
});