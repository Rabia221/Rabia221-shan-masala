'use client';

import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  // build visible page numbers with ellipsis markers
  const getPages = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [];
    pages.push(1);
    if (currentPage > 3) pages.push('...');
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
    return pages;
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {/* page info */}
      <p className="text-xs text-gray-400 font-medium">
        Page <span className="text-gray-700 font-bold">{currentPage}</span> of{' '}
        <span className="text-gray-700 font-bold">{totalPages}</span>
      </p>

      <div className="flex items-center gap-1.5">
        {/* Prev */}
        <motion.button
          whileTap={{ scale: 0.93 }}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition ${
            currentPage === 1
              ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
              : 'bg-white border border-gray-200 text-gray-600 hover:border-orange-400 hover:text-orange-500 shadow-sm'
          }`}
        >
          <FiChevronLeft size={15} /> Prev
        </motion.button>

        {/* Page numbers */}
        {getPages().map((page, i) =>
          page === '...' ? (
            <span key={`e${i}`} className="w-9 text-center text-gray-400 text-sm select-none">
              ···
            </span>
          ) : (
            <motion.button
              key={page}
              whileTap={{ scale: 0.93 }}
              onClick={() => onPageChange(page)}
              className={`w-9 h-9 rounded-xl text-sm font-bold transition ${
                currentPage === page
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-orange-400 hover:text-orange-500 shadow-sm'
              }`}
            >
              {page}
            </motion.button>
          )
        )}

        {/* Next */}
        <motion.button
          whileTap={{ scale: 0.93 }}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition ${
            currentPage === totalPages
              ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
              : 'bg-white border border-gray-200 text-gray-600 hover:border-orange-400 hover:text-orange-500 shadow-sm'
          }`}
        >
          Next <FiChevronRight size={15} />
        </motion.button>
      </div>
    </div>
  );
}
