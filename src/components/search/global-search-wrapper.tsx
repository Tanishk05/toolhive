import { getToolRegistry, getToolCategories } from "@/features/tools/tool-registry";
import { prisma } from "@/lib/prisma";
import { CommandPalette } from "./command-palette";

export async function GlobalSearchWrapper() {
  const [tools, categories, blogs] = await Promise.all([
    getToolRegistry(),
    getToolCategories(),
    prisma.blogPost.findMany({
      where: { published: true },
      select: { title: true, slug: true },
      take: 20,
    }),
  ]);

  const searchData = {
    tools,
    categories,
    blogs,
  };

  return <CommandPalette data={searchData} />;
}
