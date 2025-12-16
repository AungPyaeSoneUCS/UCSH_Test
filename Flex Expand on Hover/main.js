const cards = document.querySelectorAll(".card");

// Add "is-active" class to all cards initially
cards.forEach(card => card.classList.add("is-active"));

// Use event delegation for better performance
document.addEventListener("mouseenter", event => {
  const card = event.target.closest(".card");
  if (card) {
    cards.forEach(c => c.classList.remove("is-active"));
    card.classList.add("is-active");
  }
}, true);

document.addEventListener("mouseleave", event => {
  const card = event.target.closest(".card");
  if (card) {
    cards.forEach(c => c.classList.add("is-active"));
  }
}, true);