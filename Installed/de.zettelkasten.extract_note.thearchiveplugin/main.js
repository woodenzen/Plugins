const selectedText = input.text.selected;

// Move selected text to a new file.
const targetFilename = output.newFile.filename;
const targetContent = [
  `# ${targetFilename}`,
  "",
  selectedText,
  "" // Ensure there's a trailing newline to be a good citizen of plain text files.
].join("\n");
output.newFile.setContent(targetContent);

// Replace selection with link.
output.insert.setText(`[[${targetFilename}]]`);
