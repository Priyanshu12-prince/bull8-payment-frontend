import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { PaymentSuccess } from './components/PaymentSuccess';
import { PaymentError } from './components/PaymentError';
import Pricing from './components/Pricing';
import { useRazorpay } from './hooks/useRazorpay';
import { RazorpayResponse, PaymentFormData } from './types/razorpay';
import PaymentsTable from './page/PaymentTable';
import { Home, Table, CreditCard } from 'lucide-react';

type PaymentState = 'form' | 'success' | 'error';

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

// Main pricing component
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

// Main App component with routing
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Header />
        <Routes>
          <Route path="/" element={<PricingPage />} />
          <Route path="/payment-table" element={<PaymentsTable />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


