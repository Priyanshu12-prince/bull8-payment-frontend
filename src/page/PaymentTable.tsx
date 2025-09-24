"use client";

import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { data } from "../utils/data";

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

// 👈 your JSON file

// Define all columns
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
    accessorFn: (row) => JSON.stringify(row.acquirer_data),
    header: "Acquirer Data",
  },
  {
    accessorFn: (row) => JSON.stringify(row.notes),
    header: "Notes",
  },
  {
    accessorFn: (row) => JSON.stringify(row.raw_payload),
    header: "Raw Payload",
  },
  { accessorKey: "createdAt", header: "Created At" },
  { accessorKey: "updatedAt", header: "Updated At" },
];

export default function PaymentsTable() {
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
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
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
    </div>
  );
}
