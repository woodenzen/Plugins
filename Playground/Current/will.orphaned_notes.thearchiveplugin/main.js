"use strict";

var connections = {};

function prepareNote(noteID) {
  if (connections[noteID] === undefined) {
    connections[noteID] = {
      note: undefined,
      hasConnection: false
    };
  }
}

function registerNote(noteID, note) {
  prepareNote(noteID);
  connections[noteID].note = note;
}

function registerConnection(targetID) {
  prepareNote(targetID);
  connections[targetID].hasConnection = true;
}

/**
 * Extract the note identifier from `str` according to the app's settings,
 * if possible; otherwise return `str`.
 */
function identifier(str) {
  let noteID = app.extractNoteID(str);
  if (noteID) {
    return noteID;
  } else {
    return str;
  }
}

// (1) Collect all connections to calculate orphans
const ownFilename = output.changeFile.filename;

// match[0] is the whole link, match[1] the link target string
let wikiLinkRegex = /\[\[(.+?)\]\]/g;
for (let note of input.notes.all) {
  // Skip the orphan file itself so that it doesn't become an orphanage with valid links, skewing the statistics.
  if (note.filename === ownFilename) { continue; }

  let noteID = identifier(note.filename);
  registerNote(noteID, note);

  for (let linkMatch of note.content.matchAll(wikiLinkRegex)) {
    let link = linkMatch[1].toString();
    let targetID = identifier(link);
    registerConnection(targetID);
  }
}

// (2) Go through all processed nodes to find orphans.

let orphanFilenames = [];
// Object.entries produces key-value tuples: [["noteID", {note:...,hasConnection:...}],...]
for (let connection of Object.entries(connections)) {
  let key = connection[0], value = connection[1];
  if (value.hasConnection === false) {
    let orphanedNote = value.note;
    if (orphanedNote) {
      orphanFilenames.push(orphanedNote.filename);
    }
  }
}

// (3) Produce a report.

let body = "Orphans:\n";
for (let filename of orphanFilenames.sort()) {
  body += "- [[" + filename + "]]\n";
}
output.changeFile.content = body;
