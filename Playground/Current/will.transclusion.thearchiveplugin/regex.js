"use strict";

// Ask user to provide the title for the atomized note.
const defaultFreeFilename = app.unusedFilename();
const targetFilename = app.prompt({
  title: "Transclusion",
  description: "Give your new transclused note a title.",
  placeholder: "Title",
});

if (targetFilename === undefined || targetFilename.trim() === "") {
  throw new Error("No filename provided by user");
}

// New Note's UID
const uid = defaultFreeFilename;
// New Note Name
const title = targetFilename;
//The note with the list of notes to transclude
const templateFilename = input.notes.selected
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

// Retrieve and concatenate content for each filename
let draftContent = "";

// Handle the case where no lines are found
if (linesWith12DigitNumber.length === 0) {
    console.log("No lines with 12-digit numbers found in the template note.");
} else {
    linesWith12DigitNumber.forEach(filename => {
        // Find the corresponding note by filename
        const note = input.notes.all.find(note => note.filename === filename);
        if (note && note.content) {
            // Append the note's content to draftContent
            draftContent += note.content + "\n";
            console.log(`Appended content from "${filename}".`);
        } else {
            console.warn(`Note with filename "${filename}" not found or has no content.`);
            draftContent += `\n<!-- Note "${filename}" not found -->\n`;
        }
    });
}
// Output the concatenated content
console.log("Draft Content:\n", draftContent);
// Set the output with the described filename
output.changeFile.filename = `${title} ${uid}`;
output.changeFile.content = draftContent.trim();

// Step 5: Assign `draftContent` to an output variable
// const outputFilename = "ConcatenatedOutput.md"; // You can modify this or prompt the user

// output.changeFile.filename = outputFilename;
// output.changeFile.content = draftContent.trim();

// Debug: Confirm the output assignment
//console.log(`Output assigned to "${output.changeFile.filename}".`);