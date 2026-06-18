import Link from "next/link";
import { getLandingContent } from "@/constants/landing-content";

export async function SiteFooter() {
  const content = await getLandingContent();
  
  return (
    <footer className="pt-20 mt-28">
      <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr]">
        <div className="space-y-4">
          <div>
            <p className="text-lg font-bold tracking-tight text-foreground">ToolHive</p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground/60">
              Free, fast, and secure online tools to help you get work done. No downloads or installations required.
            </p>
          </div>
        </div>
        {Object.entries(content.footerLinks).map(([group, items]) => (
          <div key={group}>
            <p className="text-xs font-medium tracking-[0.2em] text-muted-foreground/50 uppercase">{group}</p>
            <ul className="mt-5 space-y-3.5 text-sm text-muted-foreground/70">
              {items.map((item) => (
                <li key={item.label}>
                  <Link className="transition hover:text-foreground" href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-16 flex flex-col gap-4 py-8 text-sm text-muted-foreground/40 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} ToolHive. All rights reserved.</p>
        <p>Built for the web.</p>
      </div>
    </footer>
  );
}
