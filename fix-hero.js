const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/app/\\(main\\)/tools/**/page.tsx');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Reduce p-8 to p-4 md:p-6
  content = content.replace(/<Card className="([^"]*)p-8([^"]*)">/g, '<Card className="$1p-4 md:p-6$2">');
  
  // Reduce icon container mb-6 to mb-4, p-4 to p-3, rounded-3xl to rounded-2xl
  content = content.replace(/mb-6 inline-flex rounded-3xl([^p]*)p-4/g, 'mb-3 inline-flex rounded-2xl$1p-3');
  
  // Reduce h-8 w-8 to h-6 w-6 for the icon
  content = content.replace(/className="h-8 w-8/g, 'className="h-6 w-6');
  
  // Reduce heading size from text-4xl sm:text-5xl to text-2xl sm:text-3xl
  content = content.replace(/text-4xl font-semibold tracking-tight text-[^ ]+ sm:text-5xl/g, 'text-2xl font-bold tracking-tight text-foreground sm:text-3xl');
  content = content.replace(/text-4xl font-semibold tracking-tight text-[^ ]+ sm:text-5xl/g, 'text-2xl font-bold tracking-tight text-foreground sm:text-3xl');
  
  // Also reduce mb-4 on the section to mb-2
  content = content.replace(/<section className="mb-4">/g, '<section className="mb-2">');

  fs.writeFileSync(file, content);
});
console.log(`Updated ${files.length} files`);
