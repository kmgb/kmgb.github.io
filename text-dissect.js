"use strict";

const dissectionAreaDec = document.getElementById('dissection-area-dec');
const dissectionAreaHex = document.getElementById('dissection-area-hex');
const textArea = document.getElementById('dissection-text');

textArea.value = ''; // Clear text area on load, some browsers like to save it as if it's a form

const generatorInput = document.getElementById('custom-glyph-input');
const generatorButton = document.getElementById('custom-glyph-button');
const generatorOutput = document.getElementById('custom-glyph-output');

generatorInput.value = '';
generatorOutput.value = '';

textArea.oninput = function() {
    let text = textArea.value;
    console.log("Dissecting text: "+text);

    var bytes = [];
    var bytesHex = [];

    for (let i = 0; i < text.length; i++) {
        var code = text.charCodeAt(i);
        var hex = (code >>> 0).toString(16).toUpperCase(); // to hex

        bytes = bytes.concat([code]);
        bytesHex = bytesHex.concat([hex]);
    }

    dissectionAreaDec.textContent = bytes.join(', ');
    dissectionAreaHex.textContent = bytesHex.join(', ');
}

generatorButton.onclick = function() {
    let codepoint = parseInt(generatorInput.value, 16);

    console.log(codepoint);

    var value = 'Error';

    if (!isNaN(codepoint) && Number.isInteger(codepoint) && codepoint >= 0 && codepoint <= 0x10FFFF) {
        value = String.fromCodePoint(codepoint);
    }

    console.log(value);

    generatorOutput.value = value;
}