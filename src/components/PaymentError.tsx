import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface PaymentErrorProps {
  error: string;
  onRetry: () => void;
}

export const PaymentError: React.FC<PaymentErrorProps> = ({ error, onRetry }) => {
  return (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
          <AlertCircle className="w-12 h-12 text-red-600" />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
        <p className="text-gray-600 mb-4">We encountered an issue processing your payment.</p>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      </div>

      <button
        onClick={onRetry}
        className="inline-flex items-center space-x-2 bg-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-indigo-700 transition-colors duration-200"
      >
        <RefreshCw className="w-5 h-5" />
        <span>Try Again</span>
      </button>
    </div>
  );
};