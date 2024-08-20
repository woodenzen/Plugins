/**
 * Holds the resulting tag counts we collect.
 *
 * E.g. `tags["zettelkasten"]` will return a number (if #zettelkasten occurs at all) representing the count.
 */
let tags = {};

/** Clean up template string piece for use in regular expression. */
let clean = (piece) =>
  piece
    .replace(/((^|\n)(?:[^\/\\]|\/[^*\/]|\\.)*?)\s*\/\*(?:[^*]|\*[^\/])*(\*\/|)/g, '$1')
    .replace(/((^|\n)(?:[^\/\\]|\/[^\/]|\\.)*?)\s*\/\/[^\n]*/g, '$1')
    .replace(/\n\s*/g, '');

/** Declares the "regex`...`" template literal so that we can comment each line. */
let regex = ({raw}, ...interpolations) =>
  interpolations.reduce(
    (regex, insert, index) => (regex + insert + clean(raw[index + 1])),
    clean(raw[0])
  );

/**
 * Tag matcher.
 *
 * Usage:
 *     "some #hashtag".matchAll(tagRegex)
 *
 * match[0] is the whole tag ("#hashtag")
 * match[1] the tag name without the hash ("hashtag")
 *
 * For the Unicode category names used in \p{...}, see:
 *   https://unicode.org/reports/tr18/#General_Category_Property
 */
let tagRegex = new RegExp(regex`
  (?<=\s|^)   // Require space or beginning of line before the '#'
  #+          // One '#' is required, more than one '#' is allowed
  (                                                                          // (match[1] start)
    [\p{Letter}\p{Number}[-][_+§!:;.]]+                                      // Allow to start hashtag only with a mix of selected punctuation
	[\p{Mark}\p{Letter}\p{Number}\p{Punctuation}\p{Math_Symbol}[-][§!:;.]]*  // Allow almost anything after the start
    [\p{Letter}\p{Number}[-][_§]]+
  )                                                                          // (match[1] end)
`, 'gv');

let ownFilename = output.changeFile.filename;

for (let note of input.notes.all) {
  // Skip the tag overview file itself to not count its tags.
  if (note.filename === ownFilename) { continue; }

  for (let tagMatch of note.content.matchAll(tagRegex)) {
    const tag = tagMatch[1].toString().toLowerCase();
    tags[tag] = (tags[tag] === undefined) ? 1 : tags[tag] + 1;
  }
}

// Object.entries produces [["tagname",123],...]
const sortedTagCountPairs = Object.entries(tags).sort((lhs, rhs) => lhs[1] < rhs[1]);

let body = "Tags:\n";
for (let tagCount of sortedTagCountPairs) {
  body += tagCount[1] + " #" + tagCount[0].toString() + "\n";
}
output.changeFile.setContent(body);
