"use strict";

// Set the title and UID
const targetFilename = "Title Search Results";

const defaultFreeFilename = app.unusedFilename();
const uid = defaultFreeFilename;
const title = targetFilename;

// Array of all notes in the user's archive.
const allNotes = input.notes.all;

for (let note of input.notes.all) {
  // Skip the tag overview file itself to not count its tags.
  if (note.filename === ownFilename) { continue; }
}

// Function to search filenames for the term using Boolean logic
function searchFilenames(notes, searchTerm) {
  // Tokenize the search term
  const tokens = tokenize(searchTerm);
  console.log("Tokens:", tokens); // Debugging statement

  // Parse the tokens into an AST
  const ast = parse(tokens);
  console.log("AST:", ast); // Debugging statement

  // Evaluate the AST to get the matching filenames
  const result = evaluate(ast, notes);
  console.log("Matching Filenames:", result); // Debugging statement

  return result;
}

// Tokenize the search term
function tokenize(searchTerm) {
  const regex = /(\bAND\b|\bOR\b|\bNOT\b|\bNEAR\b|\(|\)|"[^"]*"|\*|\S+)/gi;
  return searchTerm.match(regex).map(token => token.replace(/"/g, ''));
}

// Parse the tokens into an AST
function parse(tokens) {
  const output = [];
  const operators = [];
  const precedence = { 'OR': 1, 'AND': 2, 'NOT': 3, 'NEAR': 4 };

  tokens.forEach(token => {
    if (token === '(') {
      operators.push(token);
    } else if (token === ')') {
      while (operators.length && operators[operators.length - 1] !== '(') {
        output.push(operators.pop());
      }
      operators.pop();
    } else if (precedence[token.toUpperCase()]) {
      while (operators.length && precedence[operators[operators.length - 1].toUpperCase()] >= precedence[token.toUpperCase()]) {
        output.push(operators.pop());
      }
      operators.push(token);
    } else {
      output.push(token);
    }
  });

  while (operators.length) {
    output.push(operators.pop());
  }

  return output;
}

// Evaluate the AST to get the matching filenames
function evaluate(ast, notes) {
  const stack = [];
  const allFilenames = notes.map(note => note.filename);
  console.log("All Filenames:", allFilenames); // Debugging statement

  ast.forEach(token => {
    if (token.toUpperCase() === 'AND') {
      const b = stack.pop();
      const a = stack.pop();
      const result = a.filter(x => b.includes(x));
      console.log(`AND operation: ${a} AND ${b} = ${result}`); // Debugging statement
      stack.push(result);
    } else if (token.toUpperCase() === 'OR') {
      const b = stack.pop();
      const a = stack.pop();
      const result = [...new Set([...a, ...b])];
      console.log(`OR operation: ${a} OR ${b} = ${result}`); // Debugging statement
      stack.push(result);
    } else if (token.toUpperCase() === 'NOT') {
      const a = stack.pop();
      const result = allFilenames.filter(x => !a.includes(x));
      console.log(`NOT operation: NOT ${a} = ${result}`); // Debugging statement
      stack.push(result);
    } else if (token.toUpperCase() === 'NEAR') {
      const b = stack.pop();
      const a = stack.pop();
      const result = a.filter(x => b.some(y => Math.abs(allFilenames.indexOf(x) - allFilenames.indexOf(y)) <= 1));
      console.log(`NEAR operation: ${a} NEAR ${b} = ${result}`); // Debugging statement
      stack.push(result);
    } else {
      const wildcardRegex = new RegExp('^' + token.replace(/\*/g, '.*') + '$', 'i');
      const result = allFilenames.filter(filename => wildcardRegex.test(filename));
      console.log(`Wildcard operation: ${token} = ${result}`); // Debugging statement
      stack.push(result);
    }
  });

  const finalResult = stack.pop() || [];
  console.log("Final Result:", finalResult); // Debugging statement
  return finalResult;
}

// Function to format filenames
function formatFilenames(filenames) {
  return filenames.map(filename => {
    const title = filename.slice(0, -13);
    const uid = filename.slice(-12);
    return `[[${uid}]] ${title}`;
  }).join('\n');
}

// Example usage
const matchingFilenames = searchFilenames(allNotes, searchTerm);

// Format the matching filenames as a string
const formattedFilenames = matchingFilenames.length > 0 
  ? formatFilenames(matchingFilenames)
  : 'No matching filenames found.';

// Use template literals for better formatting
let body = `
Titles with the term "${searchTerm}"
★★★★★★★★★★★★★★★★★★
found in ${matchingFilenames.length} notes
${formattedFilenames}
`;

// Ensure output.changeFile is defined
if (!output.changeFile) {
  output.changeFile = {};
}

// Set the output with described filename and content
output.changeFile.filename = `${uid} ${title}`;
output.changeFile.content = body;

console.log(matchingFilenames);
console.log(body);