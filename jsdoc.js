#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sourceDir = path.join(__dirname, 'source');
const outputDir = path.join(__dirname, 'docs');
const outputFile = path.join(outputDir, 'index.html');

// Safe fs wrappers for Codacy compliance
function readDirSafe(dirPath) {
  const literalPath = String(dirPath);
  try {
    return fs.readdirSync(literalPath, { withFileTypes: true });
  } catch {
    return [];
  }
}

function readFileSafe(filePath) {
  const literalPath = String(filePath);
  try {
    return fs.readFileSync(literalPath, 'utf8');
  } catch {
    return '';
  }
}

// Recursively collect .js files
function walk(dir, files = []) {
  for (const entry of readDirSafe(dir)) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
    } else if (entry.isFile() && fullPath.endsWith('.js')) {
      files.push(fullPath);
    }
  }
  return files;
}

// Extract /** ... */ + line after it
function extractBlocks(content) {
  const pattern = /\/\*\*[\s\S]*?\*\/\s*([^\n]*)/g;
  const blocks = [];
  let match;

  while ((match = pattern.exec(content))) {
    const comment = match[0].match(/\/\*\*[\s\S]*?\*\//)?.[0] || '';
    const nextLine = match[1].trim();

    let name = '(anonymous)';
    if (/class\s+(\w+)/.test(nextLine)) {
      name = nextLine.match(/class\s+(\w+)/)[1];
    } else if (/function\s+(\w+)/.test(nextLine)) {
      name = nextLine.match(/function\s+(\w+)/)[1];
    } else if (/^(\w+)\s*=/.test(nextLine)) {
      name = nextLine.match(/^(\w+)\s*=/)[1];
    } else if (/^(\w+)\(/.test(nextLine)) {
      name = nextLine.match(/^(\w+)\(/)[1];
    } else if (/customElements\.define\(['"`](.+?)['"`]/.test(nextLine)) {
      name = nextLine.match(/customElements\.define\(['"`](.+?)['"`]/)[1];
    }

    blocks.push({ name, raw: comment });
  }

  return blocks;
}

const escape = s => s.replace(/</g, '&lt;').replace(/>/g, '&gt;');

// HTML generator
function generateHTML(docs) {
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8">
<title>Trojan Horses: JSDocs</title>
<style>
  body { font-family: sans-serif; background: #f4f4f4; padding: 2rem; }
  h1 { font-size: 2rem; }
  h2 { margin-top: 2rem; font-size: 1.25rem; color: #333; border-bottom: 1px solid #ccc; }
  .block { margin: 1rem 0; border-left: 4px solid #0a84ff; background: #fff; padding: 1rem; border-radius: 6px; }
  .fname a { font-weight: bold; color: #005cc5; text-decoration: none; }
  .fname a:hover { text-decoration: underline; }
  pre { margin: 0; font-family: monospace; white-space: pre-wrap; }
</style></head><body>
<h1>Trojan Horses: Project Documentation</h1>
${Object.entries(docs).map(([file, blocks]) => {
  const relPath = path.relative(__dirname, file).replace(/\\/g, '/');
  const fileLink = `<h2><a href="${relPath}" target="_blank">${relPath}</a></h2>`;
  return fileLink + blocks.map(({ name, raw }) => {
    const displayName = name === '(anonymous)' ? path.basename(file, '.js') : name;
    return `
    <div class="block">
      <span class="fname"><a href="${relPath}" target="_blank">${displayName}</a></span>
      <pre>${escape(raw)}</pre>
    </div>`;
  }).join('');
}).join('')}
</body></html>`;
}

// Main logic
(function main() {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const docs = Object.fromEntries(
    walk(sourceDir).map(file => {
      const content = readFileSafe(file);
      const blocks = extractBlocks(content);
      return blocks.length ? [file, blocks] : null;
    }).filter(Boolean)
  );

  try {
    fs.writeFileSync(outputFile, generateHTML(docs));
    console.log(`Docs generated at: ${outputFile}`);
  } catch (err) {
    console.error(`Failed to write output file: ${outputFile}`, err);
  }
})();
