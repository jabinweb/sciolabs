import Link from "next/link";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/crm/ui/pagination";

export const TABLE_PAGE_SIZE = 25;

export function parsePage(raw: string | string[] | undefined): number {
  const value = Array.isArray(raw) ? raw[0] : raw;
  const n = Number(value ?? 1);
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.floor(n);
}

export function pageCountFor(total: number, pageSize = TABLE_PAGE_SIZE) {
  return Math.max(1, Math.ceil(Math.max(0, total) / pageSize));
}

function pageHref(pathname: string, search: URLSearchParams, page: number) {
  const next = new URLSearchParams(search);
  if (page <= 1) next.delete("page");
  else next.set("page", String(page));
  const qs = next.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

function visiblePages(current: number, totalPages: number): Array<number | "ellipsis"> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const pages = new Set<number>([1, totalPages, current, current - 1, current + 1]);
  if (current <= 3) {
    pages.add(2);
    pages.add(3);
    pages.add(4);
  }
  if (current >= totalPages - 2) {
    pages.add(totalPages - 1);
    pages.add(totalPages - 2);
    pages.add(totalPages - 3);
  }
  const sorted = [...pages].filter((n) => n >= 1 && n <= totalPages).sort((a, b) => a - b);
  const out: Array<number | "ellipsis"> = [];
  for (const n of sorted) {
    const prev = out[out.length - 1];
    if (typeof prev === "number" && n - prev > 1) out.push("ellipsis");
    out.push(n);
  }
  return out;
}

export function TablePagination({
  pathname,
  searchParams,
  page,
  total,
  pageSize = TABLE_PAGE_SIZE,
}: {
  pathname: string;
  searchParams: Record<string, string | string[] | undefined>;
  page: number;
  total: number;
  pageSize?: number;
}) {
  const totalPages = pageCountFor(total, pageSize);
  if (total === 0) return null;

  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (key === "page" || value == null) continue;
    const raw = Array.isArray(value) ? value[0] : value;
    if (raw) search.set(key, raw);
  }

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  const items = visiblePages(page, totalPages);

  return (
    <div className="flex flex-col gap-3 border-t border-foreground/10 px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Showing <span className="font-medium text-foreground">{from}</span>–
        <span className="font-medium text-foreground">{to}</span> of{" "}
        <span className="font-medium text-foreground">{total}</span>
      </p>
      {totalPages > 1 ? (
        <Pagination className="mx-0 w-auto justify-start sm:justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                nativeButton={false}
                disabled={page <= 1}
                render={
                  page <= 1 ? (
                    <span />
                  ) : (
                    <Link href={pageHref(pathname, search, page - 1)} />
                  )
                }
              />
            </PaginationItem>
            {items.map((item, index) =>
              item === "ellipsis" ? (
                <PaginationItem key={`e-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={item}>
                  <PaginationLink
                    isActive={item === page}
                    nativeButton={false}
                    render={<Link href={pageHref(pathname, search, item)} />}
                  >
                    {item}
                  </PaginationLink>
                </PaginationItem>
              ),
            )}
            <PaginationItem>
              <PaginationNext
                nativeButton={false}
                disabled={page >= totalPages}
                render={
                  page >= totalPages ? (
                    <span />
                  ) : (
                    <Link href={pageHref(pathname, search, page + 1)} />
                  )
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      ) : null}
    </div>
  );
}
