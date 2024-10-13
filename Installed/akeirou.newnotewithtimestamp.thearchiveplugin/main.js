/**
 * Plugin for "The Archive"
 * Creates a new note with timestamp and title
 *   - The user is prompted for a title
 *   - The filename is made from the current timestamp and the sanitized title
 *   - A front matter is inserted at the top of the created note
 * 
 * NB:
 *   - The timestamp is precise to the minute
 *   - the front matter structure is hardcoded
 *
 * @summary create new note with timestamp and title
 * @author Bruno Borghi <bruno.borghi@akeirou.com>
 *
 * Created at     : 2024-10-10 18:15:00
 * Last modified  : 2024-10-10 18:15:00
 */


"use strict";

// Ask user to provide the title for the note
const targetTitle = app.prompt({
  title: "New Note with Timestamp",
  description: "Enter title:",
  placeholder: "Title",
  defaultValue: "",
});
if (targetTitle === null) { // user clicked cancel
    cancel("Creation cancelled");
}
  
// Sanitize the title to get a valid file name
// const sanitizedTitle = targetTitle
//     .slice(0,80) // limit title in filename to 80 characters
//     .trim() // remove leading and trailing white spaces
//     .normalize('NFD').replace(/\p{Diacritic}/gu, "") // remove diacritics
//     // .replace(/[^a-z0-9]/gi, '_') // replace special characters with underscore
//     // .replace(/_{2,}/g, '_') // merge several consecutive underscores into one
//     // .toLowerCase();

// Generate the UUID
const now = new Date();
const timestampString = [
  now.getFullYear(),
  ('0' + (now.getMonth() + 1)).slice(-2),
  ('0' + now.getDate()).slice(-2),
  ('0' + now.getHours()).slice(-2),
  ('0' + now.getMinutes()).slice(-2),
].join('');

// Create file
let targetFilename = targetTitle + " " + timestampString 
// if (sanitizedTitle != ""){
//     targetFilename += " " + sanitizedTitle;
// }
output.changeFile.filename = targetFilename;

//Create Human Readable date
const humanReadableDate = [
  ('0' + now.getDate()).slice(-2),
  ('0' + (now.getMonth() + 1)).slice(-2),
  now.getFullYear(),
].join('-');

//Create Human Readable time
const hours24 = now.getHours();
const minutes = ('0' + now.getMinutes()).slice(-2);
  // Determine AM/PM
const ampm = hours24 >= 12 ? 'PM' : 'AM';
  // Convert to 12-hour format
const hours12 = hours24 % 12 || 12; // Convert '0' to '12'
  // Format hours to always have two digits
const formattedHours = ('0' + hours12).slice(-2);
  // Combine the formatted time
const formattedTime = `${formattedHours}:${minutes} ${ampm}`


// Insert dynamic header.
const targetContent = [
    "---",
    `UUID:     ›[[${timestampString}]]`,
    `cdate:    ${humanReadableDate} ${formattedTime}`,  
    "tags:     #proofing",
    "---",
    `# ${targetTitle}`,
    "Subatomic:",
    "" // Ensure there's a trailing newline to be a good citizen of plain text files.
].join("\n");
output.changeFile.content = targetContent;
