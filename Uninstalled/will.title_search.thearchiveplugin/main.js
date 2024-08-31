"use strict";

function deepPreventExtensions(object) {
  const propNames = Reflect.ownKeys(object);

  for (const name of propNames) {
    const value = object[name];
    if ((value && typeof value === "object")) {
      deepPreventExtensions(value);
    }
  }

  return Object.preventExtensions(object);
}
deepPreventExtensions(input);
deepPreventExtensions(output);
deepPreventExtensions(utils);
deepPreventExtensions(app);

// Each note object has these properties:
// - `path`: The absolute POSIX path to that file.
// - `filename`: The filename without extension. 
//    (Can be considered the title.)
// - `content`: The full text of the note.

// Array of all notes in the user's archive.
const allNotes = input.notes.all;

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

// Function to search filenames for the term "koan"
function searchFilenames(notes) {
  return notes
    .filter(note => note.filename.toLowerCase().includes("koan"))
    .map(note => note.filename);
}

// Example usage
const matchingFilenames = searchFilenames(allNotes);

// Format the matching filenames as a string
const formattedFilenames = matchingFilenames.length > 0 
  ? matchingFilenames.join('\n') 
  : 'No matching filenames found.';

// Set the contents of the file you specified,
// to be overwritten when the script has finished.
output.changeFile.content = formattedFilenames;