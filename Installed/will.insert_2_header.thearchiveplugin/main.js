    function addOrReplaceSecondLevelHeader(input, output) {
      // Get the selected text
      const selectedText = input.text.selected;
      
      // Regular expression to match level 2 headers
      const secondLevelHeaderRegex = /^## /;
      
      // Check if the selected text is already a level 2 header
      if (secondLevelHeaderRegex.test(selectedText)) {
        // If it's already a level 2 header, do nothing
        output.insert.setText(selectedText);
        return;
      }
      
      // Regular expression to match any markdown headers
      const headerRegex = /^#+ /;
      
      // Check if the selected text is a markdown header
      if (headerRegex.test(selectedText)) {
        // Replace the header with a level 2 header
        const secondLevelHeader = selectedText.replace(headerRegex, '## ');
        // Replace selection with Second Level Header
        output.insert.setText(secondLevelHeader);
      } else {
      if (secondLevelHeaderRegex.test(selectedText)) {
        // If it's already a level 2 header, do nothing
        output.insert.setText(selectedText);
        return;
      } 
      else {  
        // If no header is found, just add a level 2 header
        const secondLevelHeader2 = `## ${selectedText}`;
        // Replace selection with Second Level Header
        output.insert.setText(secondLevelHeader2);
      }
      }
    }
    
    // Example usage
    addOrReplaceSecondLevelHeader(input, output);