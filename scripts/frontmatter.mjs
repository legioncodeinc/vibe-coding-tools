export function parseFrontmatter(text, path, { requireName = true } = {}) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) throw new Error(`Missing frontmatter: ${path}`);
  const fields = {};
  let currentField = null;
  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (field) {
      currentField = field[1];
      const value = field[2].replace(/^['"]|['"]$/g, "");
      fields[currentField] = /^[>|][+-]?$/.test(value) ? "" : value;
    } else if (currentField && /^\s+\S/.test(line)) {
      fields[currentField] = `${fields[currentField]} ${line.trim()}`.trim();
    }
  }
  if ((requireName && !fields.name) || !fields.description) throw new Error(`Frontmatter is missing required fields: ${path}`);
  return { fields, body: text.slice(match[0].length) };
}
