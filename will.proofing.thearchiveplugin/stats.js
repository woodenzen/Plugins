const fs = require('fs');
const path = require('path');
const pandas = require('pandas-js');
const { TheArchivePath } = require('./archive_path');

// Get the path to the active archive
const directory = TheArchivePath();

// Empty object to store the counts
let counts = {};

// Regular expression pattern to match the UID
const pattern = /20\d{10}/;

// Loop through all the files in the directory
fs.readdirSync(directory).forEach(filename => {
    if (filename.endsWith(".md") || filename.endsWith(".txt")) {
        // Extract the UID from the filename using the regular expression
        const match = filename.match(pattern);
        if (match) {
            const uid = match[0];
            const year = uid.slice(0, 4);
            const month = uid.slice(4, 6);

            // Increment the count for this year and month
            const key = `${year}-${month}`;
            counts[key] = (counts[key] || 0) + 1;
        }
    }
});

// Create a list of dictionaries with months as rows and years as columns
let rows = [];
for (let month = 1; month <= 12; month++) {
    let row = { 'Stats': new Date(0, month - 1).toLocaleString('default', { month: 'long' }) };
    const years = [...new Set(Object.keys(counts).map(key => key.slice(0, 4)))];
    years.push(new Date().getFullYear().toString());
    years.sort();
    years.forEach(year => {
        const key = `${year}-${String(month).padStart(2, '0')}`;
        row[year] = counts[key] || 0;
    });
    rows.push(row);
}

// Convert the list of dictionaries to a Pandas DataFrame
let df = new pandas.DataFrame(rows);

// Reorder the columns to have the years in ascending order
const columns = ['Stats', ...df.columns.slice(1).sort()];
df = df.get(columns);

// Calculate the sum of each year column
const yearlyTotals = df.sum().slice(1);

// Append the yearly totals as a new row to the DataFrame
df = df.append({ 'Stats': 'Yearly Total', ...yearlyTotals.toObject() });

console.log(df.toString());