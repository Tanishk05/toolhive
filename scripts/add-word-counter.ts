import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  let category = await prisma.category.findUnique({
    where: { slug: 'content' }
  });

  if (!category) {
    category = await prisma.category.findFirst();
  }

  if (!category) throw new Error('No categories found');

  const tool = await prisma.tool.upsert({
    where: { slug: 'word-counter' },
    update: {
      name: 'Word Counter',
      published: true,
    },
    create: {
      slug: 'word-counter',
      name: 'Word Counter',
      summary: 'Count words, characters, sentences, and analyze keyword density in real-time.',
      description: 'The ultimate text analyzer and word counter. Get instant, real-time statistics for your text including word count, character count, sentence and paragraph counts, estimated reading time, speaking time, reading level, and keyword density. Perfect for writers, editors, students, and SEO professionals.',
      icon: 'Type',
      featured: true,
      published: true,
      premium: false,
      popularity: 98,
      accent: 'from-fuchsia-500/30 to-purple-400/10',
      tags: ['text', 'count', 'writing', 'content', 'seo', 'analyzer'],
      searchTerms: ['word counter', 'character counter', 'reading time calculator', 'text analyzer'],
      seoTitle: 'Word Counter & Text Analyzer | Count Words, Characters & Sentences',
      seoDescription: 'Free online word counter and text analyzer. Calculate word count, character count, reading time, speaking time, and keyword density instantly.',
      seoKeywords: ['word counter', 'character counter', 'online word count', 'text analyzer', 'reading time calculator'],
      seoCanonical: 'https://toolhive.com/tools/word-counter',
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
