"use strict";

function generateMentionReport(input) {
  // Check if input and input.notes.all are defined
  if (!input || !input.notes || !Array.isArray(input.notes.all)) {
    throw new Error('Invalid input structure. Expected input.notes.all to be an array.');
  }

  const mentionSet = new Set();

  // Iterate over each note
  input.notes.all.forEach(note => {
    // Split the content into words
    const words = note.content.split(/\s+/);

    // Filter words that start with @ and do not contain :
    words.forEach(word => {
      if (word.startsWith('@') && !word.includes(':')) {
        mentionSet.add(word);
      }
    });
  });

  // Convert the set to an array and sort it
  const sortedMentions = Array.from(mentionSet).sort((a, b) => {
    if (a.toUpperCase() === b.toUpperCase()) {
      return a.localeCompare(b);
    }
    return a.toUpperCase().localeCompare(b.toUpperCase());
  });

  // Print the sorted unique words, each on a new line
  sortedMentions.forEach(mention => {
    console.log(mention);
  });
}

generateMentionReport(input);