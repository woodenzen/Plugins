"use strict";

// text selection
const selectedText = input.text.selected;
let forth_level_header;

if (selectedText.trim() === "") {
  forth_level_header = '#### ';
} else {
  forth_level_header = `#### ${selectedText}`;
}

// Replace selection with Fourth Level Header
output.insert.text = `${forth_level_header}`;