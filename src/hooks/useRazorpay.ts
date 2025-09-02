import { useState, useCallback } from 'react';
import { RazorpayOptions, RazorpayResponse, PaymentFormData } from '../types/razorpay';

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

  const createOrder = useCallback(async (formData: PaymentFormData): Promise<string> => {
    // In a real application, this would call your backend API
    // For demo purposes, we'll simulate an order creation
    const response = await fetch('http://localhost:3000/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: formData.amount * 100, // Convert to paise
        name: formData.name,
        email: formData.email,
        contact: formData.contact,
        description: formData.description,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create order');
    }

    const data = await response.json();
    

    return data.orderId;
  }, []);

  const initiatePayment = useCallback(async (
    formData: PaymentFormData,
    onSuccess: (response: RazorpayResponse) => void,
    onFailure?: (error: string) => void
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      // Load Razorpay script
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error('Failed to load Razorpay script');
      }

      // Create order via backend and use returned order id
      const orderId = await createOrder(formData);

      const options: RazorpayOptions = {
        key: 'rzp_test_RCdg9ReFdakOIV', // Replace with your Razorpay key
        amount: formData.amount * 100, // Convert to paise
        currency: 'INR',
        name: 'Your Company Name',
        description: formData.description,
        order_id: orderId,
        handler: (response: RazorpayResponse) => {
          onSuccess(response);
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.contact,
        },
        theme: {
          color: '#6366F1',
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
            onFailure?.('Payment cancelled by user');
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
  }, [loadRazorpayScript]);

  return {
    initiatePayment,
    isLoading,
    error,
  };
};