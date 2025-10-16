import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import PaymentsTable from './page/PaymentTable';
import { useEffect, useState } from "react";
import { validateUser } from "./hooks/validateUser";
import Header from "./components/Header";
import UnauthorizedPage from './page/UnauthorizedPage';
import PricingPage from './page/PricingPage';
import ProtectedRoute from './components/ProtectedRoute';
import Loader from './components/Loader';
import UserPaymentDetail from './components/UserPaymentDetails';

function App() {
  const [loading, setLoading] = useState(true);

  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

  function ValidateUserOnLoad({ onFinish }) {
    const query = useQuery();
    const data = query.get("data");
    const sig = query.get("sig");
    const navigate = useNavigate();

    useEffect(() => {
      // If no query params, skip validation
      if (!(data && sig)) {
        onFinish(); // finish loading immediately
        return;
      }

      (async () => {
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
        } finally {
          onFinish(); // signal that loading is done
        }
      })();
    }, [data, sig, navigate, onFinish]);

    return null;
  }

  return (
    <Router>
      {/* Show loader until validation completes */}
      {loading && <Loader />}

      {/* App content hidden until loader finishes */}
      <div className={`min-h-screen bg-slate-50 ${loading ? 'pointer-events-none opacity-0' : 'opacity-100 transition-opacity duration-300'}`}>
        <Routes>
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
        </Routes>

        <Header />

        {/* Pass callback to hide loader when done */}
        <ValidateUserOnLoad onFinish={() => setLoading(false)} />

        <Routes>
          <Route path="/" element={<ProtectedRoute><PricingPage /></ProtectedRoute>} />
          <Route path="/payment-table" element={<PaymentsTable />} />
          <Route path="/me-history" element={<UserPaymentDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
