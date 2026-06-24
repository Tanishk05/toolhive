import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { CollectionsClient } from "./client";

export const metadata = {
  title: "Tool Collections - ToolHive",
  description: "Discover curated tool collections for developers, designers, and creators.",
};

export default async function CollectionsPage() {
  const user = await currentUser();
  let dbUser = null;
  
  if (user) {
    dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
      select: { id: true, name: true, avatarUrl: true },
    });
  }

  // Fetch Public Collections
  const publicCollections = await prisma.collection.findMany({
    where: { isPublic: true },
    include: {
      user: {
        select: {
          name: true,
          avatarUrl: true,
        }
      }
    },
    orderBy: { likesCount: "desc" },
    take: 50,
  });

  // Fetch My Collections
  let myCollections: any[] = [];
  if (dbUser) {
    myCollections = await prisma.collection.findMany({
      where: { userId: dbUser.id },
      orderBy: { createdAt: "desc" },
    });
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <div className="mb-12 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
          Discover <span className="text-primary">Collections</span>
        </h1>
        <p className="text-xl text-muted-foreground">
          Curated stacks of tools for designers, developers, makers, and creators.
        </p>
      </div>

      <CollectionsClient 
        publicCollections={publicCollections} 
        myCollections={myCollections} 
        isAuthenticated={!!dbUser} 
      />
    </div>
  );
}
