
// text selection
const selectedText = input.text.selected;
const second_level_header = `## ${selectedText}`;

// Replace selection with Second Level Header
output.insert.setText(`${second_level_header}`);
