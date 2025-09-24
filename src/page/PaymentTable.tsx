"use client";

import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import {data } from "../utils/data"

type Payment = {
  id: number;
  name: string;
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


export default function PaymentsTable() {
  // State for controlling the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<string>("");

  // Function to open modal with given JSON content
  const openModalWithContent = (content: string) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  // Define columns inside the component to use state
  const columns: ColumnDef<Payment>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "contact", header: "Contact" },
    { accessorKey: "amount", header: "Amount" },
    { accessorKey: "currency", header: "Currency" },
    { accessorKey: "description", header: "Description" },
    { accessorKey: "order_id", header: "Order ID" },
    { accessorKey: "payment_id", header: "Payment ID" },
    { accessorKey: "method", header: "Method" },
    { accessorKey: "status", header: "Status" },
    { accessorKey: "vpa", header: "VPA" },
    { accessorKey: "fee", header: "Fee" },
    { accessorKey: "tax", header: "Tax" },
    { accessorKey: "payment_verified", header: "Verified" },
    { accessorKey: "payment_status", header: "Payment Status" },
    {
      accessorKey: "acquirer_data",
      header: "Acquirer Data",
      cell: (info) => {
        // Get the original acquirer_data (could be object or string)
        const dataValue = info.getValue() as any;
        const jsonString = dataValue ? JSON.stringify(dataValue) : "";
        // Truncate for preview
        const shortString =
          jsonString.length > 50 ? jsonString.substring(0, 50) + "..." : jsonString;
        return (
          <div>
            <div className="whitespace-pre-wrap max-w-xs overflow-hidden">{shortString}</div>
            {jsonString.length > 50 && (
              <button
                className="text-blue-600 underline text-xs"
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
      header: "Notes",
      cell: (info) => {
        const dataValue = info.getValue() as any;
        const jsonString = dataValue ? JSON.stringify(dataValue) : "";
        const shortString =
          jsonString.length > 50 ? jsonString.substring(0, 50) + "..." : jsonString;
        return (
          <div>
            <div className="whitespace-pre-wrap max-w-xs overflow-hidden">{shortString}</div>
            {jsonString.length > 50 && (
              <button
                className="text-blue-600 underline text-xs"
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
      header: "Raw Payload",
      cell: (info) => {
        const dataValue = info.getValue() as any;
        const jsonString = dataValue ? JSON.stringify(dataValue) : "";
        const shortString =
          jsonString.length > 50 ? jsonString.substring(0, 50) + "..." : jsonString;
        return (
          <div>
            <div className="whitespace-pre-wrap max-w-xs overflow-hidden">{shortString}</div>
            {jsonString.length > 50 && (
              <button
                className="text-blue-600 underline text-xs"
                onClick={() => openModalWithContent(JSON.stringify(dataValue, null, 2))}
              >
                View more
              </button>
            )}
          </div>
        );
      },
    },
    { accessorKey: "createdAt", header: "Created At" },
    { accessorKey: "updatedAt", header: "Updated At" },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Payments Table</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-3 py-2 border border-gray-300 text-left"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-3 py-2 border border-gray-300 whitespace-pre-wrap max-w-xs overflow-auto"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for full JSON content */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded p-4 max-w-3xl w-full">
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
            <pre className="whitespace-pre-wrap bg-gray-100 p-2 overflow-auto max-h-96">
              {modalContent}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
