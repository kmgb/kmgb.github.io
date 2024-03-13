"use strict";

// Focus the prompt automatically so the user can type when loaded
// Putting autofocus in the element could fix this, but autofocus isn't supported on non-inputs except on Chrome and isn't standard
const promptInput = document.getElementById('prompt-input');
promptInput.focus();

const consoleContainer = document.getElementById('console-container');

const validCmds = "ls, help, cd";

// Handle keyboard input to ensure it behaves like a terminal
promptInput.addEventListener('keydown', function (e) {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
    }
    else if (e.key === "Enter") {
        const command = promptInput.textContent;
        promptInput.textContent = "";
        addLineToConsole("# "+command);
        processCommand(command);
        e.preventDefault();

        // Move the scroll position to the prompt input otherwise the text input will be
        // out of view until the user presses a key
        promptInput.blur();
        promptInput.focus();
    }
});

// Fix for the different handling of contenteditables in browsers
// Some of them add <br>s for various reasons in different cases.
// This just removes all <br> tags in the input whenever a change occurs.
// See https://dev.to/takechamp/what-happens-when-you-delete-text-by-backspace-in-a-contenteditable-element-45bg
const promptMutationObserver = new MutationObserver((_mutationList, _observer) => {
    const children = Array.from(promptInput.children);
    const query = children.filter((c) => c.nodeName === "BR");

    for (let q of query) {
        promptInput.removeChild(q);
    }
});

promptMutationObserver.observe(promptInput, { childList: true });

// When focused, or when the user might change the caret location, reset contents
promptInput.addEventListener('focus', clearPromptInput);
promptInput.addEventListener('mouseup', clearPromptInput);

function clearPromptInput() {
    promptInput.textContent = "";
}

function clearConsole() {
    const children = Array.from(consoleContainer.children);
    const query = children.filter((c) => c.id != "prompt-input");

    for (let q of query) {
        consoleContainer.removeChild(q);
    }
}

function addLineToConsole(text) {
    let child = document.createElement("pre");
    child.innerText = text;
    consoleContainer.insertBefore(child, promptInput);
}

function splitInput(text) {
    text = text.trim();
    return text.split(/\s+/);
}

function processCommand(c) {
    c = c.trim();
    if (c == "") {
        return;
    }

    const argv = splitInput(c);

    const command = argv[0];
    const args = argv.slice(1);

    switch (command) {
        case "help":
            addLineToConsole("Commands: "+validCmds);
            break;
        
        case "ls":
            if (args[0] == "-a") {
                addLineToConsole(".. .tanks blog extensions github resume text");
            }
            else {
                addLineToConsole("blog extensions github resume text");
            }
            break;

        case "cd":
            switch (args[0]) {
                case "..":
                case "github":
                    window.location.href = "https://github.com/kmgb/kmgb.github.io";
                    break;
    
                case ".tanks":
                    window.location.href = "./tanks";
                    break;
    
                case "blog":
                    window.location.href = "./blog";
                    break;
    
                case "extensions":
                    window.location.href = "./browser-extensions";
                    break;
    
                case "resume":
                    window.location.href = "./resume";
                    break;
    
                case "text":
                    window.location.href = "./text-analysis";
                    break;
    
                case ".":
                case undefined: // No page specified
                    break;
    
                default:
                    addLineToConsole("Page does not exist '"+page+"'");
                    break;
            }
            break;

        case "clear":
            clearConsole();
            break;
        
        default:
            addLineToConsole("Unknown command, try: "+validCmds);
    }
}
