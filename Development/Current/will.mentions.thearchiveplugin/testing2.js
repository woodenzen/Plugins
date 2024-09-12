"use strict";

// Ask user to provide the filename for the extracted note.
const defaultFreeFilename = app.unusedFilename();
const targetFilename = app.prompt({
  title: "Mentions Note",
  description: "All the forum mentions in the Zettelkasten",
  placeholder: "Filename",
  defaultValue: defaultFreeFilename,
});

if (targetFilename === undefined || targetFilename.trim() === "") {
  throw new Error("No filename provided by user");
}

// Function to find mentions in the target note
function findMentionsInTargetNote(input) {
  // Check if input and input.notes.all are defined
  if (!input || !input.notes || !Array.isArray(input.notes.all)) {
    throw new Error('Invalid input structure. Expected input.notes.all to be an array.');
  }

  const targetFilename = 'Target Mentions in Zettelkasten 202406281723';
  const targetNote = input.notes.all.find(note => note.filename === targetFilename);

  if (!targetNote) {
    throw new Error(`Target note with filename "${targetFilename}" not found`);
  }

  const mentionsSet = new Set();

  // Split the content into words
  const words = targetNote.content.split(/\s+/);

  // Filter words that begin with @ and add them to the set
  words.forEach(word => {
    if (word.startsWith('@')) {
      mentionsSet.add(word);
    }
  });

  // Convert the set to an array
  const mentionsList = Array.from(mentionsSet);

  return mentionsList;
}

// Main function to find mentions
function findMentions(input) {
  // Check if input and input.notes.all are defined
  if (!input || !input.notes || !Array.isArray(input.notes.all)) {
    throw new Error('Invalid input structure. Expected input.notes.all to be an array.');
  }

  // Get the list of mentions from the target note
  const mentionsList = findMentionsInTargetNote(input);

  // Create a map to store filenames for each mention
  const mentionsMap = new Map();

  // Iterate over each note once and collect mentions
  input.notes.all.forEach(note => {
    const contentLower = note.content.toLowerCase();
    mentionsList.forEach(mention => {
      if (contentLower.includes(mention.toLowerCase())) {
        if (!mentionsMap.has(mention)) {
          mentionsMap.set(mention, []);
        }
        mentionsMap.get(mention).push(note.filename);
      }
    });
  });

  let report = '';

  // Iterate over the mentions map to generate the report
  mentionsMap.forEach((filenames, mention) => {
    // Make the list unique
    const uniqueFilenames = makeUniqueList(filenames);

    // Sort the list by the last 12 digits of the filename in reverse order
    const sortedFilenames = sortFilenames(uniqueFilenames);

    // Format the filenames
    const formattedFilenames = formatFilenames(sortedFilenames);

    // Append to the report
    report += `${mention}        ${uniqueFilenames.length} Mentions\n`;
    report += formattedFilenames.join('\n') + '\n\n';
  });

  return report;
}

// Helper functions
function makeUniqueList(filenames) {
  return [...new Set(filenames)];
}

function sortFilenames(filenames) {
  return filenames.sort((a, b) => {
    const aLast12 = a.slice(-12);
    const bLast12 = b.slice(-12);
    return bLast12.localeCompare(aLast12);
  });
}

function formatFilenames(filenames) {
  return filenames.map(filename => {
    const uid = filename.slice(-12);
    const title = filename.slice(0, -13);
    return `${title} [[${uid}]]`;
  });
}

const report = findMentions(input);
console.log(report);

// Set the output with described filename and content
output.changeFile.filename = targetFilename;
output.changeFile.content = report;