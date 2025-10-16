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
  Icon as LucideIcon, // Renaming Icon to LucideIcon to avoid conflict with DetailItem prop
} from 'lucide-react';

// --- TYPE DEFINITIONS ---
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
    acquirer_data: any; // Using any for unknown structure, should be defined if known
    notes: any; // Using any for unknown structure
    raw_payload: any; // Using any for unknown structure
    createdAt: string;
    updatedAt: string;
}

interface IApiResponse {
    success: boolean;
    message: string;
    data: ITransactionData;
    error: any;
}


// --- MOCK DATA (Provided by the user) ---
const mockApiResponse: IApiResponse = {
    "success": true,
    "message": "Successfully completed the request",
    "data": {
        "uuid": "0adcb0f5-a845-47f6-a74a-c78f3bd2e2ad",
        "userId": "8cbe5b1e-4d9a-4a1b-91c8-fd3e4f7db98k",
        "userDomainUrl": "eopsintechprivatlimited.com",
        "ctclId": "10000001",
        "name": "Sourabh Bhardwaj",
        "plan": "GROWTH",
        "email": "sourabh@gmail.com",
        "contact": "2020202020",
        "amount": "200.00",
        "currency": null,
        "description": "growth payment",
        "order_id": "order_RTkBV2Fkw0RNeN",
        "payment_id": null,
        "method": null,
        "status": null,
        "vpa": null,
        "fee": null,
        "tax": null,
        "payment_verified": "NO",
        "payment_status": "CANCELLED",
        "acquirer_data": null,
        "notes": null,
        "raw_payload": {},
        "createdAt": "2025-10-15T12:10:47.000Z",
        "updatedAt": "2025-10-15T12:11:01.000Z"
    },
    "error": {}
};

// --- Helper Functions ---

/**
 * Formats a raw string key into a human-readable title.
 * @param {string} key
 * @returns {string}
 */
const formatKey = (key: string): string => {
    return key
        .replace(/([A-Z])/g, ' $1') // Add space before capital letters
        .replace(/^(.)/, (match) => match.toUpperCase()) // Capitalize first letter
        .replace(/url/i, 'URL') // Fix capitalization for 'url'
        .trim();
};

/**
 * Formats ISO date string to a readable format.
 * @param {string | null | undefined} isoString
 * @returns {string}
 */
const formatDate = (isoString: string | null | undefined): string => {
    if (!isoString) return 'N/A';
    try {
        return new Date(isoString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short'
        });
    } catch (e) {
        return isoString;
    }
};

interface StatusBadgeProps {
    status: string | null | undefined;
}

/**
 * Renders a colored badge based on the payment status.
 */
