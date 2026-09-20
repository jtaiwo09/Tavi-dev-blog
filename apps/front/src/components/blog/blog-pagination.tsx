"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Pagination from "../pagination";

type Props = {
  currentPage: number;
  totalPages: number;
};

const BlogPagination = ({ currentPage, totalPages }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    if (page <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }

    const queryString = params.toString();

    router.push(queryString ? `${pathname}?${queryString}` : pathname);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
    />
  );
};

export default BlogPagination;
