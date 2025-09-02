import React from 'react';
import { CheckCircle, Copy, ExternalLink } from 'lucide-react';
import { RazorpayResponse } from '../types/razorpay';

interface PaymentSuccessProps {
  paymentData: RazorpayResponse;
  onNewPayment: () => void;
}

export const PaymentSuccess: React.FC<PaymentSuccessProps> = ({ paymentData, onNewPayment }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-emerald-600" />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
        <p className="text-gray-600">Your payment has been processed successfully.</p>
      </div>

      <div className="bg-gray-50 rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Details</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <span className="text-sm font-medium text-gray-600">Payment ID</span>
            <div className="flex items-center space-x-2">
              <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                {paymentData.razorpay_payment_id}
              </code>
              <button
                onClick={() => copyToClipboard(paymentData.razorpay_payment_id)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                title="Copy Payment ID"
              >
                <Copy className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <span className="text-sm font-medium text-gray-600">Order ID</span>
            <div className="flex items-center space-x-2">
              <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                {paymentData.razorpay_order_id}
              </code>
              <button
                onClick={() => copyToClipboard(paymentData.razorpay_order_id)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                title="Copy Order ID"
              >
                <Copy className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <span className="text-sm font-medium text-gray-600">Signature</span>
            <div className="flex items-center space-x-2">
              <code className="text-sm bg-gray-100 px-2 py-1 rounded truncate max-w-32">
                {paymentData.razorpay_signature}
              </code>
              <button
                onClick={() => copyToClipboard(paymentData.razorpay_signature)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                title="Copy Signature"
              >
                <Copy className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onNewPayment}
          className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-indigo-700 transition-colors duration-200"
        >
          Make Another Payment
        </button>
        <a
          href="https://dashboard.razorpay.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <span>View Dashboard</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};