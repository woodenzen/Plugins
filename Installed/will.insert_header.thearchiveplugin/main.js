    function processNotes(input, output) {
        // Check if input.notes is defined
        if (!input || !input.notes) {
            console.error("Error: input.notes is undefined.");
            return;
        }
        
        // Check if input.notes.all is defined
        if (!input.notes.all) {
            console.error("Error: input.notes.all is undefined.");
            return;
        }
        
        // Array of all notes in the user's archive.
        const allNotes = input.notes.all;
        
        // Get the selected text from the editor
        const selectedText = input.selection.text;
        
        // Initialize an array to store matching filenames
        let matchingFilenames = [];
        
        // Loop through each note and check if the filename contains the selected text
        for (let note of allNotes) {
            if (note.filename.includes(selectedText)) {
                matchingFilenames.push(note.filename);
            }
        }
        
        // Format the results as a list
        let resultText = "Search Results:\n";
        for (let filename of matchingFilenames) {
            resultText += "- " + filename + "\n";
        }
        
        // Set the contents of a new file that the app should create when the script has finished
        output.newFile.setContent(resultText);
    }
    
    // Example input and output objects
    const input = {
        notes: {
            all: [
                { filename: "note1.txt" },
                { filename: "note2.txt" },
                { filename: "selectedNote.txt" }
            ]
        },
        selection: {
            text: "note"
        }
    };
    
    const output = {
        newFile: {
            setContent: function(content) {
                console.log("New file content set to:\n" + content);
            }
        }
    };
    
    // Example call to the function
    processNotes(input, output);