"use strict";

function generateMentionsReport(input, result) {
  // Log the initial state of input and result
  console.log('Initial input:', JSON.stringify(input, null, 2));
  console.log('Initial result:', JSON.stringify(result, null, 2));

  // Check if input and input.notes.all are defined
  if (!input || !input.notes || !Array.isArray(input.notes.all)) {
    throw new Error('Invalid input structure. Expected input.notes.all to be an array.');
  }

  // Find the template note
  const mentionsInput = 'Target Mentions in Zettelkasten 202406281723';
  const mentionsNote = input.notes.all.find(note => note.filename === mentionsInput);
  console.log('mentionsNote:', JSON.stringify(mentionsNote, null, 2));

  if (!mentionsNote) {
    throw new Error(`Mentions Input note with filename "${mentionsInput}" not found`);
  }

  // Array of all notes in the user's archive.
  const allNotes = input.notes.all;
  console.log('allNotes:', JSON.stringify(allNotes, null, 2));

  // Get the content from the template note
  let mentionsContent = mentionsNote.content; // Assuming the content is stored in the 'content' property
  console.log('mentionsContent:', mentionsContent);

  // Split the mentionsContent into lines
  const searchTerms = mentionsContent.split('\n').filter(line => line.trim() !== '');
  console.log('searchTerms:', searchTerms);

  // Initialize the report content
  let reportContent = '';

  // Iterate over each search term
  searchTerms.forEach(term => {
    const termLower = term.toLowerCase().trim();
    const matches = allNotes.filter(note => note.content.toLowerCase().includes(termLower));
    const matchCount = matches.length;

    // Format the results
    reportContent += `## ${term}       ${matchCount} Mentions\n`;
    matches.forEach(match => {
      const matchTitle = match.filename.split(' ').slice(0, -1).join(' ');
      const matchUID = match.filename.split(' ').pop();
      reportContent += `${matchTitle}  [[${matchUID}]]\n`;
    });
    reportContent += '\n';
  });

  console.log('reportContent:', reportContent);

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
  console.log('formattedDateTime:', formattedDateTime);

  // Set the title and UID
  const uid = 'unique-id-123456789012'; // Replace with a function to generate unique IDs if available
  const title = `Mentions in Zettelkasten ${formattedDateTime}`;
  console.log('title:', title);

  // Place the defaultFreeFilename, formatted date/time, title, and UID on the first lines of the template content
  const newContent = `---
UUID:      ›[[${uid}]]
cdate:      ${formattedDateTime}
tags:       #proofing
---
# ${title}
${reportContent}
`;
  console.log('newContent:', newContent);

  // Ensure result.changeFile is defined
  if (!result.changeFile) {
    result.changeFile = {};
  }

  // Set the result with the described filename
  result.changeFile.filename = `${title} ${uid}`;
  result.changeFile.content = newContent;

  // Log the final result to verify its structure
  console.log('result.changeFile:', JSON.stringify(result.changeFile, null, 2));
}

// Example usage
const input = {
  notes: {
    all: [
      { filename: 'Note1 202008291653', content: 'Better Thinking\nSome other content\n@Edmund' },
      { filename: 'Note2 202009301234', content: 'Another note content\n@Edmund' },
      { filename: 'Target Mentions in Zettelkasten 202406281723', content: '@Edmund\nBetter Thinking' }
    ]
  }
};

const result = {};

generateMentionsReport(input, result);
console.log(JSON.stringify(result.changeFile, null, 2));