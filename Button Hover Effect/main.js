const button = document.querySelector('.button-creative');
const glow = button.querySelector('::before');

button.addEventListener('mousemove', (e) => {
  const rect = button.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  button.style.setProperty('--x', `${x}px`);
  button.style.setProperty('--y', `${y}px`);
});
