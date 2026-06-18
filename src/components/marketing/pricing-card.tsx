import { Check } from "lucide-react";
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
    <div className={`rounded-[var(--radius)] p-7 transition-all duration-300 ${featured ? "bg-surface-hover shadow-[0_4px_24px_rgba(0,0,0,0.2),0_16px_64px_rgba(0,0,0,0.16)] ring-1 ring-primary/20" : "bg-surface"}`}>
      {featured ? <p className="text-xs font-medium tracking-[0.35em] text-primary/80 uppercase">Most popular</p> : null}
      <div className="mt-2 flex items-end justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-foreground">{plan}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground/70">{description}</p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold tracking-tight text-foreground">{price}</div>
          <div className="text-sm text-muted-foreground/50">per month</div>
        </div>
      </div>
      <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Button className="mt-8 w-full" variant={featured ? "default" : "outline"}>
        Choose plan
      </Button>
    </div>
  );
}