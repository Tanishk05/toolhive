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
    where: { slug: 'text-case-converter' },
    update: {
      name: 'Text Case Converter',
      published: true,
    },
    create: {
      slug: 'text-case-converter',
      name: 'Text Case Converter',
      summary: 'Easily convert text between UPPERCASE, lowercase, camelCase, snake_case, and more.',
      description: 'The ultimate Text Case Converter. Quickly format your text strings into UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case, or InVeRsE cAsE with a single click. Ideal for programmers formatting variable names or writers cleaning up titles.',
      icon: 'LetterText',
      featured: false,
      published: true,
      premium: false,
      popularity: 88,
      accent: 'from-amber-500/30 to-orange-400/10',
      tags: ['text', 'case', 'converter', 'uppercase', 'camelcase', 'snakecase', 'format'],
      searchTerms: ['text case converter', 'uppercase converter', 'camel case converter', 'snake case converter', 'text formatter'],
      seoTitle: 'Text Case Converter | camelCase, snake_case & UPPERCASE Format',
      seoDescription: 'Free online text case converter. Format text to UPPERCASE, lowercase, Title Case, camelCase, snake_case, kebab-case, and more with one click.',
      seoKeywords: ['text case converter', 'uppercase converter', 'camel case converter', 'snake case converter', 'text formatter'],
      seoCanonical: 'https://toolhive.com/tools/text-case-converter',
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
