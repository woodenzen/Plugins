
// text selection
const selectedText = input.text.selected;
const third_level_header = `### ${selectedText}`;

// Replace selection with Second Level Header
output.insert.setText(`${third_level_header}`);
