document.addEventListener('DOMContentLoaded', () => {
  const newsCards = document.querySelectorAll('.news-item');

  newsCards.forEach((card) => {
    card.addEventListener('click', (event) => {
      event.preventDefault();
      window.location.reload();
    });
  });
});
