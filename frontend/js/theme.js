const THEME_KEY = 'ronin_theme';

function initTheme() {
    const saved = localStorage.getItem(THEME_KEY) || 'light';
    applyTheme(saved);
    updateToggleBtn(saved);
}

function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
    localStorage.setItem(THEME_KEY, theme);
}

function toggleTheme() {
    const current = localStorage.getItem(THEME_KEY) || 'light';
    const next    = current === 'light' ? 'dark' : 'light';
    applyTheme(next);
    updateToggleBtn(next);
}

function updateToggleBtn(theme) {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;
    btn.innerHTML = theme === 'dark'
        ? `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                   d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"/>
           </svg>`
        : `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                   d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
           </svg>`;
}

document.addEventListener('DOMContentLoaded', function() {
    // Fix: move themeToggle inside topbar-right if it's outside
    const btn         = document.getElementById('themeToggle');
    const topbarRight = document.querySelector('.topbar-right');
    if (btn && topbarRight && btn.parentElement !== topbarRight) {
        topbarRight.appendChild(btn);
    }
    initTheme();
});