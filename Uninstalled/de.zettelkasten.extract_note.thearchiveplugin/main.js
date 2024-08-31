"use strict";

const selectedText = input.text.selected;

// Ask user to provide the filename for the extracted note.
const defaultFreeFilename = app.unusedFilename();
const targetFilename = app.prompt({
  title: "New Note’s Filename",
  description: "The selected text will be moved into a note with this filename.",
  placeholder: "Filename",
  defaultValue: defaultFreeFilename,
});

if (targetFilename === undefined || targetFilename.trim() === "") {
  throw new Error("No filename provided by user");
}

output.changeFile.filename = targetFilename;

// Assemble extracted note from a simple template.
const targetContent = [
  `# ${targetFilename}`,
  "",
  selectedText,
  "" // Ensure there's a trailing newline to be a good citizen of plain text files.
].join("\n");

output.changeFile.content = targetContent;

// Replace selection with link to extracted note.
output.insert.text = `[[${targetFilename}]]`;
