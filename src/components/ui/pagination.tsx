import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function getVisiblePages(currentPage: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, totalPages, currentPage - 1, currentPage, currentPage + 1]);
  return Array.from(pages)
    .filter((page) => page > 0 && page <= totalPages)
    .sort((left, right) => left - right);
}

export function Pagination({
  currentPage,
  totalPages,
  getHref,
}: Readonly<{
  currentPage: number;
  totalPages: number;
  getHref: (page: number) => string;
}>) {
  const pages = getVisiblePages(currentPage, totalPages);

  return (
    <nav aria-label="Pagination" className="flex flex-wrap items-center gap-2">
      <Button asChild variant="outline" size="sm" disabled={currentPage === 1}>
        <Link aria-label="Previous page" href={getHref(Math.max(1, currentPage - 1))}>
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Link>
      </Button>
      <div className="flex flex-wrap items-center gap-2">
        {pages.map((page, index) => {
          const previous = pages[index - 1];
          const showEllipsis = previous && page - previous > 1;

          return (
            <div key={page} className="flex items-center gap-2">
              {showEllipsis ? <span className="px-1 text-muted-foreground">…</span> : null}
              <Button
                asChild
                variant={page === currentPage ? "default" : "ghost"}
                size="sm"
                className={cn(page === currentPage && "pointer-events-none")}
              >
                <Link aria-current={page === currentPage ? "page" : undefined} href={getHref(page)}>
                  {page}
                </Link>
              </Button>
            </div>
          );
        })}
      </div>
      <Button asChild variant="outline" size="sm" disabled={currentPage === totalPages}>
        <Link aria-label="Next page" href={getHref(Math.min(totalPages, currentPage + 1))}>
          Next
          <ChevronRight className="h-4 w-4" />
        </Link>
      </Button>
    </nav>
  );
}