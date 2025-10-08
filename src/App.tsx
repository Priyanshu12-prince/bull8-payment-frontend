
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import PaymentsTable from './page/PaymentTable';

import { useEffect } from "react";
import { validateUser } from "./hooks/validateUser";
import  Header  from "./components/Header"
import UnauthorizedPage from './page/UnauthorizedPage';
import PricingPage from './page/PricingPage';
import ProtectedRoute from './components/ProtectedRoute';



function App() {



  function useQuery() {
    return new URLSearchParams(useLocation().search);
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
          <Route path="/" element={<ProtectedRoute><PricingPage /></ProtectedRoute>} />
          <Route path="/payment-table" element={<PaymentsTable />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;


