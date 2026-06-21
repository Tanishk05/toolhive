import fs from 'fs';
import path from 'path';

const toolsDir = path.join(process.cwd(), 'src/app/(main)/tools');
const dirs = fs.readdirSync(toolsDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

dirs.push(''); // For [slug] which is a directory

for (const dir of dirs) {
  const pagePath = path.join(toolsDir, dir, 'page.tsx');
  if (fs.existsSync(pagePath)) {
    let content = fs.readFileSync(pagePath, 'utf8');
    content = content.replace(/iconName=\{tool\.icon\}/g, 'iconName={tool.icon || "tool"}');
    fs.writeFileSync(pagePath, content);
    console.log(`Updated ${dir}/page.tsx`);
  }
}
