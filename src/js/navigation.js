/**
 * ACCESS NATURE - NAVIGATION MODULE
 * Handles mobile hamburger menu and navigation interactions
 */

class Navigation {
  constructor() {
    this.menuToggle = document.getElementById('menuToggle');
    this.navMenu = document.getElementById('navMenu');
    this.navLinks = document.querySelectorAll('.nav-link');
    
    if (this.menuToggle && this.navMenu) {
      this.init();
    }
  }

  init() {
    // Menu toggle click
    this.menuToggle.addEventListener('click', () => this.toggleMenu());
    
    // Close menu when clicking nav links
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => this.closeMenu());
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMenuOpen()) {
        this.closeMenu();
      }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (this.isMenuOpen() && 
          !this.navMenu.contains(e.target) && 
          !this.menuToggle.contains(e.target)) {
        this.closeMenu();
      }
    });
    
    // Highlight active page
    this.setActivePage();
  }

  toggleMenu() {
    const isOpen = this.isMenuOpen();
    this.menuToggle.setAttribute('aria-expanded', !isOpen);
    this.navMenu.classList.toggle('open');
    
    // Prevent body scroll when menu open
    document.body.style.overflow = isOpen ? '' : 'hidden';
  }

  closeMenu() {
    this.menuToggle.setAttribute('aria-expanded', 'false');
    this.navMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  isMenuOpen() {
    return this.menuToggle.getAttribute('aria-expanded') === 'true';
  }

  setActivePage() {
    const currentPage = window.location.pathname;
    this.navLinks.forEach(link => {
      const linkPath = new URL(link.href).pathname;
      if (linkPath === currentPage || 
          (currentPage === '/' && linkPath === '/index.html')) {
        link.classList.add('active');
      }
    });
  }
}

// Initialize navigation when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.navigation = new Navigation();
  });
} else {
  window.navigation = new Navigation();
}

// Disable animations during window resize
let resizeTimer;
window.addEventListener('resize', () => {
  document.body.classList.add('resize-animation-stopper');
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    document.body.classList.remove('resize-animation-stopper');
  }, 400);
});
