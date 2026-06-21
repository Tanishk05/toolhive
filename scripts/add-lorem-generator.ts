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
    where: { slug: 'lorem-generator' },
    update: {
      name: 'Lorem Ipsum Generator',
      published: true,
    },
    create: {
      slug: 'lorem-generator',
      name: 'Lorem Ipsum Generator',
      summary: 'Generate beautiful, customizable placeholder text for your designs and mockups.',
      description: 'The ultimate Lorem Ipsum Generator. Instantly create custom lengths of placeholder text by words, sentences, or paragraphs. Features one-click copying, HTML tag wrapping, and text downloading for seamless design integration.',
      icon: 'Type',
      featured: false,
      published: true,
      premium: false,
      popularity: 82,
      accent: 'from-zinc-500/30 to-slate-400/10',
      tags: ['lorem ipsum', 'generator', 'text', 'placeholder', 'dummy', 'design', 'mockup'],
      searchTerms: ['lorem ipsum generator', 'placeholder text generator', 'dummy text generator', 'random text', 'lorem text'],
      seoTitle: 'Lorem Ipsum Generator | Free Placeholder Text Tool',
      seoDescription: 'Free online Lorem Ipsum generator. Create custom placeholder and dummy text by paragraphs, sentences, or words. Download or copy as plain text or HTML.',
      seoKeywords: ['lorem ipsum generator', 'placeholder text generator', 'dummy text generator'],
      seoCanonical: 'https://toolhive.com/tools/lorem-generator',
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
