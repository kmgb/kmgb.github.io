"use strict";

// Focus the prompt automatically so the user can type when loaded
// Putting autofocus in the span could fix this, but autofocus isn't supported on non-inputs except on Chrome and isn't standard
const promptInput = document.getElementById('prompt-input');
promptInput.focus();

const promptOutput = document.getElementById('prompt-output');

const maxCmdLength = 32;

// Handle keyboard input to ensure it behaves like a terminal
promptInput.addEventListener('keydown', function (e) {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
    }
    else if (e.key === "Enter") {
        processCommand(promptInput.textContent);
        promptInput.textContent = "";
        e.preventDefault();
    }
});

promptInput.addEventListener('beforeinput', function (e) {
    // Allow elementary actions like adding text (if there's space) and deleting,
    // but prevent pasting or drag and drop because we would have to correctly
    // slice the added content to match maxCmdLength otherwise, which gets complicated
    if ((e.data && promptInput.textContent.length >= maxCmdLength) || e.dataTransfer) {
        e.preventDefault();
    }
});

// When focused, or when the user might change the caret location, reset contents
promptInput.addEventListener('focus', clearPromptInput);
promptInput.addEventListener('mouseup', clearPromptInput);

function clearPromptInput() {
    promptInput.textContent = "";
}

function processCommand(c) {
    c = c.trim(); // Remove leading and trailing spaces
    promptOutput.textContent = "\xa0"; // &nbsp;

    if (c === "") {
        // Recognize command so it's not unknown
    } else if (c === "help") {
        promptOutput.textContent = "Valid commands: ls, help, cd <page>";
    } else if (c === "ls") {
        promptOutput.textContent = "., .., projectile, text";
    } else if (c === "cd") {
        promptOutput.textContent = "Usage: cd <page>";
    } else if (c.startsWith("cd ")) {
        let page = c.substring(3).trim();

        switch (page) {
            case ".":
                window.location.href = "./";
                break;
            case "..":
                window.location.href = "https://github.com/kmgb/kmgb.github.io";
                break;
            case "projectile":
                window.location.href = "./projectile";
                break;
            case "text":
                window.location.href = "./text-dissect";
                break;
            default:
                promptOutput.textContent = "Page does not exist, use 'ls' for a list of pages";
                break;
        }
    } else {
        promptOutput.textContent = "Unknown command, use 'help' for a list of commands";
    }
}