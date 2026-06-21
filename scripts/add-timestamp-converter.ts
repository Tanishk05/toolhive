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
    where: { slug: 'timestamp-converter' },
    update: {
      name: 'Unix Timestamp Converter',
      published: true,
    },
    create: {
      slug: 'timestamp-converter',
      name: 'Unix Timestamp Converter',
      summary: 'Convert Unix timestamps to readable dates and vice versa. Supports local and UTC timezones.',
      description: 'The ultimate Unix Timestamp Converter. Effortlessly convert epoch timestamps to human-readable dates or generate Unix timestamps from specific dates. Features real-time current timestamp generation, local timezone support, and one-click copy.',
      icon: 'Clock',
      featured: false,
      published: true,
      premium: false,
      popularity: 87,
      accent: 'from-blue-500/30 to-cyan-400/10',
      tags: ['timestamp', 'unix', 'epoch', 'converter', 'date', 'time', 'developer'],
      searchTerms: ['timestamp converter', 'unix timestamp converter', 'epoch converter', 'date to timestamp', 'time converter'],
      seoTitle: 'Unix Timestamp Converter | Epoch Date to Timestamp Tool',
      seoDescription: 'Free online Unix timestamp converter. Convert epoch timestamps to readable dates and vice versa. Supports UTC, local timezones, and real-time generation.',
      seoKeywords: ['timestamp converter', 'unix timestamp converter', 'epoch converter', 'date to timestamp'],
      seoCanonical: 'https://toolhive.com/tools/timestamp-converter',
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
