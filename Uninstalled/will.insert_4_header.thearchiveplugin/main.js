
// text selection
const selectedText = input.text.selected;
const forth_level_header = `#### ${selectedText}`;

// Replace selection with Second Level Header
output.insert.setText(`${forth_level_header}`);
