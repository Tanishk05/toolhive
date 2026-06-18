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
    <div className="space-y-4">
      <p className="text-xs font-medium tracking-[0.35em] text-primary/80 uppercase">{eyebrow}</p>
      <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">{title}</h2>
      {description ? <p className="max-w-3xl text-base leading-7 text-muted-foreground">{description}</p> : null}
    </div>
  );
}