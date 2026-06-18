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
    <div className="group h-full rounded-[var(--radius)] bg-surface p-7 transition-all duration-300 hover:-translate-y-1 hover:bg-surface-hover hover:shadow-[0_8px_32px_rgba(0,0,0,0.15)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium tracking-[0.35em] text-primary/70 uppercase">Category</p>
          <h3 className="mt-3 text-xl font-semibold text-foreground">{label}</h3>
        </div>
        {typeof index === "number" ? <span className="rounded-full bg-white/[0.04] px-3 py-1 text-xs text-muted-foreground/50">{index}</span> : null}
      </div>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground/70">{description}</p>
    </div>
  );
}