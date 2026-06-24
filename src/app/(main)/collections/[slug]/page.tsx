import { notFound, redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getToolRegistry } from "@/features/tools/tool-registry";
import { CollectionDetailClient } from "@/features/collections/components/collection-detail-client";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const collection = await prisma.collection.findUnique({
    where: { slug },
    include: { user: true },
  });

  if (!collection) {
    return { title: "Collection Not Found" };
  }

  return {
    title: `${collection.name} | ToolHive Collections`,
    description: collection.description || `A curated list of ${collection.tools.length} tools.`,
    openGraph: {
      title: collection.name,
      description: collection.description || `A curated list of tools.`,
      images: [collection.coverImage || "/default-collection.png"],
    },
  };
}

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

  // Increment views
  await prisma.collection.update({
    where: { id: collection.id },
    data: { views: { increment: 1 } }
  });

  const allTools = await getToolRegistry();
  const collectionTools = collection.tools.map(tslug => allTools.find(t => t.slug === tslug)).filter(Boolean);

  // structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": collection.name,
    "description": collection.description,
    "numberOfItems": collection.tools.length,
    "itemListElement": collectionTools.map((tool, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "SoftwareApplication",
        "name": tool?.name,
        "url": `https://toolhive.com/tools/${tool?.slug}`
      }
    }))
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container mx-auto max-w-6xl py-8">
        <CollectionDetailClient 
          collection={collection} 
          initialTools={collectionTools} 
          isOwner={isOwner}
          allTools={allTools}
        />
      </div>
    </>
  );
}
