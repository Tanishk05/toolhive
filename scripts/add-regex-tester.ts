import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  let category = await prisma.category.findUnique({
    where: { slug: 'developer' }
  });

  if (!category) {
    category = await prisma.category.findFirst();
  }

  if (!category) throw new Error('No categories found');

  const tool = await prisma.tool.upsert({
    where: { slug: 'regex-tester' },
    update: {
      name: 'Regex Tester',
      published: true,
    },
    create: {
      slug: 'regex-tester',
      name: 'Regex Tester',
      summary: 'Test and debug regular expressions instantly with live highlighting and cheat sheets.',
      description: 'The ultimate Regex Tester. Build, test, and debug regular expressions with real-time highlighting. Features common regex templates, a comprehensive cheat sheet, and 100% secure client-side execution.',
      icon: 'Regex', // Lucide icon
      featured: false,
      published: true,
      premium: false,
      popularity: 88,
      accent: 'from-orange-500/30 to-amber-400/10',
      tags: ['regex', 'regular expression', 'tester', 'validator', 'developer', 'string'],
      searchTerms: ['regex tester', 'regular expression tester', 'regex validator', 'regex checker', 'test regex'],
      seoTitle: 'Regex Tester | Live Regular Expression Validator',
      seoDescription: 'Free online Regex Tester. Validate and debug regular expressions instantly with live text highlighting, cheat sheets, and common regex templates.',
      seoKeywords: ['regex tester', 'regular expression tester', 'regex validator', 'regex checker'],
      seoCanonical: 'https://toolhive.com/tools/regex-tester',
      categoryId: category.id,
    }
  });

  console.log('Tool added:', tool.name);
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
