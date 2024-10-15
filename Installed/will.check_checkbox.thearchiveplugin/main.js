"use strict";

// Log the input object to debug its structure
console.log('Input object:', JSON.stringify(input, null, 2));

// Check if input and input.text.selected are defined
if (!input || !input.text || typeof input.text.selected !== 'string') {
  throw new Error('Invalid input structure. Expected input.text.selected to be a string.');
}

// Get the current line where the cursor is located
const currentLine = input.text.selected;

// Ensure input and input.text.selected are defined
if (!input || !input.text || typeof input.text.selected !== 'string') {
  throw new Error('Invalid input structure. Expected input.text.selected to be a string.');
}

// Capture the entire line on which the cursor is located
const selectedText = input.text.selected.trim();

// Define the search and replace terms
const searchTerm = "[ ]";
const replaceTerm = "[X]";

// Perform the search and replace operation
const modifiedLine = selectedText.replace(searchTerm, replaceTerm);

// Ensure output and output.replace are defined
if (!output) {
  output = {};
}
if (!output.replace) {
  output.replace = {};
}

// Update the line with the modified content
output.replace.line = modifiedLine;