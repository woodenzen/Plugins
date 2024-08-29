const selectedText = input.text.selected;
// Get current date and time
const now = new Date();

// Format the date and time to a 12-digit string
const timestamp = now.getFullYear().toString() +
                  (now.getMonth() + 1).toString().padStart(2, '0') +
                  now.getDate().toString().padStart(2, '0') +
                  now.getHours().toString().padStart(2, '0') +
                  now.getMinutes().toString().padStart(2, '0');

const targetFilename = `My New Note ${timestamp}.md`;

// Move selected text to a new file.
//const targetFilename = output.newFile.filename;
const targetContent = [
  `# ${targetFilename}`,
  "",
  selectedText,
  "" 
// Ensure there's a trailing newline to be a good citizen of plain text files.
].join("\n");
output.newFile.Content = targetContent;



