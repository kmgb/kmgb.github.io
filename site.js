"use strict";

const body = document.body;

// Default to dark theme
let theme = localStorage.getItem('theme');
if (!['dark-theme', 'light-theme'].includes(theme)) {
    theme = 'dark-theme'
    localStorage.setItem('theme', theme);
}

if (theme === 'light-theme')
    body.classList.add(theme);

const themeCheckbox = document.getElementById('theme-checkbox');
themeCheckbox.checked = theme === 'light-theme';

themeCheckbox.addEventListener("change", function (e) {
    let isLightTheme = e.currentTarget.checked;

    if (isLightTheme) {
        body.classList.add('light-theme');
        localStorage.setItem('theme', 'light-theme');
    }
    else {
        body.classList.remove('light-theme');
        localStorage.setItem('theme', 'dark-theme');
    }
});
