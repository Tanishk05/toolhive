import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { CollectionClient } from "@/features/collections/components/collection-client";

export const metadata = {
  title: "My Collections - ToolHive",
  description: "Manage your personalized tool collections.",
};

export default async function CollectionsPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    select: { id: true },
  });

  if (!dbUser) {
    redirect("/account");
  }

  const collections = await prisma.collection.findMany({
    where: { userId: dbUser.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto max-w-6xl py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Collections</h1>
          <p className="mt-1 text-muted-foreground">Create and manage your custom tool bundles.</p>
        </div>
      </div>
      <CollectionClient initialCollections={collections} />
    </div>
  );
}
