import { calculatePageNumbers } from "@/lib/helpers";
import { cn } from "@repo/ui/lib/utils";

import {
  Pagination as PaginationRoot,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@repo/ui/components/ui/pagination";

type Props = {
  totalPages: number;
  currentPage: number;
  pageNeighbors?: number;
  onPageChange?: (page: number) => void;
  className?: string;
};

const Pagination = ({
  totalPages,
  currentPage,
  pageNeighbors = 2,
  onPageChange,
  className,
}: Props) => {
  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = calculatePageNumbers({
    pageNeighbors,
    currentPage,
    totalPages,
  });

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    onPageChange?.(page);
  };

  return (
    <PaginationRoot className={cn(className)}>
      <PaginationContent>
        {/* Previous */}
        {currentPage > 1 && (
          <PaginationItem>
            {onPageChange ? (
              <PaginationPrevious
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  handlePageChange(currentPage - 1);
                }}
                aria-label="Go to previous page"
              />
            ) : (
              <PaginationPrevious
                href={`?page=${currentPage - 1}`}
                aria-label="Go to previous page"
              />
            )}
          </PaginationItem>
        )}

        {/* Page numbers */}
        {pageNumbers.map((page, index) => {
          if (page === "...") {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          const pageNumber = Number(page);

          return (
            <PaginationItem key={page}>
              {onPageChange ? (
                <PaginationLink
                  href="#"
                  isActive={currentPage === pageNumber}
                  onClick={(event) => {
                    event.preventDefault();
                    handlePageChange(pageNumber);
                  }}
                  aria-current={currentPage === pageNumber ? "page" : undefined}
                >
                  {pageNumber}
                </PaginationLink>
              ) : (
                <PaginationLink
                  href={`?page=${pageNumber}`}
                  isActive={currentPage === pageNumber}
                  aria-current={currentPage === pageNumber ? "page" : undefined}
                >
                  {pageNumber}
                </PaginationLink>
              )}
            </PaginationItem>
          );
        })}

        {/* Next */}
        {currentPage < totalPages && (
          <PaginationItem>
            {onPageChange ? (
              <PaginationNext
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  handlePageChange(currentPage + 1);
                }}
                aria-label="Go to next page"
              />
            ) : (
              <PaginationNext
                href={`?page=${currentPage + 1}`}
                aria-label="Go to next page"
              />
            )}
          </PaginationItem>
        )}
      </PaginationContent>
    </PaginationRoot>
  );
};

export default Pagination;
