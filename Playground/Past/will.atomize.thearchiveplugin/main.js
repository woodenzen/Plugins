"use strict";

const selectedText = input.text.selected;

// Ask user to provide the title for the atomized note.
const defaultFreeFilename = app.unusedFilename();
const targetFilename = app.prompt({
  title: "New Note’s Title",
  description: "The selected text will be used to create a new note with this title.",
  placeholder: "Title",
});

if (targetFilename === undefined || targetFilename.trim() === "") {
  throw new Error("No filename provided by user");
}

// Find the template note
const templateFilename = 'T-New Note Prompting 202409012018';
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


// Set the title and UID
const uid = defaultFreeFilename;
const title = targetFilename;


// Place the defaultFreeFilename, formatted date/time, title, and UID on the first lines of the template content
const newContent = `---
UUID:      ›[[${uid}]]
cdate:      ${formattedDateTime}
tags:       #proofing
---
# ${title}
${templateContent}
${selectedText}`;


// Set the output with the described filename
output.changeFile.filename = `${title} ${uid}`;
output.changeFile.content = newContent;

// Replace selection with link to extracted note.
output.insert.text = `[[${uid}]]`;
