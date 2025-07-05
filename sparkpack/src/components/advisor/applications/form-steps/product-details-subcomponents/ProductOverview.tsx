import React from 'react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { ProductOption } from '@/types/formData'; // Assuming ProductOption is defined here

interface ProductOverviewProps {
  selectedProductData: ProductOption | undefined;
}

const ProductOverview: React.FC<ProductOverviewProps> = ({ selectedProductData }) => {
  if (!selectedProductData) {
    return null; // Or a placeholder message
  }

  return (
    <div className="space-y-6 mt-8 p-6 bg-gray-50 rounded-lg shadow-inner">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Overview: {selectedProductData.name}</h3>
      <p className="text-gray-700 italic mb-6">
        {selectedProductData.name === 'Medical Care Insurance' ? 'Ideal for: Pet owners seeking fundamental financial support for medical emergencies and common health concerns.' :
         selectedProductData.name === 'Legacy Insurance' ? 'Ideal for: Pet owners who prioritize financial protection for the most difficult moments, ensuring support for lost pets and dignified end-of-life arrangements.' :
         'Ideal for: Pet owners who want the most complete protection, covering high-cost medical treatments, and providing comprehensive support for difficult lost pet or end-of-life situations.'}
      </p>

      <Accordion type="single" collapsible className="w-full">
        {Object.entries(selectedProductData.fullDetails).map(([heading, details], index) => (
          <AccordionItem value={`item-${index}`} key={index}>
            <AccordionTrigger className="text-lg font-semibold text-[#342d47] hover:text-[#8cc63f]">
              {heading}
            </AccordionTrigger>
            <AccordionContent className="text-gray-700 space-y-2 py-2">
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-700">
                {details.map((detail, idx) => (
                  <li key={idx} dangerouslySetInnerHTML={{ __html: detail }}></li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default ProductOverview;