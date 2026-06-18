import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const tools = await prisma.tool.findMany();
  const categories = await prisma.category.findMany();
  
  const categoryIds = new Set(categories.map(c => c.id));
  
  const invalidTools = tools.filter(t => !categoryIds.has(t.categoryId));
  console.log("Tools with missing category:");
  console.log(JSON.stringify(invalidTools, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
