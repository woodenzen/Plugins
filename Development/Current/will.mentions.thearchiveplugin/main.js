"use strict";

//SECTION - const selectedText = input.text.selected;

// Ask user to provide the title for the atomized note.
//const defaultFreeFilename = app.unusedFilename();
// const targetFilename = app.prompt({
//   title: "New Note’s Title",
//   description: "The selected text will be used to create a new note with this title.",
//   placeholder: "Title",
// });

// if (targetFilename === undefined || targetFilename.trim() === "") {
//   throw new Error("No filename provided by user");
// }

// Find the template note
const mentionsInput = 'Target Mentions in Zettelkasten 202406281723';
const mentionsNote = input.notes.all.find(note => note.filename === mentionsInput);

if (!mentionsNote) {
  throw new Error(`Mentions Input note with filename "${mentionsInput}" not found`);
}

// Get the content from the template note
let noteContent = mentionsNote.mentionsInput;

// Remove all lines that begin with >>
//SECTION - noteContent = noteContent.split('\n').filter(line => !line.startsWith('>>')).join('\n');

// Format the current date and time
const now = new Date();
const formattedDateTime = new Intl.DateTimeFormat('en-US', {
  month: '2-digit',
  day: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: true
}).format(now);


// Set the title and UID
const uid = app.unusedFilename();
// const title = "Mentions Report";


// Place the defaultFreeFilename, formatted date/time, title, and UID on the first lines of the template content
const newContent = `---
UUID:      ›[[${uid}]]
cdate:      ${formattedDateTime}
tags:       #proofing
---
# ${uid}
${noteContent}


`;

// Ensure output.changeFile is defined
if (!output.changeFile) {
  output.changeFile = {};
}

// Set the output with the described filename
output.changeFile.filename = `${uid} ${uid}`;
output.changeFile.content = newContent;


