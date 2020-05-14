"use strict";

const body = document.body;

const theme = localStorage.getItem('theme') || "light-theme";
body.classList.add(theme);

const themeButton = document.getElementById('themeButton');

themeButton.onclick = function() {
    if (body.classList.contains('light-theme'))
    {
        body.classList.replace('light-theme', 'dark-theme');
        localStorage.setItem('theme', 'dark-theme');
    }
    else
    {
        body.classList.replace('dark-theme', 'light-theme');
        localStorage.setItem('theme', 'light-theme');
    }
};