const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    let colorClass: string;
    let Icon: LucideIcon = Clock;

    switch (status?.toUpperCase()) {
        case 'CAPTURED':
        case 'PAID':
            colorClass = 'bg-green-100 text-green-800 border-green-300';
            Icon = CheckCircle;
            break;
        case 'CANCELLED':
        case 'FAILED':
            colorClass = 'bg-red-100 text-red-800 border-red-300';
            Icon = XCircle;
            break;
        case 'PENDING':
        case 'CREATED':
            colorClass = 'bg-yellow-100 text-yellow-800 border-yellow-300';
            Icon = Clock;
            break;
        default:
            colorClass = 'bg-gray-100 text-gray-800 border-gray-300';
            Icon = Clock;
            break;
    }

    return (
        <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 text-sm font-semibold rounded-full border ${colorClass} transition-all duration-300`}
        >
            <Icon size={16} className="shrink-0" />
            {status || 'Unknown'}
        </span>
    );
};

interface DetailItemProps {
    icon: LucideIcon;
    label: string;
    value: string | number | null | undefined;
    className?: string;
}

// --- Single Detail Item Component ---

const DetailItem: React.FC<DetailItemProps> = ({ icon: Icon, label, value, className = '' }) => (
    <div className={`p-3 bg-white/70 rounded-lg transition-shadow duration-200 hover:shadow-md ${className}`}>
        <dt className="flex items-center text-sm font-medium text-gray-500 mb-1">
            {Icon && <Icon size={16} className="mr-2 text-indigo-500" />}
            {label}
        </dt>
        <dd className="text-base font-semibold text-gray-800 truncate">
            {value !== null && value !== undefined ? value : 'N/A'}
        </dd>
    </div>
);

// --- Main Application Component ---

const UserPaymentDetail: React.FC = () => {
    // Typed state using the ITransactionData interface
    const [transactionData, setTransactionData] = useState<ITransactionData | null>(mockApiResponse.data);

    // Explicitly typed array of keys
    const excludedKeys: (keyof ITransactionData)[] = [
        'raw_payload', 'notes', 'acquirer_data', 'currency', 'vpa', 'method',
        'status', // Redundant, use payment_status
        'uuid', 'userId', 'ctclId' // Moved to IDs section
    ];

    // Removed unused dataPairs calculation

    const Header: React.FC = () => (
        <header className="mb-8 p-4 bg-indigo-600 rounded-t-xl shadow-lg">
            <h1 className="text-3xl font-extrabold text-white flex items-center">
                <CreditCard size={32} className="mr-3" />
                Payment Transaction Report
            </h1>
            <p className="text-indigo-200 mt-1">Status: {mockApiResponse.message}</p>
        </header>
    );

    const GeneralDetails: React.FC = () => (
        <section className="p-6 bg-gray-50 rounded-xl shadow-inner mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <DetailItem
                    icon={DollarSign}
                    label="Amount"
                    // Use optional chaining for safe access
                    value={`$${transactionData?.amount || '0.00'} ${transactionData?.currency || 'USD'}`}
                    className="md:col-span-2 bg-indigo-50 border-2 border-indigo-200 shadow-lg"
                />
                <div className="flex flex-col justify-center items-end md:items-start p-3 bg-white rounded-lg">
                    <dt className="text-sm font-medium text-gray-500 mb-1">Payment Status</dt>
                    <dd className="text-lg font-bold">
                        <StatusBadge status={transactionData?.payment_status} />
                    </dd>
                </div>
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                 <DetailItem icon={Calendar} label="Created At" value={formatDate(transactionData?.createdAt)} />
                 <DetailItem icon={Calendar} label="Updated At" value={formatDate(transactionData?.updatedAt)} />
                 <DetailItem icon={Package} label="Plan" value={transactionData?.plan} />
                 <DetailItem icon={ExternalLink} label="Description" value={transactionData?.description} />
            </div>
        </section>
    );

    const UserDetails: React.FC = () => (
        <section className="mb-6 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2 flex items-center">
                <User size={20} className="mr-2 text-indigo-500" />
                User Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <DetailItem icon={User} label="Name" value={transactionData?.name} />
                <DetailItem icon={Mail} label="Email" value={transactionData?.email} />
                <DetailItem icon={Phone} label="Contact" value={transactionData?.contact} />
                <DetailItem icon={ExternalLink} label="Domain URL" value={transactionData?.userDomainUrl} className="lg:col-span-3" />
            </div>
        </section>
    );

    const IDSection: React.FC = () => (
        <section className="mb-6 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2 flex items-center">
                <Clock size={20} className="mr-2 text-indigo-500" />
                Identifiers & Verification
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <DetailItem icon={CreditCard} label="Order ID" value={transactionData?.order_id} />
                <DetailItem icon={CreditCard} label="Payment ID" value={transactionData?.payment_id || 'N/A'} />
                <DetailItem icon={User} label="User ID" value={transactionData?.userId} />
                <DetailItem
                    icon={CheckCircle}
                    label="Payment Verified"
                    value={transactionData?.payment_verified === 'YES' ? 'Verified' : 'Unverified'}
                    className={transactionData?.payment_verified === 'YES' ? 'bg-green-50' : 'bg-red-50'}
                />
            </div>
            <div className='mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <DetailItem icon={Package} label="System UUID" value={transactionData?.uuid} />
                <DetailItem icon={Package} label="CTCL ID" value={transactionData?.ctclId} />
            </div>
        </section>
    );

    if (!transactionData) {
        return <div className="text-center p-8 text-xl font-medium text-gray-500">Loading data...</div>;
    }

    return (
        <div className="font-sans min-h-screen bg-gray-100 p-4 sm:p-8 flex justify-center">
            <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl overflow-hidden">
                <Header />
                <main className="p-4 sm:p-8">
                    <GeneralDetails />
                    <UserDetails />
                    <IDSection />
                </main>
            </div>
        </div>
    );
};

export default UserPaymentDetail;