const modal = document.getElementById('modal');
const openButtons = document.querySelectorAll('[data-open-modal]');
const closeButton = document.querySelector('.modal-close');
const form = document.getElementById('demo-form');
const note = document.getElementById('demo-note');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

function openModal() {
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
openButtons.forEach(button => button.addEventListener('click', openModal));
closeButton.addEventListener('click', closeModal);
modal.addEventListener('click', event => { if (event.target === modal) closeModal(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeModal(); });
menuToggle.addEventListener('click', () => navLinks.classList.toggle('show'));
navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => navLinks.classList.remove('show')));
form.addEventListener('submit', event => {
  event.preventDefault();
  note.textContent = 'Это демо: данные не отправлены и не сохранены. Для настоящего входа подключи безопасную авторизацию.';
  note.style.color = '#bba7ff';
  form.reset();
});
