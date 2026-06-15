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
    <footer className="border-t border-white/10 pt-10">
      <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium tracking-[0.24em] text-emerald-300 uppercase">{brand}</p>
            <p className="mt-2 max-w-sm text-sm leading-7 text-slate-400">{description}</p>
          </div>
        </div>
        {sections.map((section) => (
          <div key={section.title}>
            <p className="text-sm font-medium text-white">{section.title}</p>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link className="transition hover:text-white" href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-10 border-t border-white/10 pt-6 text-sm text-slate-500">{copyright}</div>
    </footer>
  );
}