import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { Bookmark } from "lucide-react";
import { Card } from "@/components/ui/card";
import { accountService } from "@/services/account-service";

export default async function SavedToolsPage() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return null;
  }

  const user = await accountService.syncCurrentUser(clerkUser);
  const savedTools = user ? await accountService.getSavedTools(user.id) : [];

  return (
    <section className="space-y-4">
      <div>
        <p className="text-xs font-medium tracking-[0.32em] text-emerald-300 uppercase">Saved Tools</p>
        <h2 className="mt-2 text-3xl font-semibold text-white">Tools you want close at hand</h2>
      </div>

      {savedTools.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {savedTools.map((tool) => (
            <Card key={tool.slug} className="p-6">
              <p className="text-xs font-medium tracking-[0.28em] text-emerald-300 uppercase">{tool.categoryLabel}</p>
              <h3 className="mt-3 text-2xl font-semibold text-white">{tool.name}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">{tool.summary}</p>
              <Link className="mt-5 inline-flex text-sm font-medium text-emerald-300 transition hover:text-emerald-200" href={`/tools/${tool.slug}`}>
                Open tool
              </Link>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <Bookmark className="mx-auto h-8 w-8 text-emerald-300" aria-hidden="true" />
          <h3 className="mt-4 text-xl font-semibold text-white">No saved tools yet</h3>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-400">
            The saved tools model is ready for product interactions. Add save actions to individual tools when those tool
            workspaces are implemented.
          </p>
        </Card>
      )}
    </section>
  );
}
