"use strict";

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

// Get the total count of all notes
let totalNotesCount = input.notes.all.length;

// Function to count links in a string
function countLinks(text) {
  const linkRegex = /[ ,§]\[\[/g;
  const matches = text.match(linkRegex);
  return matches ? matches.length : 0;
}

// Function to group notes by the number of links
function groupNotesByLinkCount(notes) {
  let linkCountGroups = {};
  notes.forEach(note => {
    const linkCount = countLinks(note.content);
    if (!linkCountGroups[linkCount]) {
      linkCountGroups[linkCount] = 0;
    }
    linkCountGroups[linkCount]++;
  });
  return linkCountGroups;
}

// Function to get the top ten notes by link count
function getTopTenNotes(notes) {
  return notes
    .map(note => ({ filename: note.filename, linkCount: countLinks(note.content) }))
    .sort((a, b) => b.linkCount - a.linkCount)
    .slice(0, 10);
}

// Group notes by the number of links
let linkCountGroups = groupNotesByLinkCount(input.notes.all);

// Create a table for the link count groups
let linkCountTable = ' Links | Notes\n';
linkCountTable += '-------|-------\n';
Object.keys(linkCountGroups).sort((a, b) => a - b).forEach(linkCount => {
  linkCountTable += `${linkCount.toString().padStart(6, ' ')} | ${linkCountGroups[linkCount]}\n`;
});

// Get the top ten notes by link count
let topTenNotes = getTopTenNotes(input.notes.all);

// Create a listing of the top ten note filenames with link counts
let topTenNotesList = 'Top Ten Notes by Link Count:\n';
topTenNotesList += topTenNotes.map(note => `- ${note.filename} - with ${note.linkCount} links`).join('\n');

// Use template literals for better formatting
let body = `
Zettelkasten Link Stats
★★★★★★★★★★★★★★★★★★
Total Number of Notes in Zettelkasten: ${totalNotesCount}

Link Count Breakdown:
${linkCountTable}
${topTenNotesList}
`;

// Create a new note with discribed filename and content
output.changeFile.filename = targetFilename;
output.changeFile.content = body;