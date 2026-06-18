import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { BadgeCheck, Bookmark, CreditCard, Mail } from "lucide-react";
import { Card } from "@/components/ui/card";
import { accountService } from "@/services/account-service";

export default async function AccountPage() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return null;
  }

  const user = await accountService.syncCurrentUser(clerkUser);
  const subscription = user ? await accountService.getSubscriptionStatus(user.id) : null;
  const savedTools = user ? await accountService.getSavedTools(user.id) : [];

  return (
    <section className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
      <Card className="p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          {user?.avatarUrl ? (
            <Image src={user.avatarUrl} alt="" width={80} height={80} className="h-20 w-20 rounded-3xl border border-white/10 object-cover" />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-2xl font-semibold text-white">
              {(user?.name ?? user?.email ?? "U").slice(0, 1).toUpperCase()}
            </div>
          )}
          <div>
            <p className="text-xs font-medium tracking-[0.28em] text-emerald-300 uppercase">Profile</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">{user?.name ?? "ToolHive user"}</h2>
            <p className="mt-2 inline-flex items-center gap-2 text-sm text-slate-400">
              <Mail className="h-4 w-4" aria-hidden="true" />
              {user?.email}
            </p>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <Metric icon={CreditCard} label="Plan" value={subscription?.plan ?? "free"} />
        <Metric icon={BadgeCheck} label="Status" value={subscription?.status ?? "none"} />
        <Metric icon={Bookmark} label="Saved tools" value={String(savedTools.length)} />
      </div>
    </section>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: Readonly<{
  icon: typeof BadgeCheck;
  label: string;
  value: string;
}>) {
  return (
    <Card className="p-6">
      <Icon className="h-5 w-5 text-emerald-300" aria-hidden="true" />
      <p className="mt-4 text-xs font-medium tracking-[0.28em] text-slate-400 uppercase">{label}</p>
      <p className="mt-2 text-2xl font-semibold capitalize text-white">{value}</p>
    </Card>
  );
}
