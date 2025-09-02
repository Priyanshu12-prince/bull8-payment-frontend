import React, { useState } from 'react';
import { CreditCard, Shield, Zap, CheckCircle } from 'lucide-react';
import { PaymentForm } from './components/PaymentForm';
import { PaymentSuccess } from './components/PaymentSuccess';
import { PaymentError } from './components/PaymentError';
import { useRazorpay } from './hooks/useRazorpay';
import { RazorpayResponse, PaymentFormData } from './types/razorpay';

type PaymentState = 'form' | 'success' | 'error';

function App() {
  const [paymentState, setPaymentState] = useState<PaymentState>('form');
  const [paymentData, setPaymentData] = useState<RazorpayResponse | null>(null);
  const { initiatePayment, isLoading, error } = useRazorpay();

  const handlePaymentSubmit = async (formData: PaymentFormData) => {
    console.log(formData,'090909')
    await initiatePayment(
      formData,
      (response: RazorpayResponse) => {
        setPaymentData(response);
        setPaymentState('success');
      },
      (errorMessage: string) => {
        console.error('Payment failed:', errorMessage);
        setPaymentState('error');
      }
    );
  };

  const handleNewPayment = () => {
    setPaymentState('form');
    setPaymentData(null);
  };

  const handleRetry = () => {
    setPaymentState('form');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-6">
            <CreditCard className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Secure Payment For Bull 8
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience seamless and secure payments powered by Razorpay's industry-leading technology
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-lg mb-4">
              <Shield className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Bank-Grade Security</h3>
            <p className="text-gray-600 text-sm">256-bit SSL encryption and PCI DSS compliance</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Lightning Fast</h3>
            <p className="text-gray-600 text-sm">Process payments in under 3 seconds</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">99.9% Uptime</h3>
            <p className="text-gray-600 text-sm">Reliable payment processing you can trust</p>
          </div>
        </div>

        {/* Payment Section */}
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
              <h2 className="text-2xl font-bold text-white text-center">
                {paymentState === 'form' && 'Make a Payment'}
                {paymentState === 'success' && 'Payment Complete'}
                {paymentState === 'error' && 'Payment Failed'}
              </h2>
            </div>
            
            <div className="p-8">
              {paymentState === 'form' && (
                <PaymentForm onSubmit={handlePaymentSubmit} isLoading={isLoading} />
              )}
              
              {paymentState === 'success' && paymentData && (
                <PaymentSuccess paymentData={paymentData} onNewPayment={handleNewPayment} />
              )}
              
              {paymentState === 'error' && (
                <PaymentError error={error || 'Unknown error occurred'} onRetry={handleRetry} />
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            Powered by <span className="font-semibold text-indigo-600">Razorpay</span> • 
            Trusted by millions of businesses worldwide
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;