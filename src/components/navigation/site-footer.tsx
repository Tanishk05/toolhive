import Link from "next/link";

export function SiteFooter({
  brand = "ToolHive",
  description,
  sections,
  copyright = "© 2026 ToolHive. All rights reserved.",
}: Readonly<{
  brand?: string;
  description: string;
  sections: readonly { title: string; links: readonly { label: string; href: string }[] }[];
  copyright?: string;
}>) {
  return (
    <footer className="pt-20 mt-28">
      <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div className="space-y-4">
          <div>
            <p className="text-lg font-bold tracking-tight text-foreground">{brand}</p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground/60">{description}</p>
          </div>
        </div>
        {sections.map((section) => (
          <div key={section.title}>
            <p className="text-xs font-medium tracking-[0.2em] text-muted-foreground/50 uppercase">{section.title}</p>
            <ul className="mt-5 space-y-3.5 text-sm text-muted-foreground/70">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link className="transition-colors hover:text-foreground" href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-16 py-8 text-sm text-muted-foreground/40">{copyright}</div>
    </footer>
  );
}