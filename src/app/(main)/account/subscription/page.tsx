import { currentUser } from "@clerk/nextjs/server";
import { CheckCircle2, CreditCard } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { accountService } from "@/services/account-service";
import { hasPremiumAccess } from "@/lib/auth/subscription";

export default async function SubscriptionPage() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return null;
  }

  const user = await accountService.syncCurrentUser(clerkUser);
  const subscription = user ? await accountService.getSubscriptionStatus(user.id) : null;

  return (
    <section className="grid gap-4 lg:grid-cols-[0.8fr_1fr]">
      <Card className="p-6">
        <CreditCard className="h-6 w-6 text-emerald-300" aria-hidden="true" />
        <p className="mt-5 text-xs font-medium tracking-[0.28em] text-emerald-300 uppercase">Subscription Status</p>
        <h2 className="mt-3 text-3xl font-semibold capitalize text-white">{subscription?.plan ?? "free"}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          Status: <span className="font-medium text-white">{subscription?.status ?? "none"}</span>
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Premium access: <span className="font-medium text-white">{subscription && hasPremiumAccess(subscription) ? "Enabled" : "Disabled"}</span>
        </p>
      </Card>

      <Card className="p-6">
        <p className="text-xs font-medium tracking-[0.28em] text-emerald-300 uppercase">Premium Ready</p>
        <h3 className="mt-3 text-2xl font-semibold text-white">Plan architecture is in place</h3>
        <div className="mt-5 grid gap-3 text-sm text-slate-300">
          {["Free discovery", "Pro gated tools", "Team workspace expansion"].map((item) => (
            <p key={item} className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-300" aria-hidden="true" />
              {item}
            </p>
          ))}
        </div>
        <Button className="mt-6" disabled>
          Billing portal coming soon
        </Button>
      </Card>
    </section>
  );
}
