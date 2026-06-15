import { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  description,
}: Readonly<{
  eyebrow: string;
  title: string;
  description?: ReactNode;
}>) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium tracking-[0.3em] text-primary uppercase">{eyebrow}</p>
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h2>
      {description ? <p className="max-w-3xl text-sm leading-6 text-muted-foreground">{description}</p> : null}
    </div>
  );
}