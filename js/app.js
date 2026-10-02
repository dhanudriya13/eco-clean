/**
 * EcoClean Koordinator Aplikasi Global (Bahasa Indonesia)
 * Pengaturan Tema (Gelap/Terang), ScrollSpy Navigasi, Notifikasi Toast & Menu Ponsel
 */

// Sistem Toast Global
window.showToast = function(message, duration = 3500) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>✨</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
};

document.addEventListener('DOMContentLoaded', () => {
  // 1. Pengaturan Tema (Gelap / Terang)
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('ecoclean-theme') || (prefersDark ? 'dark' : 'light');

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ecoclean-theme', theme);
    if (themeToggleBtn) {
      themeToggleBtn.innerHTML = theme === 'dark' 
        ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`
        : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
      themeToggleBtn.setAttribute('title', `Ubah ke Mode ${theme === 'dark' ? 'Terang' : 'Gelap'}`);
    }
  }

  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
  }

  // 2. Efek Scroll Navbar
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  // 3. ScrollSpy Navigasi Aktif
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        currentId = sectionId;
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });

  // 4. Menu Ponsel
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinksList = document.querySelector('.nav-links');

  if (mobileMenuBtn && navLinksList) {
    mobileMenuBtn.addEventListener('click', () => {
      const isVisible = navLinksList.style.display === 'flex';
      if (isVisible) {
        navLinksList.style.display = 'none';
      } else {
        navLinksList.style.display = 'flex';
        navLinksList.style.flexDirection = 'column';
        navLinksList.style.position = 'absolute';
        navLinksList.style.top = '100%';
        navLinksList.style.left = '0';
        navLinksList.style.right = '0';
        navLinksList.style.background = 'var(--bg-surface)';
        navLinksList.style.padding = '24px';
        navLinksList.style.boxShadow = 'var(--shadow-lg)';
        navLinksList.style.borderBottom = '1px solid var(--border-subtle)';
      }
    });

    navLinksList.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          navLinksList.style.display = 'none';
        }
      });
    });
  }
});
