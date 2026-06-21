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
    where: { slug: 'url-encoder-decoder' },
    update: {
      name: 'URL Encoder & Decoder',
      published: true,
    },
    create: {
      slug: 'url-encoder-decoder',
      name: 'URL Encoder & Decoder',
      summary: 'Encode or decode URLs and text with zero latency. Safe, secure, and fully client-side.',
      description: 'The definitive URL Encoder and Decoder. Safely encode text strings for secure URL transmission or decode complex URI components back into human-readable text. Features auto-detection, real-time conversion, and full client-side privacy.',
      icon: 'Link2',
      featured: false,
      published: true,
      premium: false,
      popularity: 85,
      accent: 'from-emerald-500/30 to-green-400/10',
      tags: ['url', 'encoder', 'decoder', 'uri', 'developer', 'string', 'web'],
      searchTerms: ['url encoder', 'url decoder', 'encode url online', 'decode url online', 'uri component'],
      seoTitle: 'URL Encoder & Decoder | Convert URI Online Free',
      seoDescription: 'Free online URL encoder and decoder. Convert complex URLs into safe strings, or decode URI components instantly. Zero tracking and 100% secure.',
      seoKeywords: ['url encoder', 'url decoder', 'encode url online', 'decode url online'],
      seoCanonical: 'https://toolhive.com/tools/url-encoder-decoder',
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
