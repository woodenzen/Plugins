"use strict";

// Ask user to provide the filename for the extracted note.
const defaultFreeFilename = app.unusedFilename();
const targetFilename = app.prompt({
  title: "Random Notes from The Archive",
  description: "These are the random notes.",
  placeholder: "RandomNote",
  defaultValue: defaultFreeFilename,
});

if (targetFilename === undefined || targetFilename.trim() === "") {
  throw new Error("No filename provided by user");
}


// Array of all notes in the user's archive.
const allNotes = input.notes.all;

// Function to get a random file from the array
function getRandomFile(notes) {
  const randomIndex = Math.floor(Math.random() * notes.length);
  return notes[randomIndex];
}

// Function to extract date and title from the filename
function extractDateAndTitle(filename) {
  const dateRegex = /(\d{12})/;
  const titleRegex = /^(.*) \d{12}/;

  const dateMatch = filename.match(dateRegex);
  const titleMatch = filename.match(titleRegex);

  if (dateMatch && titleMatch) {
    return {
      date: dateMatch[1],
      title: titleMatch[1]
    };
  }
  return null;
}

// Function to get the date one year ago in 'YYYYMMDD' format
function getDateOneYearAgo() {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 1);
  return date.toISOString().slice(0, 10).replace(/-/g, '');
}

// Main function to get random files
function getRandomFiles(notes, count) {
  let counter = 0;
  const oneYearAgo = getDateOneYearAgo();
  const maxIterations = notes.length * 2; // Safeguard to prevent infinite loop
  let iterations = 0;
  const selectedNotes = [];

  while (counter < count && iterations < maxIterations) {
    const randomNote = getRandomFile(notes);
    const extracted = extractDateAndTitle(randomNote.filename);

    if (extracted && oneYearAgo >= extracted.date) {
      selectedNotes.push(randomNote);
      counter++;
    }
    iterations++;
  }

  if (iterations >= maxIterations) {
    console.log("Reached maximum iterations. Some files might not have been processed.");
  }

  return selectedNotes;
}

// Function to format the selected notes into a readable string
function formatRandomNotes(notes) {
  return notes
    .map(note => {
      const extracted = extractDateAndTitle(note.filename);
      return extracted ? `${extracted.title} ›[[${extracted.date}]]` : note.filename;
    })
    .sort()
    .join('\n');
}

// Example usage
const fileCount = 10;
const randomNotes = getRandomFiles(allNotes, fileCount);
const formattedRandomNotes = formatRandomNotes(randomNotes.sort());

// Use template literals for better formatting
let body = `
Random Notes from The Archive
★★★★★★★★★★★★★★★★★★
${formattedRandomNotes}
`;

console.log(body);
// Set the output with described filename and content
output.changeFile.filename = targetFilename;
output.changeFile.content = body;