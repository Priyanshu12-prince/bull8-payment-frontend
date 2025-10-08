import { useState, useCallback } from 'react';
import { RazorpayOptions, RazorpayResponse } from '../types/razorpay';
import { apiConfig } from '../config/baseUrlConfig';

const { BASE_URL, VERSION } = apiConfig;

interface UserData {
  name?: string;
  email?: string;
  contact?: string;
}

const getUserData = (): UserData | null => {
  try {
    const raw = localStorage.getItem('userData');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const useRazorpay = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRazorpayScript = useCallback((): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }, []);

  const createOrder = useCallback(async (plan: string, keyId: string, userData: UserData | null): Promise<string> => {
    const response = await fetch(`${BASE_URL}${VERSION}payment/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan, key_id: keyId, userData }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to create order: ${response.status} ${text}`);
    }

    const data = await response.json();
    return data?.data?.id;
  }, []);

  const verifyPayment = async (response: RazorpayResponse): Promise<boolean> => {
    const res = await fetch(`${BASE_URL}${VERSION}payment/payment-verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
      }),
    });
    const data = await res.json();
    return data.success;
  };

  const cancelPayment = async (orderId: string) => {
    try {
      await fetch(`${BASE_URL}${VERSION}/payment/cancel-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });
    } catch (e) {
      console.error('Cancel payment failed', e);
    }
  };

  const initiatePayment = useCallback(
    async (
      plan: string,
      keyId: string,
      onSuccess: (response: RazorpayResponse) => void,
      onFailure?: (error: string) => void,
       onCancel?: () => void  // ✅ new
    ) => {
      setIsLoading(true);
      setError(null);

      const userData = getUserData();

      try {
        const isScriptLoaded = await loadRazorpayScript();
        if (!isScriptLoaded) throw new Error('Failed to load Razorpay script');

        const orderId = await createOrder(plan, keyId, userData);

        const options: RazorpayOptions = {
          key: keyId,
          order_id: orderId,
          handler: async (response) => {
            try {
              const success = await verifyPayment(response);
              if (success) onSuccess(response);
              else onFailure?.('Payment verification failed');
            } catch {
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
              await cancelPayment(orderId);
              setIsLoading(false);
              onFailure?.('Payment cancelled by user');
              onCancel?.(); // ✅ trigger cancel callback
            },
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Payment failed';
        setError(errorMessage);
        onFailure?.(errorMessage);
        setIsLoading(false);
      }
    },
    [createOrder, loadRazorpayScript]
  );

  return { initiatePayment, isLoading, error };
};
