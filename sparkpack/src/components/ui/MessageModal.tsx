import React from 'react';

interface MessageModalProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
  title?: string;
}

const MessageModal: React.FC<MessageModalProps> = ({ message, type, onClose, title }) => {
  let bgColor = '';
  let borderColor = '';
  let textColor = '';
  let defaultTitle = '';

  switch (type) {
    case 'success':
      bgColor = 'bg-green-100';
      borderColor = 'border-green-500';
      textColor = 'text-green-800';
      defaultTitle = 'Success!';
      break;
    case 'error':
      bgColor = 'bg-red-100';
      borderColor = 'border-red-500';
      textColor = 'text-red-800';
      defaultTitle = 'Error!';
      break;
    case 'info':
    default:
      bgColor = 'bg-blue-100';
      borderColor = 'border-blue-500';
      textColor = 'text-blue-800';
      defaultTitle = 'Information';
      break;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className={`rounded-lg border-t-4 ${borderColor} ${bgColor} p-6 shadow-xl max-w-sm w-full transform transition-all duration-300 scale-100 opacity-100`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`text-lg font-semibold ${textColor}`}>
            {title || defaultTitle}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <p className={`text-sm ${textColor} mb-6`}>{message}</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-md font-medium transition-colors duration-200
              ${type === 'success' ? 'bg-green-600 hover:bg-green-700 text-white' : ''}
              ${type === 'error' ? 'bg-red-600 hover:bg-red-700 text-white' : ''}
              ${type === 'info' ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}
            `}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageModal;