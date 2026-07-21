// Запусти этот скрипт из папки с сайтом перед каждым коммитом/пушем:
//
//   node generate-files-json.js
//
// Он сканирует текущую папку, находит все файлы (кроме самого сайта
// и служебных файлов) и пересобирает files.json — без всякого API,
// только локальная файловая система.

const fs = require("fs");
const path = require("path");

const FOLDER = __dirname;
const OUTPUT = path.join(FOLDER, "files.json");

const EXCLUDED = new Set([
  "index.html",
  "files.json",
  "generate-files-json.js",
  "readme.md",
  ".gitignore",
  "license",
  "license.md",
  ".git"
]);

const entries = fs.readdirSync(FOLDER, { withFileTypes: true })
  .filter(entry => entry.isFile())
  .filter(entry => !EXCLUDED.has(entry.name.toLowerCase()))
  .map(entry => {
    const fullPath = path.join(FOLDER, entry.name);
    const stat = fs.statSync(fullPath);
    return {
      name: entry.name,
      size: stat.size,
      updated: stat.mtime.toISOString()
    };
  })
  .sort((a, b) => b.updated.localeCompare(a.updated));

fs.writeFileSync(OUTPUT, JSON.stringify(entries, null, 2) + "\n", "utf-8");

console.log(`files.json обновлён: ${entries.length} файлов найдено.`);
entries.forEach(f => console.log(`  ${f.name}`));
