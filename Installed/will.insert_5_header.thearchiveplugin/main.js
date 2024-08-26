
// text selection
const selectedText = input.text.selected;
const fifth_level_header = `##### ${selectedText}`;

// Replace selection with Second Level Header
output.insert.setText(`${fifth_level_header}`);
