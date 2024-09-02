"use strict";

// Array of all notes in the user's archive.
const allNotes = input.notes.all;

// Ask user to provide the filename for the extracted note.
const defaultFreeFilename = app.unusedFilename();
const targetFilename = app.prompt({
  title: "Search Term",
  description: "What term do you want to search for in filenames?",
  placeholder: "Term",
  defaultValue: defaultFreeFilename,
});

if (targetFilename === undefined || targetFilename.trim() === "") {
  throw new Error("No search term provided by user");
}

output.changeFile.filename = targetFilename;

// Function to search filenames for the term "story"
function searchFilenames(notes) {
  return notes
    .filter(note => note.filename.toLowerCase().includes("story"))
    .map(note => note.filename);
}

// Example usage
const matchingFilenames = searchFilenames(allNotes);

// Format the matching filenames as a string
const formattedFilenames = matchingFilenames.length > 0 
  ? matchingFilenames.join('\n') 
  : 'No matching filenames found.';

// Use template literals for better formatting
let body = `
Titles with the term "story"
★★★★★★★★★★★★★★★★★★
found in ${matchingFilenames.length} notes
${formattedFilenames}
`;

// Set the output with described filename and content
output.changeFile.filename = targetFilename;
output.changeFile.content = body;