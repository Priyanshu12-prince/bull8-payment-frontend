import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { PaymentSuccess } from './components/PaymentSuccess';
import { PaymentError } from './components/PaymentError';
import Pricing from './components/Pricing';
import { useRazorpay } from './hooks/useRazorpay';
import { RazorpayResponse, PaymentFormData } from './types/razorpay';
import PaymentsTable from './page/PaymentTable';
import { Home, Table, CreditCard } from 'lucide-react';
import authorizeImg from './utils/images/unAuthorized.jpeg';

type PaymentState = 'form' | 'success' | 'error';
import { useEffect } from "react";
import { validateUser } from "./hooks/validateUser";

// Header component for navigation
function Header() {
  const location = useLocation();
  
  return (
    <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Payment Platform</h1>
              <p className="text-sm text-slate-500">Industry-grade payment solutions</p>
            </div>
          </div>
          
          <nav className="flex items-center gap-2">
            <Link
              to="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === '/' 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Home className="w-4 h-4" />
              Pricing
            </Link>
            <Link
              to="/payment-table"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === '/payment-table' 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Table className="w-4 h-4" />
              Payment Table
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}





function PricingPage() {
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


function App() {



  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

  function UnauthorizedPage() {
    const location = useLocation();
    const message = (location as any)?.state?.message as string | undefined;
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center">
        <img src={authorizeImg} alt="Unauthorized" className="w-screen h-screen object-contain" />
        <div className="absolute bottom-6 left-0 right-0 text-center">
          {message && <p className="text-sm text-slate-600 mb-4">{message}</p>}
          <Link to="/" className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">Go to Home</Link>
        </div>
      </div>
    );
  }

  function ValidateUserOnLoad() {
    const query = useQuery();
    const data = query.get("data");
    const sig = query.get("sig");
    const navigate = useNavigate();



    useEffect(() => {
      if (!(data && sig)) {
        return;
      }
      void (async () => {
        try {
          const res = await validateUser(data, sig);
          const ok = !!res?.success;
          if (ok) {
            const userData = res?.data?.userData;
            if (userData) {
              try { localStorage.setItem('userData', JSON.stringify(userData)); } catch {}
            }
          } else {
            try { localStorage.removeItem('userData'); } catch {}
            navigate('/unauthorized', { replace: true, state: { message: res?.message } });
          }
        } catch {
          try { localStorage.removeItem('userData'); } catch {}
          navigate('/unauthorized', { replace: true, state: { message: 'Invalid signature! Data may have been tampered with.' } });
        }
      })();
    }, [data, sig, navigate]);

    return null;
  }
  

  
  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
       <Routes>
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
    </Routes>
        <Header />
        <ValidateUserOnLoad />
        <Routes>
          <Route path="/" element={<PricingPage />} />
          <Route path="/payment-table" element={<PaymentsTable />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;


