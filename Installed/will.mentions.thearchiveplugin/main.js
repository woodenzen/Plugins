"use strict";

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
    if (note.filename === 'Target Mentions in Zettelkasten 202406281723' || note.filename === 'Mentions in Zettelkasten 202409112000') {
      return; // Skip the target note
    }

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
  
  // Convert mentionsMap to an array of entries and sort by the number of mentions in descending order
  const sortedMentions = Array.from(mentionsMap.entries()).sort((a, b) => b[1].length - a[1].length);
  
  // Iterate over the sorted mentions array to generate the report
  sortedMentions.forEach(([mention, filenames]) => {
    // Make the list unique
    const uniqueFilenames = makeUniqueList(filenames);
  
    // Sort the list by the last 12 digits of the filename in reverse order
    //STUB - const sortedFilenames = sortFilenames(uniqueFilenames);
  
    // Format the filenames
    // const formattedFilenames = formatFilenames(sortedFilenames);
  
    // Append to the report
    const timesText = uniqueFilenames.length === 1 ? 'time' : 'times';
    report += `#### [[${mention}]] is mentioned ${uniqueFilenames.length} ${timesText} in my ZK.\n`;
    // Comment out the line below to abbreviate the report.
    // report += formattedFilenames.join('\n') + '\n\n';
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

// const report = findMentions(input);

// Format the report
let report = `---
UUID:      ›[[202409112000]] 
cdate:     09-11-2024 8:00PM
tags:      #people #forum-post 
---
# Mentions in Zettelkasten

## Reference
- Track ZK.Forum Mentions
		- bear://x-callback-url/open-note?id=F7D821AB-A841-4B85-986C-6B9E7C90C37D

Forum Memeber Mentions in The Archive
★★★★★★★★★★★★★★★★★★

${findMentions(input)}
`;


console.log(report);
const targetFilename = "Mentions in Zettelkasten 202409112000";

// Set the output with described filename and content
output.changeFile.filename = targetFilename;
output.changeFile.content = report;