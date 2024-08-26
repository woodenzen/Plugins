
// text selection
const selectedText = input.text.selected;
const first_level_header = `# ${selectedText}`;

// Replace selection with Second Level Header
output.insert.setText(`${first_level_header}`);
