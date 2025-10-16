import React, { useState, useEffect } from 'react';
import {
  User,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  Mail,
  Phone,
  DollarSign,
  Package,
  Calendar,
  Database,
  FileText,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';
import axios from 'axios';
import { apiConfig } from '../config/baseUrlConfig';

const { BASE_URL, VERSION } = apiConfig;

// ---------- Types ----------
interface ITransactionData {
  uuid: string;
  userId: string;
  userDomainUrl: string;
  ctclId: string;
  name: string;
  plan: string;
  email: string;
  contact: string;
  amount: string;
  currency: string | null;
  description: string;
  order_id: string;
  payment_id: string | null;
  method: string | null;
  status: string | null;
  vpa: string | null;
  fee: string | null;
  tax: string | null;
  payment_verified: 'YES' | 'NO';
  payment_status: string;
  acquirer_data: any;
  notes: any;
  raw_payload: any;
  createdAt: string;
  updatedAt: string;
}

interface IApiResponse {
  success: boolean;
  message: string;
  data: ITransactionData;
  error: any;
}

// ---------- Helpers ----------
const formatDate = (isoString: string | null | undefined): string => {
  if (!isoString) return 'N/A';
  return new Date(isoString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  });
};

const StatusBadge: React.FC<{ status: string | null }> = ({ status }) => {
  let colorClass = '';
  let Icon = Clock;
  switch (status?.toUpperCase()) {
    case 'SUCCESS':
    case 'PAID':
    case 'CAPTURED':
      colorClass = 'bg-green-100 text-green-800 border-green-300';
      Icon = CheckCircle;
      break;
    case 'FAILED':
    case 'CANCELLED':
      colorClass = 'bg-red-100 text-red-800 border-red-300';
      Icon = XCircle;
      break;
    case 'PENDING':
    case 'CREATED':
      colorClass = 'bg-yellow-100 text-yellow-800 border-yellow-300';
      Icon = Clock;
      break;
    default:
      colorClass = 'bg-gray-100 text-gray-700 border-gray-300';
  }
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 border rounded-full font-semibold text-sm ${colorClass}`}>
      <Icon size={16} />
      {status || 'Unknown'}
    </span>
  );
};

const DetailItem = ({
  icon: Icon,
  label,
  value,
  highlight,
}: {
  icon: any;
  label: string;
  value: string | number | null | undefined;
  highlight?: boolean;
}) => (
  <div
    className={`p-3 rounded-lg border transition-all duration-200 ${
      highlight
        ? 'bg-indigo-50 border-indigo-300 shadow-md'
        : 'bg-white/80 border-gray-200 hover:shadow-sm'
    }`}
  >
    <dt className="flex items-center text-sm font-medium text-gray-600 mb-1">
      <Icon size={16} className="mr-2 text-indigo-500" />
      {label}
    </dt>
    <dd className="text-base font-semibold text-gray-900 truncate">
      {value || 'N/A'}
    </dd>
  </div>
);

// ---------- Main Component ----------
const UserPaymentDetail: React.FC = () => {
  const [transactionData, setTransactionData] = useState<ITransactionData | null>(null);
  const [loading, setLoading] = useState(true);

  const getUserDetail = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}${VERSION}/dash/getPaymentByUserId?userId=8cbe5b1e-4d9a-4a1b-91c8-fd3e4f7db98k`
      );
      setTransactionData(res.data.data);
    } catch (err) {
      console.error('Error fetching payment data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserDetail();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-xl font-semibold">
        Loading Payment Details...
      </div>
    );
  }

  if (!transactionData) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-xl font-semibold">
        No Payment Data Found
      </div>
    );
  }

  const isSuccess = transactionData.payment_status?.toUpperCase() === 'SUCCESS';

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 flex justify-center">
      <div className="w-full max-w-5xl bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Header */}
        <header
          className={`p-6 flex flex-col sm:flex-row sm:items-center justify-between ${
            isSuccess ? 'bg-green-600' : 'bg-red-600'
          } text-white`}
        >
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <CreditCard size={28} className="mr-3" />
              Payment Transaction Report
            </h1>
            <p className="text-sm text-white/80 mt-1">
              {isSuccess ? 'Payment Verified Successfully' : 'Payment Failed / Cancelled'}
            </p>
          </div>
          <StatusBadge status={transactionData.payment_status} />
        </header>

        {/* Body */}
        <main className="p-6 space-y-8">
          {/* Amount + Status */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DetailItem
              icon={DollarSign}
              label="Amount"
              value={`${transactionData.amount} ${transactionData.currency || ''}`}
              highlight
            />
            <DetailItem icon={Package} label="Plan" value={transactionData.plan} />
            <DetailItem icon={Calendar} label="Created At" value={formatDate(transactionData.createdAt)} />
          </section>

          {/* User Info */}
          <section className="bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-inner">
            <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <User size={20} className="mr-2 text-indigo-500" />
              User Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <DetailItem icon={User} label="Name" value={transactionData.name} />
              <DetailItem icon={Mail} label="Email" value={transactionData.email} />
              <DetailItem icon={Phone} label="Contact" value={transactionData.contact} />
              <DetailItem icon={ExternalLink} label="Domain URL" value={transactionData.userDomainUrl} />
            </div>
          </section>

          {/* Identifiers */}
          <section className="bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-inner">
            <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <ShieldCheck size={20} className="mr-2 text-indigo-500" />
              Transaction Identifiers
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <DetailItem icon={CreditCard} label="Order ID" value={transactionData.order_id} />
              <DetailItem icon={CreditCard} label="Payment ID" value={transactionData.payment_id} />
              <DetailItem icon={User} label="CTCL ID" value={transactionData.ctclId} />
              <DetailItem
                icon={transactionData.payment_verified === 'YES' ? ShieldCheck : ShieldAlert}
                label="Payment Verified"
                value={transactionData.payment_verified === 'YES' ? 'Verified' : 'Unverified'}
                highlight={transactionData.payment_verified === 'YES'}
              />
            </div>
          </section>

          {/* Technical Info */}
          <section className="bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-inner">
            <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <Database size={20} className="mr-2 text-indigo-500" />
              Technical Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DetailItem icon={FileText} label="Description" value={transactionData.description} />
              <DetailItem icon={Package} label="Method" value={transactionData.method || 'N/A'} />
              <DetailItem icon={DollarSign} label="Fee" value={transactionData.fee || '0.00'} />
              <DetailItem icon={DollarSign} label="Tax" value={transactionData.tax || '0.00'} />
              <DetailItem icon={ExternalLink} label="VPA" value={transactionData.vpa || 'N/A'} />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default UserPaymentDetail;
