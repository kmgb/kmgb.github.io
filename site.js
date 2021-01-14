"use strict";

const body = document.body;

// Default to dark theme
const theme = localStorage.getItem('theme');
if (!['dark-theme', 'light-theme'].includes(theme)) {
    theme = 'dark-theme';
    localStorage.setItem('theme', theme);
}
body.classList.add(theme);

const themeButton = document.getElementById('theme-button');

themeButton.onclick = function () {
    if (body.classList.contains('light-theme')) {
        body.classList.replace('light-theme', 'dark-theme');
        localStorage.setItem('theme', 'dark-theme');
    }
    else {
        body.classList.replace('dark-theme', 'light-theme');
        localStorage.setItem('theme', 'light-theme');
    }
};