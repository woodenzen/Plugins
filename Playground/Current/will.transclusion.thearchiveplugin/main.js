"use strict";

/**
 * Plugin for "The Archive"
 * Creates a document for concatenating notes
 *   - The user must have the template note open
 *   - The template note must contain a list of note titles or links
 *   - One on each line in the order desired
 *   - Everything else in the template file will be ignored
 *   - The user is prompted for a title for the output file
 *   - The filename is made with the current timestamp
 *   - No front matter is inserted at the top of the created note
 * 
 * 
 * NB:
 *   - The timestamp is precise to the minute
 *
 * @summary Create new note that is a transclusion/concatenation of other notes
 * @created on     : 2024-10-28 
 * @last modified  : 2024-11-02 
 */



// Function to prompt for input and output filenames
function promptFilenames() {
  const inputFilename = app.prompt({
    title: "Input Note",
    description: "Enter the input note:",
    placeholder: "Input Note with Links",
    defaultValue: "",
  });
  if (inputFilename === null) { // user clicked cancel
    cancel("Input note name prompt cancelled");
  }

  const outputNotename = app.prompt({
    title: "New Note Name!",
    description: "Enter the new note's name:",
    placeholder: "New Note Name",
    defaultValue: "",
  });
  if (outputNotename === null) { // user clicked cancel
    cancel("Output note name prompt cancelled");
  }

  return { inputFilename, outputNotename };
}

// Main function to process the input file and generate the output note
function generateConcatenatedNote() {
  const { inputFilename, outputNotename } = promptFilenames();

  // Find the template note
  const templateNote = input.notes.all.find(note => note.filename === inputFilename);
  if (!templateNote) {
    throw new Error(`Template note with filename "${inputFilename}" not found`);
  }

  // Get the content from the template note
  let templateContent = templateNote.content;

  // Extract filenames from the template content
  const filenames = templateContent.split('%%%')[1].trim().split('\n');

  // Create a dictionary of file contents
  const fileContent = {};
  filenames.forEach(filename => {
    const note = input.notes.all.find(note => note.filename === filename.trim());
    if (note) {
      fileContent[filename.trim()] = note.content;
    } else {
      fileContent[filename.trim()] = `Note with filename "${filename.trim()}" not found`;
    }
  });

  // Concatenate the content of each file
  let draftContent = "";
  filenames.forEach(filename => {
    const content = fileContent[filename.trim()];
    draftContent += content + "\n";
  });

  // Extract content between %%% blocks
  const match = draftContent.match(/%%%([\s\S]*?)%%%/);
  const updatedDraftContent = match ? match[1].trim() : "";

//TODO - only 3 dashs are needed to separate the notes

  // Replace each YAML block with "\n\n★★★\n\n"
  const firstDraft = draftContent.replace(/^---[\s\S]*?^---/gm, "\n\n★★★\n\n");
  
  // Set the title and UID
const uid = app.unusedFilename();
const title = outputNotename;

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



  // Generate the output note
  const report = `---
UUID:      ›[[${uid}]]
cdate:     ${formattedDateTime}
tags:      #proofing 
---
# ${outputNotename}


${firstDraft.trim()}
`;

  // Set the result with described filename and content
  // Uncomment the following lines to create the output note instead of just displaying it.
  // output.changeFile.filename = `${uid} ${title}`;
  // output.changeFile.content = report;
  output.display.content = firstDraft.trim();

}


// Run the main function
generateConcatenatedNote();