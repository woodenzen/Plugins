
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

// Function to count notes with the #proofing tag
function countProofingNotes(notes) {
  return notes.filter(note => note.content.includes('#proofing')).length;
}

// Function to extract and count dates from filenames
function countFilesByMonth(notes) {
  let counts = {};
  notes.forEach(note => {
    const match = note.filename.match(/\d{12}/);
    if (match) {
      const dateStr = match[0];
      const year = dateStr.slice(0, 4);
      const month = dateStr.slice(4, 6);
      const key = `${year}-${month}`;
      counts[key] = (counts[key] || 0) + 1;
    }
  });
  return counts;
}

// Function to create a Markdown table from counts
function createMonthlyTable(counts) {
  let years = new Set();
  let months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  // Collect all years from the counts
  Object.keys(counts).forEach(key => {
    years.add(key.slice(0, 4));
  });
  years = Array.from(years).sort();

  // Create the header row
  let table = '| Month | ' + years.join(' | ') + ' |\n';
  table += '|-------|' + '------|'.repeat(years.length) + '\n';

  // Create the rows for each month
  months.forEach((month, index) => {
    let row = `| ${month} |`;
    years.forEach(year => {
      const key = `${year}-${String(index + 1).padStart(2, '0')}`;
      row += ` ${counts[key] || 0} |`;
    });
    table += row + '\n';
  });

  return table;
}

// Calculate the total word count
let totalWordCount = input.notes.all.reduce((acc, note) => acc + countWords(note.content), 0);

// Calculate the total link count
let totalLinkCount = input.notes.all.reduce((acc, note) => acc + countLinks(note.content), 0);

// Calculate the average word count
let averageWordCount = totalNotesCount > 0 ? (totalWordCount / totalNotesCount).toFixed(2) : 0;

// Calculate the average link count
let averageLinkCount = totalNotesCount > 0 ? (totalLinkCount / totalNotesCount).toFixed(2) : 0;

// Calculate the total number of notes with the #proofing tag
let totalProofingNotesCount = countProofingNotes(input.notes.all);

// Calculate the monthly file counts
let monthlyCounts = countFilesByMonth(input.notes.all);

// Create the monthly breakdown table
let monthlyTable = createMonthlyTable(monthlyCounts);

// Use template literals for better formatting
let body = `
Zettelkasten Stats
★★★★★★★★★★★★★★★★★★
Total Number of Notes in Zettelkasten: ${totalNotesCount}
Total Word Count: ${totalWordCount}
Average Word Count: ${averageWordCount}
Total Link Count: ${totalLinkCount}
Average Link Count: ${averageLinkCount}
Total Notes in Proofing Oven: ${totalProofingNotesCount}

Monthly Breakdown:
${monthlyTable}
`;


// Set the output with discribed filename and content
output.changeFile.filename = targetFilename;
output.changeFile.content = body;


