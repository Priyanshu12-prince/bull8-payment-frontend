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
import { useUser } from './contexts/UserContext';
import AutoPaymentInitiator from './components/AutoPaymentInitiator';

function App() {
  const [loading, setLoading] = useState(true);
  const { userData, isAuthenticated ,setUserData} = useUser();
  console.log(userData,'from the  context data in  the app')

  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

  function ValidateUserOnLoad({ onFinish }) {
    const query = useQuery();
    const data = query.get("data");
    const sig = query.get("sig");
    const navigate = useNavigate();
    const { userData, setUserData } = useUser();
  
    useEffect(() => {
      if (userData) {
        onFinish();
        return; // already set
      }
  
      if (!(data && sig)) {
        onFinish();
        return; // no validation needed
      }
  
      (async () => {
        try {
          const res = await validateUser(data, sig);
           console.log(res,'from the  validate api response fron the app ')
          if (res?.success && res?.data?.userData) {

            setUserData(res.data.userData); // SAVE in context
          } else {
            navigate('/unauthorized', { replace: true, state: { message: res?.message } });
          }
        } catch {
          navigate('/unauthorized', { replace: true, state: { message: 'Invalid signature! Data may have been tampered with.' } });
        } finally {
          onFinish();
        }
      })();
    }, [data, sig, navigate, onFinish, setUserData, userData]);
  
    return null;
  }
  
  

  return (
    <Router>
    {loading && <Loader />}
    <Routes>
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
    </Routes>

    <Header />

    <ValidateUserOnLoad onFinish={() => setLoading(false)} />

    {!loading && (
      <Routes>
        <Route path="/" element={<ProtectedRoute><AutoPaymentInitiator /></ProtectedRoute>} />
        <Route path="/payment-table" element={<PaymentsTable />} />
        <Route path="/me-history" element={<UserPaymentDetail />} />
      </Routes>
    )}
  </Router>
  );
}

export default App;
