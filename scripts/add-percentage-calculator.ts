import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  let category = await prisma.category.findUnique({
    where: { slug: 'business' }
  });

  if (!category) {
    category = await prisma.category.findFirst();
  }

  if (!category) throw new Error('No categories found');

  const tool = await prisma.tool.upsert({
    where: { slug: 'percentage-calculator' },
    update: {
      name: 'Percentage Calculator',
      published: true,
    },
    create: {
      slug: 'percentage-calculator',
      name: 'Percentage Calculator',
      summary: 'Calculate percentages instantly. Find percentage increase, decrease, difference, and change with step-by-step formulas.',
      description: 'The complete Percentage Calculator provides instant, real-time calculations for a variety of percentage-related math problems. Whether you need to figure out what X% of Y is, calculate percentage growth, determine profit margins, or find the percentage difference between two numbers, this tool gives you accurate results and shows you the exact formula used.',
      icon: 'Percent',
      featured: true,
      published: true,
      premium: false,
      popularity: 95,
      accent: 'from-emerald-500/30 to-teal-400/10',
      tags: ['percentage', 'math', 'calculator', 'finance', 'discount', 'increase', 'decrease'],
      searchTerms: ['percent calculator', 'calculate percentage', 'percentage difference', 'percentage change'],
      seoTitle: 'Percentage Calculator | Instant Percent Change & Difference',
      seoDescription: 'Free online percentage calculator. Instantly calculate percent increase/decrease, what percent one number is of another, and view step-by-step formulas.',
      seoKeywords: ['percentage calculator', 'percent increase calculator', 'percent decrease calculator', 'percentage change calculator', 'online percentage calculator'],
      seoCanonical: 'https://toolhive.com/tools/percentage-calculator',
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
