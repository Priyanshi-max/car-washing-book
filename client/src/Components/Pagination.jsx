import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const Pagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  showItemCount = true,
  maxVisiblePages = 5
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Always show pagination if there are items, regardless of page count
  if (totalItems === 0) return null;

  // Calculate which page numbers to show
  const getVisiblePages = () => {
    const pages = [];
    const half = Math.floor(maxVisiblePages / 2);
    
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);
    
    // Adjust start if we're near the end
    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const ButtonComponent = ({ onClick, disabled, children, variant = 'default' }) => {
    const baseClasses = "px-3 py-2 text-sm font-medium border transition-colors duration-200 flex items-center justify-center min-w-[40px]";
    const variantClasses = {
      default: disabled 
        ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed" 
        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400",
      active: "bg-blue-600 text-white border-blue-600",
      dots: "bg-white text-gray-400 border-gray-300 cursor-default"
    };

    return (
      <button
        onClick={onClick}
        disabled={disabled || variant === 'dots'}
        className={`${baseClasses} ${variantClasses[variant]} ${
          variant === 'default' && !disabled ? 'hover:shadow-sm' : ''
        }`}
      >
        {children}
      </button>
    );
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
      {/* Item count */}
      {showItemCount && (
        <div className="text-sm text-gray-700 order-2 sm:order-1">
          Showing <span className="font-medium">{startItem}</span> to{' '}
          <span className="font-medium">{endItem}</span> of{' '}
          <span className="font-medium">{totalItems}</span> results
        </div>
      )}

      {/* Pagination controls - Show even with one page */}
      <div className="flex items-center space-x-1 order-1 sm:order-2">
        {totalPages > 1 && (
          <>
            {/* First page */}
            <ButtonComponent
              onClick={() => handlePageClick(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="w-4 h-4" />
            </ButtonComponent>

            {/* Previous page */}
            <ButtonComponent
              onClick={() => handlePageClick(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </ButtonComponent>

            {/* Show first page and ellipsis if needed */}
            {visiblePages[0] > 1 && (
              <>
                <ButtonComponent onClick={() => handlePageClick(1)}>
                  1
                </ButtonComponent>
                {visiblePages[0] > 2 && (
                  <ButtonComponent variant="dots">
                    ...
                  </ButtonComponent>
                )}
              </>
            )}

            {/* Page numbers */}
            {visiblePages.map(page => (
              <ButtonComponent
                key={page}
                onClick={() => handlePageClick(page)}
                variant={page === currentPage ? 'active' : 'default'}
              >
                {page}
              </ButtonComponent>
            ))}

            {/* Show last page and ellipsis if needed */}
            {visiblePages[visiblePages.length - 1] < totalPages && (
              <>
                {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                  <ButtonComponent variant="dots">
                    ...
                  </ButtonComponent>
                )}
                <ButtonComponent onClick={() => handlePageClick(totalPages)}>
                  {totalPages}
                </ButtonComponent>
              </>
            )}

            {/* Next page */}
            <ButtonComponent
              onClick={() => handlePageClick(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </ButtonComponent>

            {/* Last page */}
            <ButtonComponent
              onClick={() => handlePageClick(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight className="w-4 h-4" />
            </ButtonComponent>
          </>
        )}
        
        {/* Show just the current page number if only one page */}
        {totalPages === 1 && (
          <ButtonComponent variant="active">
            1
          </ButtonComponent>
        )}
      </div>
    </div>
  );
};

export default Pagination;