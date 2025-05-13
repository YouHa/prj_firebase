// src/components/financial-entry/financial-entry-table.tsx
"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import type { FinancialEntry } from "@/types";
import { format } from "date-fns";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface FinancialEntryTableProps {
  entries: FinancialEntry[];
  entryType: "Income" | "Expense";
  onEdit: (entry: FinancialEntry) => void;
  onDelete: (entryId: string) => void;
}

export function FinancialEntryTable({ entries, entryType, onEdit, onDelete }: FinancialEntryTableProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>{entryType} Log</CardTitle>
        <CardDescription>A list of your recent {entryType.toLowerCase()} entries.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>
            {entries.length > 0 ? `A list of your recent ${entryType.toLowerCase()}.` : `No ${entryType.toLowerCase()} entries yet.`}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{format(new Date(entry.date), "PPP")}</TableCell>
                <TableCell className="font-medium">{entry.description}</TableCell>
                <TableCell>{entry.category}</TableCell>
                <TableCell className="text-right">
                  {entry.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => onEdit(entry)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onDelete(entry.id)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                         <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
