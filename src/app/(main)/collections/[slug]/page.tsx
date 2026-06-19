import { notFound, redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getToolRegistry } from "@/features/tools/tool-registry";
import { CollectionDetailClient } from "@/features/collections/components/collection-detail-client";

export default async function CollectionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const user = await currentUser();

  const collection = await prisma.collection.findUnique({
    where: { slug },
    include: { user: { select: { id: true, name: true, avatarUrl: true } } },
  });

  if (!collection) {
    notFound();
  }

  const dbUser = user ? await prisma.user.findUnique({ where: { clerkId: user.id }, select: { id: true } }) : null;
  const isOwner = dbUser?.id === collection.userId;

  if (!collection.isPublic && !isOwner) {
    if (!user) redirect("/sign-in");
    notFound(); // Not authorized
  }

  const allTools = await getToolRegistry();
  const collectionTools = collection.tools.map(tslug => allTools.find(t => t.slug === tslug)).filter(Boolean);

  return (
    <div className="container mx-auto max-w-6xl py-8">
      <CollectionDetailClient 
        collection={collection} 
        initialTools={collectionTools} 
        isOwner={isOwner}
        allTools={allTools}
      />
    </div>
  );
}
