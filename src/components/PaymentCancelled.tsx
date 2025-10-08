import React from 'react';

interface Props {
  onRetry: () => void;
}

export const PaymentCancelled: React.FC<Props> = ({ onRetry }) => {
  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-lg text-center">
      <h2 className="text-2xl font-bold mb-4 text-red-500">Payment Cancelled</h2>
      <p className="text-gray-600 mb-6">You have cancelled the payment.</p>
      <button
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        onClick={onRetry}
      >
        Try Again
      </button>
    </div>
  );
};
