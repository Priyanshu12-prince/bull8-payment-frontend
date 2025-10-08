 import authorizeImg from '../utils/images/unAuthorized.jpeg';
 
 const  UnauthorizedPage =()=> {
    const location = useLocation();
      
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

 export default UnauthorizedPage;