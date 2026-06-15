import Link from "next/link";

export function Breadcrumbs({
  items,
}: Readonly<{
  items: readonly { label: string; href: string }[];
}>) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.href} className="flex items-center gap-2">
              {index > 0 ? <span aria-hidden="true" className="text-slate-600">/</span> : null}
              {isLast ? (
                <span aria-current="page" className="text-white">
                  {item.label}
                </span>
              ) : (
                <Link className="transition hover:text-white" href={item.href}>
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
