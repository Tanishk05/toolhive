import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  let category = await prisma.category.findUnique({
    where: { slug: 'design' }
  });

  if (!category) {
    category = await prisma.category.findFirst();
  }

  if (!category) throw new Error('No categories found');

  const tool = await prisma.tool.upsert({
    where: { slug: 'color-picker' },
    update: {
      name: 'Color Picker & Palette Generator',
      published: true,
    },
    create: {
      slug: 'color-picker',
      name: 'Color Picker & Palette Generator',
      summary: 'Advanced color tools including HEX to RGB conversion, gradient generation, and accessibility checking.',
      description: 'The ultimate tool for designers and developers. Convert colors between HEX, RGB, and HSL seamlessly. Generate beautiful gradients and random palettes instantly. Ensure your designs meet accessibility standards with a built-in contrast checker and WCAG scoring.',
      icon: 'Palette',
      featured: true,
      published: true,
      premium: false,
      popularity: 92,
      accent: 'from-fuchsia-500/30 to-violet-400/10',
      tags: ['color', 'picker', 'palette', 'hex', 'rgb', 'hsl', 'gradient', 'design', 'contrast', 'wcag'],
      searchTerms: ['color picker', 'hex to rgb', 'palette generator', 'gradient generator', 'contrast checker', 'hsl to rgb'],
      seoTitle: 'Color Picker & Palette Generator | HEX, RGB, Gradient Tool',
      seoDescription: 'Free online color picker and palette generator. Convert HEX to RGB, generate CSS gradients, check WCAG contrast, and find perfect color harmonies.',
      seoKeywords: ['color picker', 'hex to rgb', 'palette generator', 'gradient generator'],
      seoCanonical: 'https://toolhive.com/tools/color-picker',
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
