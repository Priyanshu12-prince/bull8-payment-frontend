
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import PaymentsTable from './page/PaymentTable';
import authorizeImg from './utils/images/unAuthorized.jpeg';
import { useEffect } from "react";
import { validateUser } from "./hooks/validateUser";
import  Header  from "./components/Header"
import PricingPage from './page/PricingPage';



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
  function ProtectedRoute({ children }: { children: JSX.Element }) {
    let isAuthorized = false;
    try {
      isAuthorized = !!localStorage.getItem('userData');
    } catch {}
    if (!isAuthorized) {
      return <Navigate to="/unauthorized" replace state={{ message: 'Please authorize to continue' }} />;
    }
    return children;
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


