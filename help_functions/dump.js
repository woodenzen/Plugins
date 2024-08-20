function dump(obj, level = 0) {
    if (typeof obj === 'object' && obj !== null) {
      const indent = "  ".repeat(level + 1);
      const entries = Object.entries(obj).map(([key, value]) => {
        let entry = `${indent}"${key}": `;
        if (typeof value === 'object' && value !== null) {
          entry += dump(value, level + 1).trim();
        } else if (typeof value === 'string') {
          entry += `"${value}"`;
        } else {
          entry += `${value}`;
        }
        return entry;
      });
  
      const joinedEntries = entries.join(",\n");
      const levelPadding = "  ".repeat(level);
      return `{\n${joinedEntries}\n${levelPadding}}`;
    } else {
      return `${obj} (${typeof obj})`;
    }
  }
  