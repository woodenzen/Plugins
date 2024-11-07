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
 *   - The output is also copied to the clipboard for placement is other applications
 * 
 * 
 * NB:
 *   - The timestamp is precise to the minute
 *
 * @summary Create new note that is a transclusion/concatenation of other notes
 * @created on     : 2024-10-28 
 * @last modified  : 2024-11-03
 */

//Get the name of the note with the list of notes to transclude
const templateFilename = input.notes.selected
const templateNote = templateFilename[0];

// Remove the UID from the templateNote.filename for later use in greating a new note.
const templateNotename = templateNote.filename.replace(/\b \d{12}\b/,'');

// New Note's UID
const uid = app.unusedFilename();
// New Note Name
const title = templateNotename + " Transclused";
// Read the markdown file
const markdownText = input.text.all;


function findLinesWith12DigitNumber(text) {
    // Regex pattern to find lines with a 12-digit number
    const pattern = /^.*\b\d{12}\b.*$/gm;
    // Find all lines with a 12-digit number
    const linesWith12DigitNumber = text.match(pattern) || [];
    // Filter out lines that start with "UUID"
    const filteredLines = linesWith12DigitNumber.filter(line => !line.startsWith("UUID"));
    // Remove "- ", "[[", and "]]" from each line
    const cleanedLines = filteredLines.map(line =>
        line.replace(/- /g, '').replace(/\[\[|\]\]/g, '')
    );
    return cleanedLines;
}

// Find lines with a 12-digit number in the text
const linesWith12DigitNumber = findLinesWith12DigitNumber(markdownText);





// Prepare the content of the new note
let draftContent = "";

// Handle the case where no lines are found giving the user a hint
if (linesWith12DigitNumber.length === 0) {
    draftContent = `
There are no notes defined to be trancluded in ${templateNotename}.

Reveiw your template file and set every file you want to
transclude on its own line preceeded with "%%% ".
Place them in to order you want them to appear in the transcluded note.
You can interserse them with other text, but the line with each note must start with "%%% ".

    `.trim();
    
} else {
    linesWith12DigitNumber.forEach(filename => {
        // Find the corresponding note by filename
        const note = input.notes.all.find(note => note.filename === filename);
        if (note && note.content) {
            // Append the note's content to draftContent
            draftContent += note.content + "\n";
            console.log(`Appended content from "${filename}".`);
        } else {
            console.error(`Note with filename "${filename}" not found or has no content.`);
            draftContent += `\n<!-- Note "${filename}" not found -->\n`;
        }
    });
}

// Output the concatenated content  
// Set the output with the described filename
output.changeFile.filename = `${title} ${uid}`;
output.changeFile.content = draftContent.trim();
output.pasteboard.content = draftContent.trim();
