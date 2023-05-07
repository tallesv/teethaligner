import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/24/outline';

const siblingsCount = 2;

function generatePagesArray(from: number, to: number) {
  return [...new Array(to - from)]
    .map((_, index) => {
      return from + index + 1;
    })
    .filter(page => page > 0);
}

interface PaginationProps {
  currentPage: number;
  totalQuantityOfData: number;
  dataPerPage?: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalQuantityOfData,
  dataPerPage = 10,
  onPageChange,
}: PaginationProps) {
  const lastPage = Math.ceil(totalQuantityOfData / dataPerPage);

  const previousPages =
    currentPage > 1
      ? generatePagesArray(currentPage - 1 - siblingsCount, currentPage - 1)
      : [];

  const nextPages =
    currentPage < lastPage
      ? generatePagesArray(
          currentPage,
          Math.min(currentPage + siblingsCount, lastPage),
        )
      : [];

  let initialDataCount;
  if (currentPage === 1) {
    if (totalQuantityOfData > 0) {
      initialDataCount = 1;
    } else {
      initialDataCount = 0;
    }
  } else {
    initialDataCount = 10 * (currentPage - 1);
  }

  return (
    <div className="flex flex-row-reverse items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div className="hidden sm:block">
          <p className="text-sm text-gray-700">
            Mostrando <span className="font-medium">{initialDataCount}</span>{' '}
            para{' '}
            <span className="font-medium">
              {totalQuantityOfData > dataPerPage &&
                currentPage * dataPerPage < totalQuantityOfData &&
                currentPage * dataPerPage}
              {totalQuantityOfData > dataPerPage &&
                currentPage * dataPerPage >= totalQuantityOfData &&
                totalQuantityOfData}
              {totalQuantityOfData < dataPerPage && totalQuantityOfData}
            </span>{' '}
            de <span className="font-medium">{totalQuantityOfData}</span> totais
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <button
              type="button"
              className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
              disabled={currentPage === 1}
              onClick={() => onPageChange(1)}
            >
              <span className="sr-only">Previous</span>
              <ChevronDoubleLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            {previousPages.length > 0 &&
              previousPages.map(page => (
                <button
                  key={page}
                  type="button"
                  aria-current="page"
                  className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </button>
              ))}

            <button
              type="button"
              aria-current="page"
              className="relative z-10 inline-flex items-center border border-blue-500 text-blue-600 bg-blue-50 px-4 py-2 text-sm font-medium focus:z-20"
            >
              {currentPage}
            </button>

            {nextPages.length > 0 &&
              nextPages.map(page => (
                <button
                  key={page}
                  type="button"
                  aria-current="page"
                  className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </button>
              ))}
            <button
              type="button"
              className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
              disabled={currentPage === lastPage}
              onClick={() => onPageChange(lastPage)}
            >
              <span className="sr-only">Next</span>
              <ChevronDoubleRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
