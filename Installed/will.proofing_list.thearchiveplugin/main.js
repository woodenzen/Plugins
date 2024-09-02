"use strict";

// Ask user to provide the filename for the extracted note.
const defaultFreeFilename = app.unusedFilename();
const targetFilename = app.prompt({
  title: "New Note’s Filename",
  description: "These are the notes needing proofing.",
  placeholder: "Filename",
  defaultValue: defaultFreeFilename,
});

if (targetFilename === undefined || targetFilename.trim() === "") {
  throw new Error("No filename provided by user");
}

// Get the total count of all notes
let totalNotesCount = input.notes.all.length;

// Function to find notes with the #proofing tag
function findProofingNotes(notes) {
  return notes.filter(note => note.content.includes('#proofing'));
}

// Get all notes with the #proofing tag
let proofingNotes = findProofingNotes(input.notes.all);

// Calculate the total number of notes with the #proofing tag
let totalProofingNotesCount = proofingNotes.length;

// Format the proofing notes into a readable string
let formattedProofingNotes = proofingNotes.map(note => `${note.filename}`).join('\n\n');

// Use template literals for better formatting
let body = `
Zettelkasten Stats
★★★★★★★★★★★★★★★★★★
Total Number of Notes in Zettelkasten: ${totalNotesCount}
Total Notes in Proofing Oven: ${totalProofingNotesCount}
Total Notes Ready for Proofing:
${formattedProofingNotes}
`;

// Set the output with described filename and content
output.changeFile.filename = targetFilename;
output.changeFile.content = body;