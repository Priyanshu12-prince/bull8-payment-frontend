"use client";

import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { Search, X, ChevronUp, ChevronDown, ArrowUpDown, CheckCircle, XCircle, Clock, AlertCircle, CreditCard ,IndianRupee} from "lucide-react";
import { useAllPaymentData } from "../hooks/useAllPayentData";
 function formatDateTimeToIST(dateString: string | Date) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}



type Payment = {
  uuid: number;
  name: string;
  userDomainUrl: string;
  ctlId: string;
  userId: string;
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
  payment_verified: string;
  payment_status: string;
  acquirer_data?: any;
  notes?: any;
  raw_payload?: any;
  createdAt: string;
  updatedAt: string;
};

function formatDateTime(value: string) {
  if (!value) return "-";
  const d = new Date(value);
  const pad = (n: number) => String(n).padStart(2, "0");

  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  const seconds = pad(d.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}



// Capitalize the first letter of each word
function capitalizeWords(input: string | null | undefined): string {
  const value = (input ?? '').toString();
  return value
    .toLowerCase()
    .replace(/\b([a-z])(\w*)/g, (_: string, first: string, rest: string) => `${first.toUpperCase()}${rest}`);
}

export default function PaymentsTable() {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<string>("");
  const [sorting, setSorting] = useState<SortingState>([{ id: "createdAt", desc: true }]);
  const [globalFilter, setGlobalFilter] = useState<string>("");


  const { payments, loading, error } = useAllPaymentData();
  const tableData = useMemo<Payment[]>(() => {
    const nested = (payments as any)?.data?.data;
    if (Array.isArray(nested)) return nested as Payment[];
    if (Array.isArray(payments)) return payments as unknown as Payment[];
    return [] as Payment[];
  }, [payments]);




  // Function to open modal with given JSON content
  const openModalWithContent = (content: string) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  // Define columns inside the component to use state
  const columns: ColumnDef<Payment>[] = useMemo(() => [
    { accessorKey: "uuid", header: () => <span>ID</span> },
    { accessorKey: "userId", header: () => <span>User ID</span> },
    { accessorKey: "ctclId", header: () => <span>CTL ID</span> },
    { accessorKey: "userDomainUrl", header: () => <span>User Domain</span> },
   
    { accessorKey: "name", header: () => <span>Name</span>, cell: ({ getValue }) => <span>{capitalizeWords(getValue() as string)}</span> },
    { accessorKey: "email", header: () => <span>Email</span> },
    { accessorKey: "contact", header: () => <span>Contact</span> },
    { accessorKey: "plan", header: () => <span>Plan</span>, cell: ({ getValue }) => <span>{capitalizeWords(getValue() as string)}</span> },
    { 
      accessorKey: "amount", 
      header: () => <span>Amount</span>,
      cell: ({ getValue }) => {
        const value = getValue<number>(); // amount in paise
        return <span className="flex"  >  <IndianRupee className="w-[15px]"/> {(value / 100).toFixed(2)}</span>; // convert to rupees with 2 decimals
      }
    },
    
    
    { accessorKey: "currency", header: () => <span>Currency</span> },

    { accessorKey: "order_id", header: () => <span>Order ID</span> },
    { accessorKey: "payment_id", header: () => <span>Payment ID</span> },
    {
      accessorKey: "method",
      header: () => <span>Method</span>,
      cell: (info) => {
        const value = info.getValue() as string | null;
        if (!value) return null;
        return (
          <span className="inline-flex items-center gap-1 rounded-full px-4 py-1 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-700">
            <CreditCard className="w-3.5 h-3.5" /> {capitalizeWords(value)}
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: () => <span>Status</span>,
      cell: (info) => {
        // Default to "failed" if null/undefined/empty
        const raw = info.getValue() as string | null;
        const value = raw ? raw.toLowerCase() : "pending";
    
        const map: Record<
          string,
          { bg: string; text: string; label: string; Icon: any }
        > = {
          captured: {
            bg: "bg-emerald-50",
            text: "text-emerald-700",
            label: "Captured",
            Icon: CheckCircle,
          },
      
          failed: {
            bg: "bg-rose-50",
            text: "text-rose-700",
            label: "Failed",
            Icon: XCircle,
          },
        };
    
        const style =
          map[value] ||
          ({
            bg: "bg-yellow-100",
            text: "text-yellow-800",
            label: raw ?? "Pending",
            Icon: Clock,
          } as const);
    
        return (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold ${style.bg} ${style.text}`}
          >
            <style.Icon className="w-3.5 h-3.5" /> {capitalizeWords(style.label as string)}
          </span>
        );
      },
    },
    
    {
      accessorKey: "payment_status",
      header: () => <span>Payment Status</span>,
      cell: (info) => {
        const value = (info.getValue() as string | null)?.toLowerCase();
        const map: Record<string, { bg: string; text: string; label: string }> = {
          success: { bg: "bg-green-100", text: "text-green-800", label: "Success" },
          pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pending" },
          cancelled: { bg: "bg-red-100", text: "text-red-800", label: "Cancelled" },
        };
        const style = (value && map[value]) || { bg: "bg-gray-100", text: "text-gray-800", label: capitalizeWords(info.getValue() as string) };
        return (
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${style.bg} ${style.text}`}>
            {style.label}
          </span>
        );
      },
    },
    { accessorKey: "vpa", header: () => <span>VPA</span> },
    { 
      accessorKey: "fee", 
      header: () => <span>Fee</span>,
      cell: ({ getValue }) => {
        const value = getValue<number>(); // fee in paise
        return <span>₹{(value / 100).toFixed(2)}</span>; // convert to rupees
      }
    },
    { 
      accessorKey: "tax", 
      header: () => <span>Tax</span>,
      cell: ({ getValue }) => {
        const value = getValue<number>(); // tax in paise
        return <span>₹{(value / 100).toFixed(2)}</span>; // convert to rupees
      }
    }
    ,
    {
      accessorKey: "payment_verified",
      header: () => <span>Verified</span>,
      cell: (info) => {
        const value = (info.getValue() as string | null)?.toLowerCase();
        const yes = value === "true" || value === "yes" || value === "verified";
        return (
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold ${yes ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
            {yes ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />} {yes ? 'Yes' : 'No'}
          </span>
        );
      },
    },
 
    { accessorKey: "description", header: () => <span>Description</span>, cell: ({ getValue }) => <span>{capitalizeWords(getValue() as string)}</span> },
    {
      accessorKey: "acquirer_data",
      header: () => <span>Acquirer Data</span>,
      cell: (info) => {
        const dataValue = info.getValue() as any;
        const isJson = dataValue && (typeof dataValue === 'object' || Array.isArray(dataValue));
        const jsonString = isJson ? JSON.stringify(dataValue) : (dataValue ?? '');
        const shortString = typeof jsonString === 'string' ? jsonString.slice(0, 80) + (jsonString.length > 80 ? '...' : '') : '';
        return (
          <div className="flex items-center gap-2">
            <span className="truncate">{shortString}</span>
            {isJson && (
              <button
                className="text-blue-600 underline text-xs flex-shrink-0"
                onClick={() => openModalWithContent(JSON.stringify(dataValue, null, 2))}
              >
                View more
              </button>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "notes",
      header: () => <span>Notes</span>,
      cell: (info) => {
        const dataValue = info.getValue() as any;
        const isJson = dataValue && (typeof dataValue === 'object' || Array.isArray(dataValue));
        const jsonString = isJson ? JSON.stringify(dataValue) : (dataValue ?? '');
        const shortString = typeof jsonString === 'string' ? jsonString.slice(0, 80) + (jsonString.length > 80 ? '...' : '') : '';
        return (
          <div className="flex items-center gap-2">
            <span className="truncate">{shortString}</span>
            {isJson && (
              <button
                className="text-blue-600 underline text-xs flex-shrink-0"
                onClick={() => openModalWithContent(JSON.stringify(dataValue, null, 2))}
              >
                View more
              </button>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "raw_payload",
      header: () => <span>Raw Payload</span>,
      cell: (info) => {
        const dataValue = info.getValue() as any;
        const isJson = dataValue && (typeof dataValue === 'object' || Array.isArray(dataValue));
        const jsonString = isJson ? JSON.stringify(dataValue) : (dataValue ?? '');
        const shortString = typeof jsonString === 'string' ? jsonString.slice(0, 80) + (jsonString.length > 80 ? '...' : '') : '';
        return (
          <div className="flex items-center gap-2">
            <span className="truncate">{shortString}</span>
            {isJson && (
              <button
                className="text-blue-600 underline text-xs flex-shrink-0"
                onClick={() => openModalWithContent(JSON.stringify(dataValue, null, 2))}
              >
                View more
              </button>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: () => <span>Created At</span>,
      cell: (info) => formatDateTimeToIST(info.getValue() as string),
    },
    {
      accessorKey: "updatedAt",
      header: () => <span>Updated At</span>,
      cell: (info) => formatDateTimeToIST(info.getValue() as string),
    },

  ], []);

  // Fixed column width classes for consistent layout
  const columnClassName: Record<string, string> = {
    id: 'w-16',
    userId: 'w-16',
    ctlId: 'w-16',
    userDomainUrl: 'w-40',
    name: 'w-40',
    email: 'w-56',
    contact: 'w-40',
    plan: 'w-40',
    amount: 'w-28 text-right',
    currency: 'w-24',
    description: 'w-80',
    order_id: 'w-64',
    payment_id: 'w-64',
    method: 'w-36',
    status: 'w-32',
    vpa: 'w-44',
    fee: 'w-28 text-right',
    tax: 'w-28 text-right',
    payment_verified: 'w-32',
    payment_status: 'w-36',
    acquirer_data: 'w-64',
    notes: 'w-64',
    raw_payload: 'w-74',
    createdAt: 'w-44',
    updatedAt: 'w-44',
  };

  const table = useReactTable({
    data: tableData,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-slate-900">Payments Table</h1>
          
        </div>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search all columns..."
            className="w-80 max-w-full rounded-md border border-slate-300 bg-white pl-9 pr-8 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
          {globalFilter && (
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              onClick={() => setGlobalFilter("")}
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {loading && (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-slate-600">Loading payments...</div>
      )}

      {!loading && error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-6 text-rose-700">Failed to load payments: {error}</div>
      )}

      {!loading && !error && tableData.length === 0 && (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-slate-600">No payments available yet.</div>
      )}

      {!loading && !error && tableData.length > 0 && (
      <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-sm bg-white">
        <table className="min-w-full text-m table-fixed border-separate border-spacing-y-3 border-spacing-x-0">
          <thead className="bg-slate-900 text-slate-100 sticky top-0 z-10">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sortDir = header.column.getIsSorted();
                  return (
                  <th
                    key={header.id}
                      onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                      className={`px-3 py-2 border-b border-slate-800 text-left font-semibold ${columnClassName[header.column.id] || ''} ${canSort ? 'cursor-pointer select-none hover:bg-slate-800/60' : ''}`}
                  >
                      <div className="flex items-center gap-1">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                        {canSort && (
                          <span className="text-slate-300">
                            {sortDir === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : sortDir === 'desc' ? <ChevronDown className="w-3.5 h-3.5" /> : <ArrowUpDown className="w-3.5 h-3.5" />}
                          </span>
                        )}
                      </div>
                  </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, idx) => (
              <tr key={row.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={`px-4 py-3 align-top max-w-xs overflow-hidden text-ellipsis ${columnClassName[cell.column.id] || ''} whitespace-nowrap truncate`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}

      {/* Modal for full JSON content */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900/70 z-50">
          <div className="bg-white rounded-lg p-4 max-w-3xl w-full shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Detail View</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
            </div>
            {/* Display the full content with formatting */}
            <pre className="whitespace-pre-wrap bg-slate-50 p-3 rounded border border-slate-200 overflow-auto max-h-96">
              {modalContent}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
