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

// Find the template note
const templateFilename = 'T-New Template 202409012018';
const templateNote = input.notes.all.find(note => note.filename === templateFilename);

if (!templateNote) {
  throw new Error(`Template note with filename "${templateFilename}" not found`);
}

// Get the content from the template note
const templateContent = templateNote.content;

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

// Divide the targetFilename into title and UID
const title = targetFilename.slice(0, -13);
const uid = targetFilename.slice(-12);

// Place the defaultFreeFilename, formatted date/time, title, and UID on the first lines of the template content
const newContent = `---
UUID:      ›[[${uid}]]‹
cdate:      ${formattedDateTime}
tags:       #proofing
---
# ${title}
${templateContent}`;

// Set the output with described filename and content
output.changeFile.filename = targetFilename;
output.changeFile.content = newContent;

console.log(`New file created: ${targetFilename}`);