// ==================== SMOOTH SCROLL FUNCTION ====================
function smoothScroll(targetId) {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
    }
}

// ==================== MOBILE MENU TOGGLE ====================
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        animateMenuToggle();
    });
}

// Close menu when clicking a navigation link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        resetMenuToggle();
    });
});

// ==================== MENU TOGGLE ANIMATION ====================
function animateMenuToggle() {
    const spans = menuToggle.querySelectorAll('span');
    spans.forEach((span, index) => {
        if (navLinks.classList.contains('active')) {
            if (index === 0) span.style.transform = 'rotate(45deg) translateY(10px)';
            if (index === 1) span.style.opacity = '0';
            if (index === 2) span.style.transform = 'rotate(-45deg) translateY(-10px)';
        } else {
            span.style.transform = 'none';
            span.style.opacity = '1';
        }
    });
}

function resetMenuToggle() {
    const spans = menuToggle.querySelectorAll('span');
    spans.forEach(span => {
        span.style.transform = 'none';
        span.style.opacity = '1';
    });
}

// ==================== DYNAMIC BACKGROUND DARKENING ON SCROLL ====================
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.min(scrollY / 500, 1); // Progressive darkening over 500px
    
    // Opacité: de 0.5-0.6 au début à 0.7-0.8 au scroll
    const opacity1 = 0.2 + (scrollPercent * 0.5);
    const opacity2 = 0.3 + (scrollPercent * 0.5);
    
    document.body.style.backgroundImage = `linear-gradient(rgba(10, 18, 10, ${opacity1}), rgba(10, 18, 10, ${opacity2})), url('assets/images/hero-bg.webp')`;
});

// ==================== PROJECTS FILTERING ====================
function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const projectNotices = document.querySelectorAll('.project-notice');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter projects
            const year = button.dataset.year;
            projectCards.forEach(card => {
                if (card.dataset.year === year) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Filter notices
            projectNotices.forEach(notice => {
                if (notice.dataset.year === year) {
                    notice.style.display = 'block';
                } else {
                    notice.style.display = 'none';
                }
            });
        });
    });
    
    // Show only year 2 by default
    projectCards.forEach(card => {
        card.style.display = card.dataset.year === '2' ? 'block' : 'none';
    });
    
    projectNotices.forEach(notice => {
        notice.style.display = notice.dataset.year === '2' ? 'block' : 'none';
    });
    
    // Set year 2 button as active by default
    filterButtons.forEach(btn => {
        if (btn.dataset.year === '2') {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Initialize filters when DOM is ready
document.addEventListener('DOMContentLoaded', setupFilters);

// ==================== PROJECT MODAL ====================
const modal = document.getElementById('projectModal');
const closeBtn = document.querySelector('.modal-close');

function openProjectModal(title, icon, subtitle, details, technologies, downloadUrl, imageUrl, additionalImages, siteUrl) {
    document.getElementById('modalIcon').textContent = icon;
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalSubtitle').textContent = subtitle;
    document.getElementById('modalDetails').textContent = details;
    
    const tagsContainer = document.getElementById('modalTags');
    tagsContainer.innerHTML = technologies
        .map(tech => `<span class="tag">${tech}</span>`)
        .join('');
    
    // Gestion du bouton site
    const siteBtn = document.getElementById('modalSiteBtn');
    if (siteUrl) {
        siteBtn.href = siteUrl;
        siteBtn.style.display = 'block';
    } else {
        siteBtn.style.display = 'none';
    }
    
    const downloadBtn = document.getElementById('modalDownload');
    if (downloadUrl) {
        downloadBtn.href = downloadUrl;
        downloadBtn.style.display = 'block';
        // Changer le texte du bouton selon le type de fichier
        if (downloadUrl.includes('.pdf')) {
            downloadBtn.textContent = 'Télécharger le PDF';
        } else {
            downloadBtn.textContent = 'Télécharger le projet';
        }
    } else {
        downloadBtn.style.display = 'none';
    }
    
    // Gestion de l'image principale
    const imageElement = document.getElementById('modalImage');
    if (imageUrl) {
        imageElement.src = imageUrl;
        imageElement.style.display = 'block';
    } else {
        imageElement.style.display = 'none';
    }
    
    // Gestion des images supplémentaires
    const additionalImagesContainer = document.getElementById('modalAdditionalImages');
    if (additionalImages && additionalImages.length > 0) {
        additionalImagesContainer.innerHTML = additionalImages
            .map(imgUrl => `<img src="${imgUrl}" alt="Image du projet" class="additional-image">`)
            .join('');
        additionalImagesContainer.style.display = 'flex';
    } else {
        additionalImagesContainer.style.display = 'none';
        additionalImagesContainer.innerHTML = '';
    }
    
    modal.classList.add('active');
}

function closeProjectModal() {
    modal.classList.remove('active');
}

closeBtn.addEventListener('click', closeProjectModal);

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeProjectModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeProjectModal();
    }
});

// Remove old projects loading code and keep the rest


// ==================== SCROLL EFFECT ON NAVIGATION ====================
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// ==================== INTERSECTION OBSERVER FOR ANIMATIONS ====================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.animation = 'fadeInUp 0.6s var(--transition-smooth) forwards';
        }
    });
}, observerOptions);

// Observer les éléments à animer
document.querySelectorAll('.project-card, .skill-category, .highlight-item').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// ==================== SKILL PROGRESS ANIMATION ====================
const skillProgressBars = document.querySelectorAll('.skill-progress');
const skillObserverOptions = {
    threshold: 0.5
};

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // La progression s'anime automatiquement via CSS
            entry.target.style.animation = 'progressFill 1.5s var(--transition-smooth) forwards';
            skillObserver.unobserve(entry.target);
        }
    });
}, skillObserverOptions);

skillProgressBars.forEach(bar => {
    skillObserver.observe(bar);
});

// ==================== ACTIVE LINK HIGHLIGHTING ====================
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinksItems = document.querySelectorAll('.nav-links a');

    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop - 200) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinksItems.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
});

// ==================== KEYBOARD SHORTCUTS ====================
document.addEventListener('keydown', (e) => {
    // Fermer le menu avec Échap
    if (e.key === 'Escape' && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        resetMenuToggle();
    }
    
    // Navigation rapide avec les touches fléchées
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        window.scrollBy({ top: 200, behavior: 'smooth' });
    }
    
    if (e.key === 'ArrowUp') {
        e.preventDefault();
        window.scrollBy({ top: -200, behavior: 'smooth' });
    }
});

// ==================== PARALLAX EFFECT (optionnel) ====================
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    if (hero) {
        const scrollPosition = window.scrollY;
        const parallaxElements = hero.querySelectorAll('.hero::before');
        
        // Effet subtil de parallax
        if (scrollPosition < window.innerHeight) {
            hero.style.backgroundPosition = `0% ${scrollPosition * 0.5}px`;
        }
    }
});

// ==================== DEBOUNCE HELPER ====================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ==================== PRELOAD IMAGES ====================
function preloadImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        const src = img.getAttribute('src');
        if (src) {
            const preloadImg = new Image();
            preloadImg.src = src;
        }
    });
}

// Preload when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', preloadImages);
} else {
    preloadImages();
}

// ==================== CONSOLE MESSAGE ====================
console.log(
    '%cBienvenue sur mon Portfolio! 👋',
    'font-size: 20px; font-weight: bold; color: #06b6d4;'
);
console.log(
    '%cFait avec passion et une touche de technologie ✨',
    'font-size: 14px; color: #22d3ee;'
);
