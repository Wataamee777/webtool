import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const OUTPUT = path.join(ROOT, "index.html");

const ignore = [
  "node_modules",
  ".git",
  ".github",
  "CNAME"
];

function walk(dir, files = []) {
  for (const item of fs.readdirSync(dir)) {
    if (ignore.includes(item)) continue;

    const full = path.join(dir, item);
    const stat = fs.statSync(full);

    if (stat.isDirectory()) {
      walk(full, files);
    } else if (item.endsWith(".html")) {
      files.push(full.replace(ROOT + path.sep, ""));
    }
  }
  return files;
}

const htmlFiles = walk(ROOT)
  .filter(f => !f.endsWith("html-list.html"))
  .sort();

const list = htmlFiles.map(file => {
  // index.html の場合
  if (file.endsWith("/index.html")) {
    const dir = file.replace("/index.html", "/");
    return `<li><a href="${dir}">${dir}</a></li>`;
  }

  // ルートの index.html
  if (file === "index.html") {
    return `<li><a href="index.html">index.html</a></li>`;
  }

  // 通常の html
  return `<li><a href="${file}">${file}</a></li>`;
}).join("\n");

const html = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<title>TOOLSSS</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
body {
  font-family: system-ui;
  background: #0f172a;
  color: #e5e7eb;
  padding: 20px;
}
a {
  color: #38bdf8;
  text-decoration: none;
}
li {
  margin-bottom: 6px;
}
</style>
</head>
<body>

<h2>TOOL一覧</h2>
<ul>
${list}
</ul>

</body>
</html>`;

fs.writeFileSync(OUTPUT, html);
console.log(`Generated ${htmlFiles.length} entries`);
