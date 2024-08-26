let ownFilename = output.changeFile.filename;

// Get the total count of all notes
let totalNotesCount = input.notes.all.length;

// Function to count words in a string
function countWords(text) {
  return text.split(/\s+/).filter(word => word.length > 0).length;
}

// Function to count links in a string
function countLinks(text) {
  const linkRegex = /[ ,§]\[\[/g;
  const matches = text.match(linkRegex);
  return matches ? matches.length : 0;
}

// Calculate the total word count
let totalWordCount = input.notes.all.reduce((acc, note) => acc + countWords(note.content), 0);

// Calculate the total link count
let totalLinkCount = input.notes.all.reduce((acc, note) => acc + countLinks(note.content), 0);

// Calculate the average word count
let averageWordCount = totalNotesCount > 0 ? (totalWordCount / totalNotesCount).toFixed(2) : 0;

// Calculate the average link count
let averageLinkCount = totalNotesCount > 0 ? (totalLinkCount / totalNotesCount).toFixed(2) : 0;

// Use template literals for better formatting
let body = `
Zettelkasten Stats
★★★★★★★★★★★★★★★★★★
Total Number of Notes in Zettelkasten: ${totalNotesCount}
Total Word Count: ${totalWordCount}
Average Word Count: ${averageWordCount}
Total Link Count: ${totalLinkCount}
Average Link Count: ${averageLinkCount}
`;

output.changeFile.setContent(body);