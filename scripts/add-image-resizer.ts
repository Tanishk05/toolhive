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
    where: { slug: 'image-resizer' },
    update: {
      name: 'Image Resizer',
      published: true,
    },
    create: {
      slug: 'image-resizer',
      name: 'Image Resizer',
      summary: 'Resize images instantly by dimensions or percentage. Includes social media presets.',
      description: 'The complete Image Resizer tool. Upload photos and resize them to exact dimensions or scale them by percentage while optionally maintaining the original aspect ratio. Includes handy presets for Instagram Posts, YouTube Thumbnails, X Headers, and more.',
      icon: 'ImagePlus',
      featured: true,
      published: true,
      premium: false,
      popularity: 94,
      accent: 'from-pink-500/30 to-rose-400/10',
      tags: ['image', 'resize', 'photo', 'dimensions', 'scale', 'social media', 'picture'],
      searchTerms: ['image resizer', 'resize image online', 'photo resizer', 'online image resize', 'scale image'],
      seoTitle: 'Image Resizer | Resize Photos & Images Online Free',
      seoDescription: 'Free online image resizer tool. Resize photos by exact dimensions or percentage. Perfect for Instagram, YouTube, LinkedIn banners, and more.',
      seoKeywords: ['image resizer', 'resize image online', 'photo resizer', 'online image resize'],
      seoCanonical: 'https://toolhive.com/tools/image-resizer',
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
