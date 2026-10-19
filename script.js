const nav = document.querySelector('.site-nav');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const modal = document.querySelector('#projectModal');

const closeMenu = () => {
    navLinks.classList.remove('active');
    menuToggle.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
};

menuToggle?.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('active');
    menuToggle.classList.toggle('active', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
});
navLinks?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: .12 });
document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

const filters = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const notices = document.querySelectorAll('.project-notice');

function filterProjects(year) {
    filters.forEach(filter => filter.classList.toggle('active', filter.dataset.year === year));
    projectCards.forEach(card => {
        const visible = card.dataset.year === year;
        card.style.display = visible ? '' : 'none';
        if (visible) requestAnimationFrame(() => card.classList.add('is-visible'));
    });
    notices.forEach(notice => notice.classList.toggle('visible', notice.dataset.year === year));
}
filters.forEach(filter => filter.addEventListener('click', () => filterProjects(filter.dataset.year)));
filterProjects('2');

function openProjectModal(title, index, subtitle, details, technologies, downloadUrl, imageUrl, siteUrl) {
    document.querySelector('#modalTitle').textContent = title;
    document.querySelector('#modalIcon').textContent = index;
    document.querySelector('#modalSubtitle').textContent = subtitle;
    document.querySelector('#modalDetails').textContent = details;
    const image = document.querySelector('#modalImage');
    image.hidden = !imageUrl;
    if (imageUrl) {
        image.src = imageUrl;
        image.alt = `Aperçu du projet ${title}`;
    }
    document.querySelector('#modalTags').innerHTML = technologies.map(technology => `<span class="tag">${technology}</span>`).join('');
    const download = document.querySelector('#modalDownload');
    download.hidden = !downloadUrl;
    if (downloadUrl) download.href = downloadUrl;
    const site = document.querySelector('#modalSiteBtn');
    site.hidden = !siteUrl;
    if (siteUrl) site.href = siteUrl;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}
document.querySelector('.modal-close')?.addEventListener('click', closeProjectModal);
modal?.addEventListener('click', event => { if (event.target === modal) closeProjectModal(); });
document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
        closeProjectModal();
        closeMenu();
    }
});

const cursorGlow = document.querySelector('.cursor-glow');
window.addEventListener('pointermove', event => {
    if (cursorGlow) {
        cursorGlow.style.left = `${event.clientX}px`;
        cursorGlow.style.top = `${event.clientY}px`;
    }
}, { passive: true });
