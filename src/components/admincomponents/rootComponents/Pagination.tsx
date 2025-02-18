import React from "react";
import { useSearchParams } from "react-router-dom";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  maxPageButtons?: number; 
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage=1,
  totalPages,
  maxPageButtons = 7,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  if (totalPages <= 1) {
    return null;
  }

  const handlePageChange = (newPage: number) => {
    const paramsObj = Object.fromEntries(searchParams.entries());
    paramsObj.page = String(newPage);
    setSearchParams(paramsObj);
  };

  const pagesToShow = generatePageNumbers(currentPage, totalPages, maxPageButtons);

  return (
    <div className="flex items-center gap-2  text-gray-300">
      {/* Previous Button */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="px-2 py-1.5 text-white text-xs rounded bg-custom-orange/90 hover:bg-custom-orange/100 bg-opacity-85  disabled:bg-custom-orange/50 shadow-xl  "
      >
        &lt;
      </button>

      {/* Page Buttons */}
      {pagesToShow.map((pageNumber, idx) =>
        pageNumber === "..." ? (
          <span key={`${pageNumber}-${idx}`} className="px-2 text-custom-orange">
            ...
          </span>
        ) : (
          <button
            key={pageNumber}
            onClick={() => handlePageChange(Number(pageNumber))}
            className={`px-3 text-xs py-1.5 rounded   shadow-xl border   text-custom-orange  ${
              pageNumber === currentPage
                ? "bg-custom-orange/100 text-white":"bg-white"}`}
            aria-current={pageNumber === currentPage ? "page" : undefined}>
            {pageNumber}
          </button>
        )
      )}

      {/* Next Button */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="px-2 py-1.5 text-white text-xs rounded bg-custom-orange/90 hover:bg-custom-orange/100 bg-opacity-85  disabled:bg-custom-orange/50 shadow-xl  "
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;


function generatePageNumbers(
  currentPage: number,
  totalPages: number,
  maxPageButtons: number
): Array<number | string> {
  const pages: Array<number | string> = [];


  if (totalPages <= maxPageButtons) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }


  const leftBound = Math.max(currentPage - 2, 1);
  const rightBound = Math.min(currentPage + 2, totalPages);

  
  pages.push(1);


  if (leftBound > 2) {
    pages.push("...");
  }


  for (let i = leftBound; i <= rightBound; i++) {
    if (i !== 1 && i !== totalPages) {
      pages.push(i);
    }
  }


  if (rightBound < totalPages - 1) {
    pages.push("...");
  }


  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages;
}

