import fs from 'fs';
import path from 'path';

const toolsDir = path.join(process.cwd(), 'src/app/(main)/tools');
const dirs = fs.readdirSync(toolsDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

for (const dir of dirs) {
  const pagePath = path.join(toolsDir, dir, 'page.tsx');
  if (fs.existsSync(pagePath)) {
    let content = fs.readFileSync(pagePath, 'utf8');
    
    // Check if ToolHeaderMobile is already imported
    if (!content.includes('ToolHeaderMobile')) {
      // Add import
      const importStatement = `import { ToolHeaderMobile } from "@/features/tools/components/tool-header-mobile";\n`;
      const importRegex = /(import .*;\n)+/;
      const match = content.match(importRegex);
      if (match) {
        content = content.slice(0, match.index + match[0].length) + importStatement + content.slice(match.index + match[0].length);
      } else {
        content = importStatement + content;
      }
      
      // Inject component inside the first div or section
      const toolComponentRegex = /<Breadcrumbs items={breadcrumbs} \/>/;
      if (toolComponentRegex.test(content)) {
        content = content.replace(
          toolComponentRegex,
          `<ToolHeaderMobile toolName={tool.name} toolSlug={tool.slug} iconName={tool.icon} />\n      <div className="hidden md:block">\n        <Breadcrumbs items={breadcrumbs} />\n      </div>`
        );
      }
      
      fs.writeFileSync(pagePath, content);
      console.log(`Updated ${dir}/page.tsx`);
    }
  }
}
