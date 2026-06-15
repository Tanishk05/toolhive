import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function PricingCard({
  plan,
  price,
  description,
  features,
  featured,
}: Readonly<{
  plan: string;
  price: string;
  description: string;
  features: readonly string[];
  featured?: boolean;
}>) {
  return (
    <Card variant={featured ? "elevated" : "default"} padding="default" className={featured ? "ring-1 ring-primary/40" : ""}>
      {featured ? <p className="text-xs font-medium tracking-[0.28em] text-emerald-300 uppercase">Most popular</p> : null}
      <div className="mt-2 flex items-end justify-between gap-4">
        <div>
          <h3 className="text-2xl font-semibold text-white">{plan}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-semibold tracking-tight text-white">{price}</div>
          <div className="text-sm text-slate-400">per month</div>
        </div>
      </div>
      <ul className="mt-6 space-y-3 text-sm text-slate-300">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" aria-hidden="true" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Button className="mt-8 w-full" variant={featured ? "default" : "outline"}>
        Choose plan
      </Button>
    </Card>
  );
}