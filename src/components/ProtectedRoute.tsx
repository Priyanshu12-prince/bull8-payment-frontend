import { Navigate } from "react-router-dom";



   const  ProtectedRoute =({ children }: { children: JSX.Element }) =>{
    let isAuthorized = false;
    try {
      isAuthorized = !!localStorage.getItem('userData');
    } catch {}
    if (!isAuthorized) {
      return <Navigate to="/unauthorized" replace state={{ message: 'Please authorize to continue' }} />;
    }
    return children;
  }



  export default ProtectedRoute;