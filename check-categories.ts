import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const tools = await prisma.tool.findMany({
    include: { category: true }
  });
  
  const invalidTools = tools.filter(t => !t.category);
  console.log("Tools with missing category:");
  console.log(JSON.stringify(invalidTools, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
