// fileParser.js

/**
 * Parses the content of a CSV file into a numerical array.
 * @param {string} content - The content of the CSV file as a string.
 * @returns {number[]} An array of numbers parsed from the CSV file.
 */
function parseCSV(content) {
    const rows = content.split("\n"); // Split by newlines
    const data = [];

    rows.forEach(row => {
        const value = parseFloat(row.trim()); // Trim and convert to number
        if (!isNaN(value)) {
            data.push(value);
        }
    });

    return data;
}

/**
 * Validates if the provided CSV content contains valid numerical data.
 * @param {string} content - The content of the CSV file as a string.
 * @returns {boolean} True if the content is valid, otherwise false.
 */
function validateCSV(content) {
    const rows = content.split("\n");
    return rows.every(row => !isNaN(parseFloat(row.trim())));
}

// Export the functions to be used in main.js
export { parseCSV, validateCSV };
