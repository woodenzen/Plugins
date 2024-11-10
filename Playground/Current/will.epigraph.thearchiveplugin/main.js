"use strict";

/**
 * ============================================
 *               Search Functionality
 * ============================================
 */

// Ask user to provide a search term.
const searchTerm = app.prompt({
  title: "Beatiful Search",
  description: "Look for epigraphs or beautiful language",
  placeholder: "Search Term",

});

if (searchTerm === undefined || searchTerm.trim() === "") {
  throw new Error("No search term provided by user");
}


function performSearch(searchTerm) {
    // Read all files in the zettelkasten directory
    const files = input.notes.all;
    const results = []; // Initialize the results array

    files.forEach(file => {
        if (!file.content) {
            console.error(`Skipping "${file.filename}" as it contains no content.`);
            return; // Skip files without content
        }

        const lines = file.content.split('\n'); // Corrected from files.content to file.content

        lines.forEach((line, index) => {
              // Check for either '#beautiful-language' or '#epigraph'
              if (
                (line.includes('#beautiful-language') || line.includes('#epigraph')) &&
                lines[index + 1] && // Ensure there is a following line
                lines[index + 1].includes(searchTerm) // Check if the following line includes the searchTerm
            ) {
                const followingLine = lines[index + 1].trim() + "\n";
                if (followingLine) {
                    results.push({ filename: file.filename, line: followingLine });
                }
            }
        });
    });

    // Format the output
    if (results.length > 0) { 
        let draftContent = `# ${results.length} Search Results for "${searchTerm}."\n\n`;
        results.forEach(result => {
            draftContent += `## [[${result.filename}]]\n${result.line}\n---\n`;
        });
        // output.changeFile.content = draftContent.trim();
        // output.changeFile.filename = `Search Results - ${searchTerm}.md`;
        output.pasteboard.content = draftContent;
        output.display.content = draftContent;
    } else {
        const draftContent = `# Search Results for "${searchTerm}"\n\nNo entries were found.`;
        // output.changeFile.content = draftContent;
        // output.changeFile.filename = `Search Results - ${searchTerm}.md`;
        output.pasteboard.content = draftContent;
        output.display.content = draftContent;
    }

    console.log(`Search completed for term: "${searchTerm}"`);
}

// Execute the search function
performSearch(searchTerm);