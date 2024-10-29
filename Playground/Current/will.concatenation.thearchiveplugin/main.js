"use strict";

// Function to prompt for input and output filenames
function promptFilenames() {
  const inputFilename = app.prompt({
    title: "Input Filename",
    description: "Enter the input filename:",
    placeholder: "Input Filename",
    defaultValue: "",
  });
  if (inputFilename === null) { // user clicked cancel
    cancel("Input filename prompt cancelled");
  }

  const outputFilename = app.prompt({
    title: "Output Filename",
    description: "Enter the output filename:",
    placeholder: "Output Filename",
    defaultValue: "",
  });
  if (outputFilename === null) { // user clicked cancel
    cancel("Output filename prompt cancelled");
  }

  return { inputFilename, outputFilename };
}

// Function to read file content (mock implementation)
function readFile(filename) {
  // Replace this with actual file reading logic
  // For example, using fs.readFileSync in Node.js
  console.log(`Reading file: ${filename}`);
  return "File content of " + filename;
}

// Function to extract text between "-----" lines
function extractTextBetweenDashes(content) {
  const regex = /-----\n([\s\S]*?)\n-----/g;
  let matches;
  let extractedText = "";
  while ((matches = regex.exec(content)) !== null) {
    extractedText += matches[1] + "\n";
  }
  return extractedText.trim();
}

// Main function to process the input file and generate the output note
function generateConcatenatedNote() {
  const { inputFilename, outputFilename } = promptFilenames();

  // Read the input file content
  const inputContent = readFile(inputFilename);

  // Print inputFilename and inputContent to log
  console.log("Input Filename:", inputFilename);
  console.log("Input Content:", inputContent);

  // Extract links to files between "-----" lines
  const linkRegex = /-----\n([\s\S]*?)\n-----/g;
  let matches;
  let concatenatedText = "";
  while ((matches = linkRegex.exec(inputContent)) !== null) {
    console.log("Match found:", matches[1]); // Log the matched section
    const links = matches[1].match(/\[\[([^\]]+)\]\]/g);
    if (links) {
      console.log("Links found:", links); // Log the links found
      links.forEach(link => {
        const filename = link.replace(/\[\[|\]\]/g, "");
        console.log(`Processing link: ${link}, Filename: ${filename}`);
        const fileContent = readFile(filename);
        console.log(`File Content of ${filename}:`, fileContent);
        const extractedText = extractTextBetweenDashes(fileContent);
        console.log(`Extracted Text from ${filename}:`, extractedText);
        concatenatedText += extractedText + "\n";
      });
    } else {
      console.log("No links found in this section.");
    }
  }

  // Generate the output note
  const report = `---
UUID:      ›[[202409112000]] 
cdate:     09-11-2024 8:00PM
tags:       
---
# Note Concatenation

This is the output
-----
${concatenatedText.trim()}
-----
References
`;

  // Set the result with described filename and content
  output.changeFile.filename = outputFilename;
  output.changeFile.content = report;

  console.log(report);
}

// Run the main function
generateConcatenatedNote();