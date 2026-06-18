import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const mapping: Record<string, string> = {
  'age-calculator': '60c72b2f9b1d8b001c8e4a11', // productivity
  'base64-encoder-decoder': '60c72b2f9b1d8b001c8e4a12', // developer
  'emi-calculator': '60c72b2f9b1d8b001c8e4a13', // business
  'gst-calculator': '60c72b2f9b1d8b001c8e4a13', // business
  'image-compressor': '60c72b2f9b1d8b001c8e4a14', // content
  'json-formatter': '60c72b2f9b1d8b001c8e4a12', // developer
  'jwt-decoder': '60c72b2f9b1d8b001c8e4a12', // developer
  'password-generator': '60c72b2f9b1d8b001c8e4a11', // productivity
  'qr-code-generator': '60c72b2f9b1d8b001c8e4a13', // business
  'unit-converter': '60c72b2f9b1d8b001c8e4a11', // productivity
  'uuid-generator': '60c72b2f9b1d8b001c8e4a12', // developer
};

async function main() {
  for (const [slug, categoryId] of Object.entries(mapping)) {
    await prisma.tool.update({
      where: { slug },
      data: { categoryId }
    });
    console.log(`Updated ${slug} with categoryId ${categoryId}`);
  }
}

main()
  .catch(console.error)
  .finally(async () => { await prisma.$disconnect(); });
