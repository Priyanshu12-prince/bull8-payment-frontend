

import { useState, useCallback } from 'react';
import { RazorpayOptions, RazorpayResponse, PaymentFormData } from '../types/razorpay';
import { BASE_URL } from '../config';

export const useRazorpay = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRazorpayScript = useCallback((): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }, []);
  const raw = localStorage.getItem('userData');
  const createOrder = useCallback(async (plan: string, keyId: string): Promise<string> => {
    let userData: unknown = null;
    try {
      const raw = localStorage.getItem('userData');
      if (raw) userData = JSON.parse(raw);
    } catch {}

    const response = await fetch('https://372w16mm-3000.inc1.devtunnels.ms/api/v1/payment/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        plan,
        key_id: keyId,
        userData,
        
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to create order: ${response.status} ${text}`);
    }

    const data = await response.json();
    return data?.data?.id;
  }, []);

  const initiatePayment = useCallback(async (
    formData: PaymentFormData,
    plan: string,
    keyId: string,
    onSuccess: (response: RazorpayResponse) => void,
    onFailure?: (error: string) => void
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      let userData: unknown = null;
      try {
        const raw = localStorage.getItem('userData');
        if (raw) userData = JSON.parse(raw);
   
      } catch {}

      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error('Failed to load Razorpay script');
      }

      const orderId = await createOrder(plan, keyId);
      const options: RazorpayOptions = {
        key: keyId,
        order_id: orderId,
       handler: async (response: RazorpayResponse) => {
  try {
    const verifyRes = await fetch(
      'https://372w16mm-3000.inc1.devtunnels.ms/api/v1/payment/payment-verify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        }),
      }
    );

    const verifyData = await verifyRes.json();

    if (verifyData.success) {
      onSuccess(response); 
    } else {
      onFailure?.('Payment verification failed');
    }
  } catch (err) {
    onFailure?.('Error verifying payment');
  }
},

    prefill: {
      name: userData?.name || '',
      email: userData?.email || '',
      contact: userData?.contact || '',
    },
          
        theme: { color: '#6366F1' },
        modal: {
          ondismiss: async () => {
            try {
              await fetch(`${BASE_URL}/payment/cancel-payment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId: orderId }),
              });
            } catch (e) {
              // swallow cancel errors to not block UI
            } finally {
              setIsLoading(false);
              onFailure?.('Payment cancelled by user');
            }
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed';
      setError(errorMessage);
      onFailure?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [loadRazorpayScript, createOrder]);

  return {
    initiatePayment,
    isLoading,
    error,
  };
};
