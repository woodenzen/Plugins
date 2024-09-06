"use strict";

// Ask user to provide the filename for the extracted note.
const defaultFreeFilename = app.unusedFilename();
const searchTerm = app.prompt({
  title: "Zettel Title Search",
  description: "Enter the text to search for in note titles.",
  placeholder: "searchTerm",
  //defaultValue: defaultFreeFilename,
});

if (searchTerm === undefined || searchTerm.trim() === "") {
  throw new Error("No search term provided by user");
}
// Set the UID
const uid = defaultFreeFilename

// Set the target filename
const targetFilename = `Title Search Results 202409052100`;
output.changeFile.filename = targetFilename;
let ownFilename = output.changeFile.filename;
// Set the title
const title = targetFilename;


// Array of all notes in the user's archive.
const allNotes = input.notes.all;

for (let note of input.notes.all) {
  // Skip the tag overview file itself to not count its tags.
  if (note.filename === ownFilename) { continue; }
}

// Function to search filenames for the term 
function searchFilenames(notes, searchTerm) {
  return notes
    .filter(note => note.filename.toLowerCase().includes(searchTerm.toLowerCase()))
    .map(note => note.filename);
}

// Function to format filenames
function formatFilenames(filenames) {
  return filenames.map(filename => {
    const title = filename.slice(0, -13);
    const uid = filename.slice(-12);
    return `${title} [[${uid}]]`;
  }).join('\n');
}

// Example usage
const matchingFilenames = searchFilenames(allNotes, searchTerm);

// Format the matching filenames as a string
const formattedFilenames = matchingFilenames.length > 0 
  ? formatFilenames(matchingFilenames)
  : 'No matching filenames found.';

// Use template literals for better formatting
let body = `
Titles with the term "${searchTerm}"
★★★★★★★★★★★★★★★★★★
found in ${matchingFilenames.length} notes
${formattedFilenames}
`;

// Ensure output.changeFile is defined
if (!output.changeFile) {
  output.changeFile = {};
}

// Set the output with described filename and content
output.changeFile.filename = targetFilename;
output.changeFile.content = body;
