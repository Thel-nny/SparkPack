import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Define the props for the consolidated PaginationControls component
interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  paginate: (pageNumber: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  paginate,
}) => {
  // If there's only one page or fewer, no pagination controls are needed.
  // This addresses the specific check found in AdvisorSubmittedApplications's pagination.
  if (totalPages <= 1) {
    return null;
  }

  // Generate an array of page numbers for rendering the page buttons.
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center space-x-2 mt-4">
      {/* Previous Page Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => paginate(currentPage - 1)}
        disabled={currentPage === 1} // Disable if on the first page
        className="flex items-center space-x-1"
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Previous</span>
      </Button>

      {/* Page Number Buttons */}
      {pageNumbers.map((page) => (
        <Button
          key={page} // Unique key for list rendering
          variant={currentPage === page ? 'default' : 'outline'} // Highlight current page
          size="sm"
          onClick={() => paginate(page)}
          className={currentPage === page ? 'bg-[#7eb238] hover:bg-[#8cc63f] text-white' : ''}
        >
          {page}
        </Button>
      ))}

      {/* Next Page Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => paginate(currentPage + 1)}
        disabled={currentPage === totalPages} // Disable if on the last page
        className="flex items-center space-x-1"
      >
        <span>Next</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default PaginationControls;