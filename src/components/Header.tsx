import { CreditCard, Home, Table } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Header=()=> {
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
              <Link
                to="/me-history"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === '/me-history' 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Table className="w-4 h-4" />
                Payment Details
              </Link>
            </nav>
          </div>
        </div>
      </header>
    );
  }


  export default Header;