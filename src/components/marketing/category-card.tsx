import { Card } from "@/components/ui/card";

export function CategoryCard({
  label,
  description,
  index,
}: Readonly<{
  label: string;
  description: string;
  index?: number;
}>) {
  return (
    <Card className="group h-full p-6 transition-transform duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium tracking-[0.28em] text-emerald-300 uppercase">Category</p>
          <h3 className="mt-3 text-2xl font-semibold text-white">{label}</h3>
        </div>
        {typeof index === "number" ? <span className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">{index}</span> : null}
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-300">{description}</p>
    </Card>
  );
}