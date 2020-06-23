"use strict";

// Focus the prompt
const promptInput = document.getElementById('prompt-input');
promptInput.focus();

const promptOutput = document.getElementById('prompt-output');

// Handle keyboard input to ensure it behaves like a terminal
promptInput.onkeydown = function(e) {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        return false;
    }

    if (e.key === "Enter") {
        // Add a previous span to emulate a new terminal line
        // const p = promptInput.parentElement;

        // let newspan = document.createElement("span");
        // newspan.textContent = "$ "+promptInput.textContent;
        // p.insertBefore(newspan, promptInput);

        // p.insertBefore(document.createElement("br"), promptInput);

        processCommand(promptInput.textContent);

        promptInput.textContent = "";

        return false;
    }
}

// When focused, or when the user might change the caret location, reset contents
promptInput.onfocus = promptInput.onmouseup = function(e) {
    promptInput.textContent = "";
}

function processCommand(c) {
    c = c.trim(); // Remove leading and trailing spaces
    promptOutput.textContent = "\xa0"; // &nbsp;

    if (c === "") {
        // Recognize command so it's not unknown
    } else if (c === "help") {
        promptOutput.textContent = "Commands: ls, help, goto <page>";
    } else if (c === "ls") {
        promptOutput.textContent = "index, projectile";
    } else if (c === "goto") {
        promptOutput.textContent = "Usage: goto <page>";
    } else if (c.startsWith("goto ")) {
        let page = c.substring(5).trim();

        switch (page) {
            case "index":
                window.location.href = "./";
                break;
            case "projectile":
                window.location.href = "./projectile.html";
                break;
            default:
                promptOutput.textContent = "Page does not exist, use 'ls' for a list of pages";
                break;
        }
    } else {
        promptOutput.textContent = "Unknown command, use 'help' for a list of commands";
    }
}