import { useEffect, useState } from 'react';
import { useRazorpay } from '../hooks/useRazorpay';
import { useUser } from '../contexts/UserContext';
import { RazorpayResponse } from '../types/razorpay';
import { PaymentSuccess } from './PaymentSuccess';
import { PaymentError } from './PaymentError';
import { PaymentCancelled } from './PaymentCancelled';
import Loader from './Loader';

type PaymentState = 'loading' | 'processing' | 'success' | 'error' | 'cancel';

const AutoPaymentInitiator = () => {
  const [paymentState, setPaymentState] = useState<PaymentState>('loading');
  const [paymentData, setPaymentData] = useState<RazorpayResponse | null>(null);
  const { userData } = useUser();
  const { initiatePayment, isLoading, error } = useRazorpay();

  useEffect(() => {
    const initiateAutoPayment = async () => {
      if (!userData?.plan) {
        console.error('No plan found in userData');
        setPaymentState('error');
        return;
      }

      setPaymentState('processing');
      
      const keyId = 'rzp_live_RKwUDP9xiVHswR'; // You can move this to config
      
      try {
        await initiatePayment(
          userData.plan,
          keyId,
          (response: RazorpayResponse) => {
            setPaymentData(response);
            setPaymentState('success');
          },
          (errorMessage: string) => {
            console.error('Payment failed:', errorMessage);
            setPaymentState('error');
          },
          () => {
            setPaymentState('cancel');
          }
        );
      } catch (err) {
        console.error('Failed to initiate payment:', err);
        setPaymentState('error');
      }
    };

    // Only initiate payment if user is authenticated and we haven't started yet
    if (userData && paymentState === 'loading') {
      initiateAutoPayment();
    }
  }, [userData, initiatePayment, paymentState]);

  const handleNewPayment = () => {
    setPaymentState('loading');
    setPaymentData(null);
  };

  const handleRetry = () => {
    setPaymentState('loading');
  };

  if (paymentState === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
        <p className="ml-4 text-lg text-gray-600">Preparing payment...</p>
      </div>
    );
  }

  if (paymentState === 'processing') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
        <p className="ml-4 text-lg text-gray-600">Processing payment...</p>
      </div>
    );
  }

  if (paymentState === 'success' && paymentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="max-w-md mx-auto">
          <PaymentSuccess paymentData={paymentData} onNewPayment={handleNewPayment} />
        </div>
      </div>
    );
  }

  if (paymentState === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="max-w-md mx-auto">
          <PaymentError error={error || 'Unknown error occurred'} onRetry={handleRetry} />
        </div>
      </div>
    );
  }

  if (paymentState === 'cancel') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="max-w-md mx-auto">
          <PaymentCancelled onRetry={handleRetry} />
        </div>
      </div>
    );
  }

  return null;
};

export default AutoPaymentInitiator;
