const menuButton = document.querySelector('.menu-button');
const siteNav = document.querySelector('.site-nav');
const contactForm = document.querySelector('#contact-form');

menuButton?.addEventListener('click', () => {
  const isOpen = siteNav.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

siteNav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    siteNav.classList.remove('is-open');
    menuButton?.setAttribute('aria-expanded', 'false');
  });
});

contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const status = contactForm.querySelector('.form-status');
  status.textContent = '> signal reçu. Merci pour votre message.';
  contactForm.reset();
});
