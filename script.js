/* ==========================================================================
   SUMIT PATEL PORTFOLIO - CORE LOGIC & THEME ENGINE
   ========================================================================== */

const THEME_STORAGE_KEY = 'sumit_portfolio_theme';

/**
 * Resolves the effective initial theme:
 * 1. User manual override stored in localStorage
 * 2. System OS preference (prefers-color-scheme)
 * 3. Default fallback to 'light'
 */
function getInitialTheme() {
  try {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme;
    }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  } catch (err) {
    console.warn('LocalStorage unavailable for theme persistence', err);
  }
  return 'light';
}

/**
 * Applies theme attribute to <html> and updates UI controls
 */
function setTheme(theme, persist = true) {
  const root = document.documentElement;
  root.setAttribute('data-theme', theme);

  if (persist) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (err) {}
  }

  // Update theme toggle buttons (both desktop and mobile)
  const toggles = document.querySelectorAll('.theme-toggle-btn');
  const isDark = theme === 'dark';

  toggles.forEach((toggle) => {
    toggle.setAttribute('aria-checked', isDark.toString());
    toggle.setAttribute(
      'title',
      isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'
    );
  });
}

/**
 * Interactive toggle action triggered by user clicks
 */
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  setTheme(next, true);
}

// OS system color scheme listener for automatic adaptation
if (window.matchMedia) {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    // Only adapt automatically if user has not set an explicit manual override
    try {
      if (!localStorage.getItem(THEME_STORAGE_KEY)) {
        setTheme(e.matches ? 'dark' : 'light', false);
      }
    } catch (err) {}
  });
}

// ==========================================================================
// HAMBURGER MENU NAVIGATION
// ==========================================================================

function toggleMenu() {
  const menu = document.querySelector('.menu-links');
  const icon = document.querySelector('.hamburger-icon');
  if (menu && icon) {
    menu.classList.toggle('open');
    icon.classList.toggle('open');
  }
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  const nav = document.getElementById('hamburger-nav');
  const menu = document.querySelector('.menu-links');
  const icon = document.querySelector('.hamburger-icon');
  if (menu && menu.classList.contains('open') && nav && !nav.contains(e.target)) {
    menu.classList.remove('open');
    if (icon) icon.classList.remove('open');
  }
});

// ==========================================================================
// PROJECT CATEGORY FILTERING
// ==========================================================================

function filterProjects(category) {
  // Update active state on filter buttons
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach((btn) => {
    if (btn.getAttribute('data-filter') === category) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Filter project cards and section group headers
  const cards = document.querySelectorAll('.project-card');
  cards.forEach((card) => {
    const cardCategory = card.getAttribute('data-category');
    if (category === 'all' || cardCategory === category) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });

  // Toggle group headers visibility based on category
  const aiHeader = document.getElementById('ai-projects-header');
  const webHeader = document.getElementById('web-projects-header');

  if (aiHeader) {
    aiHeader.style.display = category === 'all' || category === 'ai' ? 'flex' : 'none';
  }
  if (webHeader) {
    webHeader.style.display = category === 'all' || category === 'fullstack' ? 'flex' : 'none';
  }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  // Sync toggle controls state with active theme
  const activeTheme = document.documentElement.getAttribute('data-theme') || getInitialTheme();
  setTheme(activeTheme, false);
});