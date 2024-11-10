"use strict";

/**
 * ============================================
 *               Search Functionality
 * ============================================
 */

// Function to escape special regex characters in the search term
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escapes characters like ., *, +, etc.
}

// Ask user to provide a search term.
const searchTerm = app.prompt({
  title: "Beautiful Search",
  description: "Look for epigraphs or beautiful language",
  placeholder: "Search Term",
});

if (searchTerm === undefined || searchTerm.trim() === "") {
  throw new Error("No search term provided by user");
}

function performSearch(searchTerm) {
    // Normalize and sanitize the search term for consistent and safe matching (e.g., case-insensitive).
    const trimmedSearchTerm = searchTerm.trim();
    const normalizedSearchTerm = trimmedSearchTerm.toLowerCase();
    const escapedSearchTerm = escapeRegExp(normalizedSearchTerm);
    const searchPattern = new RegExp(`\\b${escapedSearchTerm}\\b`, 'i'); // Word boundaries and case-insensitive

    // Read all files in the zettelkasten directory
    const files = input.notes.all;
    const results = []; // Initialize the results array
    let draftContent = ""; // Initialize draftContent

    files.forEach(file => {
        if (!file.content) {
            console.error(`Skipping "${file.filename}" as it contains no content.`);
            return; // Skip files without content
        }

        const lines = file.content.split('\n'); // Split file content into lines

        lines.forEach((line, index) => {
            // Normalize the current line for case-insensitive comparison.
            const normalizedLine = line.toLowerCase();

            // Check for either '#beautiful-language' or '#epigraph' (case-insensitive).
            if (
                (normalizedLine.includes('#beautiful-language') || normalizedLine.includes('#epigraph')) &&
                lines[index + 1] && // Ensure there is a following line
                lines[index + 1].toLowerCase().includes(normalizedSearchTerm) // Check if the following line includes the searchTerm
            ) {
                const followingLine = '\n' + lines[index + 1].trim();
                if (followingLine.trim()) {
                    console.log(`Match found in "${file.filename}": "${followingLine.trim()}"`);
                    results.push({ filename: file.filename, line: followingLine });
                }
            }
        });
    });

    // Format the search results
    if (results.length > 0) { 
        draftContent += `# ${results.length} Search Results for "${trimmedSearchTerm}."\n\n`;
        results.forEach(result => {
            draftContent += `## [[${result.filename}]]${result.line}\n\n---\n`;
        });
    } else {
        draftContent += `# Search Results for "${trimmedSearchTerm}"\n\nNo entries were found.\n`;
    }

    // Append Super Slogans section
    draftContent = appendSuperSlogans(draftContent, searchPattern, trimmedSearchTerm);

    // Set the output
    output.pasteboard.content = draftContent.trim();
    output.display.content = draftContent.trim();

    console.log(`Search completed for term: "${trimmedSearchTerm}"`);
}

/**
 * Function to append the "Super Slogans" section to draftContent
 *
 * @param {string} draftContent - The existing content to append to
 * @param {RegExp} searchPattern - The regex pattern to search for in Super Slogans
 * @param {string} originalSearchTerm - The original search term for display purposes
 * @returns {string} - The updated draftContent with the Super Slogans section
 */
function appendSuperSlogans(draftContent, searchPattern, originalSearchTerm) {
  // Find the Super Slogans file
  const superSlogansFile = input.notes.all.find(note => note.filename === "L-Super Slogans 202012281549");

  if (superSlogansFile && superSlogansFile.content) {
      const superSlogansLines = superSlogansFile.content
          .split('\n')
          .filter(line => {
              const match = searchPattern.test(line);
              console.log(`Checking line: "${line.trim()}" - Match: ${match}`);
              return match;
          });

      console.log(`Found ${superSlogansLines.length} super slogans containing "${originalSearchTerm}".`);

      if (superSlogansLines.length > 0) {
          draftContent += `\n## ${superSlogansLines.length} Super Slogans\n\n`;
          superSlogansLines.forEach(line => {
              draftContent += `${line.trim()}\n`;
              console.log(`Appending Super Slogan: "${line.trim()}"`);
          });
      } else {
          draftContent += `\n## Super Slogans\n\nNo super slogans found containing the term "${originalSearchTerm}".\n`;
          console.log(`No Super Slogans found containing "${originalSearchTerm}".`);
      }
  } else {
      draftContent += `\n## Super Slogans\n\nFile "L-Super Slogans 202012281549" not found or contains no content.\n`;
      console.warn(`Super Slogans file "L-Super Slogans 202012281549" not found or contains no content.`);
  }

  return draftContent;
}

// Execute the search function
performSearch(searchTerm);