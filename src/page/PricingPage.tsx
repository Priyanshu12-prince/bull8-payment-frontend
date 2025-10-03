

import { useState } from 'react';
// import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { PaymentSuccess } from '../components/PaymentSuccess';
import { PaymentError } from '../components/PaymentError';
import Pricing from '../components/Pricing';
import { useRazorpay } from '../hooks/useRazorpay';
import { RazorpayResponse, PaymentFormData } from '../types/razorpay';
// import PaymentsTable from './PaymentTable';
// import { Home, Table, CreditCard } from 'lucide-react';
// import authorizeImg from './utils/images/unAuthorized.jpeg';

type PaymentState = 'form' | 'success' | 'error';
// import { useEffect } from "react";
// import { validateUser } from '../hooks/validateUser';

 const  PricingPage =()=> {
  const [paymentState, setPaymentState] = useState<PaymentState>('form');
  const [paymentData, setPaymentData] = useState<RazorpayResponse | null>(null);
  const { initiatePayment, isLoading, error } = useRazorpay();
  const [activePlanId, setActivePlanId] = useState<string | null>(null);

  const handlePlanPay = async (plan: { id: string; amount: number; description: string }) => {
    setActivePlanId(plan.id);
    const formData: PaymentFormData = {
      amount: plan.amount,
      description: plan.description,
    };

    const planCode = plan.id;
    const keyId = 'rzp_live_RKwUDP9xiVHswR';

    try {
      await initiatePayment(
        formData,
        planCode,
        keyId,
        (response: RazorpayResponse) => {
          setPaymentData(response);
          setPaymentState('success');
        },
        (errorMessage: string) => {
          console.error('Payment failed:', errorMessage);
          setPaymentState('error');
        }
      );
    } finally {
      setActivePlanId(null);
    }
  };

  const handleNewPayment = () => {
    setPaymentState('form');
    setPaymentData(null);
  };

  const handleRetry = () => {
    setPaymentState('form');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>
      
      <div className="container mx-auto px-4 py-16 relative">
        {paymentState === 'form' && (
          <Pricing isLoading={isLoading} activePlanId={activePlanId} onPlanPay={(p) => handlePlanPay(p)} />
        )}

        {paymentState === 'success' && paymentData && (
          <div className="max-w-md mx-auto">
            <PaymentSuccess paymentData={paymentData} onNewPayment={handleNewPayment} />
          </div>
        )}

        {paymentState === 'error' && (
          <div className="max-w-md mx-auto">
            <PaymentError error={error || 'Unknown error occurred'} onRetry={handleRetry} />
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-xl p-6 shadow-lg max-w-md mx-auto">
            <p className="text-gray-600 mb-2">
              Powered by <span className="font-bold text-indigo-600">Razorpay</span>
            </p>
            <p className="text-sm text-gray-500">
              Trusted by millions of businesses worldwide
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PricingPage