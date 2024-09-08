"use strict";

// Ask user to provide the filename for the extracted note.
const defaultFreeFilename = app.unusedFilename();
const targetFilename = app.prompt({
  title: "New Note’s Title",
  description: "Name Your Note!",
  placeholder: "noteTitle",
  //defaultValue: defaultFreeFilename,
});

if (targetFilename === undefined || targetFilename.trim() === "") {
  throw new Error("No filename provided by user");
}

// Find the template note
const templateFilename = '202409012018 T-New Template';
const templateNote = input.notes.all.find(note => note.filename === templateFilename);

if (!templateNote) {
  throw new Error(`Template note with filename "${templateFilename}" not found`);
}

// Get the content from the template note
let templateContent = templateNote.content;

// Remove all lines that begin with >>
templateContent = templateContent.split('\n').filter(line => !line.startsWith('>>')).join('\n');

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
// const title = targetFilename.slice(0, -13);
// const uid = targetFilename.slice(-12);
const uid = defaultFreeFilename;
const title = targetFilename;

// Place the defaultFreeFilename, formatted date/time, title, and UID on the first lines of the template content
const newContent = `---
UUID:      ›[[${uid}]]‹
cdate:      ${formattedDateTime}
tags:       #proofing
---
# ${title}
${templateContent}`;

// Set the output with described filename and content
output.changeFile.filename = `${uid} ${title}`;
output.changeFile.content = newContent;

console.log(`New file created: ${targetFilename}`);