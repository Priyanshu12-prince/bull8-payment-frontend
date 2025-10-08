import { useState, useEffect } from "react";
import { apiConfig } from "../config/baseUrlConfig";
import axios from "axios";

const BASE_URL= apiConfig.BASE_URL;

export function useAllPaymentData() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchPayments = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${BASE_URL}/dash/getAllPayment`);
        if (isMounted) {
          setPayments(response.data || []);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err?.message || "Failed to fetch payments");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPayments();

    return () => {
      isMounted = false;
    };
  }, []);

  return { payments, loading, error };
}

