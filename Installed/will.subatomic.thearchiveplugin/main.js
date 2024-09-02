"use strict";

// // Ask user to provide the search term.
// const searchTerm = app.prompt({
//   title: "Your Search Term",
//   description: "Enter the term you want to search.",
//   placeholder: "Search Term",
// });

// if (searchTerm === undefined || searchTerm.trim() === "") {
//   throw new Error("No search term provided by user");
// }

// Array of all notes in the user's archive.
const allNotes = input.notes.all;
const searchTerm = "stroy";
let results = [];

// Function to search for the term in the "Subatomic: " line
function searchSubatomicLine(notes, term) {
  notes.forEach(note => {
    const lines = note.content.split('\n');
    for (let line of lines) {
      if (line.startsWith("Subatomic: ")) {
        if (line.includes(term)) {
          const extractedText = line.split("Subatomic: ")[1];
          results.push(`${note.filename}\n${extractedText}`);
          break; // Stop looking in this file once the term is found
        }
      }
    }
  });
}

// Perform the search
searchSubatomicLine(allNotes, searchTerm);

// Format the results as a string
const formattedResults = results
  ? results.join('\n\n') 
  : 'No matching results found.';

// Log the structure of the output object for debugging
console.log("Output object:", JSON.stringify(output, null, 2));

// // Check if output.changeFile is defined before setting its content
// if (output.changeFile && typeof output.changeFile.setContent === 'function') {
//   output.changeFile.setContent(formattedResults);
// } else {
//   console.error("Error: output.changeFile is undefined or does not have a setContent method.");
// }