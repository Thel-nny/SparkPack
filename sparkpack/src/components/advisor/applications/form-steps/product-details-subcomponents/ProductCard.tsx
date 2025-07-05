import React from 'react';
import { ProductOption } from '@/types/formData'; // Assuming ProductOption is defined here

interface ProductCardProps {
  product: ProductOption;
  isSelected: boolean;
  onSelect: (productName: string) => void;
  // productIcons is passed as a prop because it's defined in the parent for now
  productIcons: { [key: string]: React.ReactNode };
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isSelected, onSelect, productIcons }) => {
  return (
    <div
      key={product.name}
      onClick={() => onSelect(product.name)}
      className={`
        flex flex-col items-center text-center p-6 rounded-xl shadow-md cursor-pointer
        transition-all duration-300 border-2
        ${isSelected
          ? 'border-[#8cc63f] bg-[#e6f4d9] scale-105'
          : 'border-gray-200 bg-white hover:shadow-lg hover:border-gray-300'
        }
      `}
    >
      {/* Render the icon using the passed productIcons map */}
      {productIcons[product.iconKey]}
      <h3 className="text-xl font-semibold mb-2 text-gray-800">{product.name}</h3>
      <p className="text-gray-600 mb-4">{product.description}</p>
      <ul className="text-left w-full text-gray-700 space-y-2">
        {product.details.map((detail, index) => (
          <li key={index} className="flex items-start">
            <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
            </svg>
            {detail}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductCard;