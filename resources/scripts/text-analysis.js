"use strict";

const analysisArea = document.getElementById('analysis-area');
const analysisAreaBreakdown = document.getElementById('analysis-area-breakdown');
const textArea = document.getElementById('analysis-text');

textArea.value = ''; // Clear text area on load, some browsers like to save it as if it's a form

const generatorInput = document.getElementById('custom-glyph-input');
const generatorButton = document.getElementById('custom-glyph-button');
const generatorOutput = document.getElementById('custom-glyph-output');

generatorInput.value = '';
generatorOutput.value = '';

function toHex(i) {
    return (i >>> 0).toString(16).toUpperCase();
}

textArea.addEventListener('input', function () {
    let text = textArea.value;
    let codes = [];
    let codepoints = [];

    for (let i = 0; i < text.length; i++) {
        let code = text.codePointAt(i);

        codes.push(code);
        codepoints.push(toHex(code));

        // Surrogate pair, two 'characters' for one codepoint in UTF-16
        // JavaScript is dumb, thus we must skip an extra character since it doesn't know these two are one
        if (code >= 0x10000)
            i++;
    }

    analysisArea.textContent = codepoints.join(', ');
    //analysisAreaBreakdown.textContent = breakdownCodes(codes);
});

function breakdownCodes(codes) {
    let breakdown = "";

    for (let i = 0; i < codes.length; i++) {
        let code = codes[i];

        if (code <= 0x7F) {
            breakdown += ', '+toHex(code);
        }
        else {
            breakdown += ', [';

            // ... further break down code

            breakdown += ']';
        }
    }

    return breakdown;
}

function generateChar() {
    let codepoint = parseInt(generatorInput.value, 16);

    let value = 'Error';

    if (codepoint >= 0xD800 && codepoint <= 0xDFFF) {
        alert('Cannot generate lone High-Surrogate or Low-Surrogate characters, as JavaScript does not allow it.'
            +'\nYou can use an AutoHotkey script to input them as described at the bottom of this page.');

        value = 'Surrogate character';
    }
    else if (isNaN(codepoint) || !Number.isInteger(codepoint) || codepoint < 0 || codepoint > 0x10FFFF) {
        value = 'Outside of unicode range';
    }
    else {
        value = String.fromCodePoint(codepoint);
    }

    generatorOutput.value = value;
}

generatorInput.addEventListener('keypress', function(e) {
    if (e.key === "Enter") {
        generateChar();
    }
});

generatorButton.onclick = generateChar;
