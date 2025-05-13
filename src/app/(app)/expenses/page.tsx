"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { FinancialEntryForm } from "@/components/financial-entry/financial-entry-form";
import { FinancialEntryTable } from "@/components/financial-entry/financial-entry-table";
import type { ExpenseEntry } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Mock initial expense data
const MOCK_EXPENSE_DATA: ExpenseEntry[] = [
  { id: 'exp1', date: new Date('2024-07-05'), description: 'Software Subscription', amount: 50, category: 'Software' },
  { id: 'exp2', date: new Date('2024-07-20'), description: 'Office Rent', amount: 800, category: 'Rent' },
];

export default function ExpensesPage() {
  const [expenseEntries, setExpenseEntries] = useState<ExpenseEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<ExpenseEntry | null>(null);
  const [deletingEntryId, setDeletingEntryId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // In a real app, fetch this from localStorage or an API
    setExpenseEntries(MOCK_EXPENSE_DATA);
  }, []);

  const handleAddOrUpdateExpense = (data: Omit<ExpenseEntry, 'id'>) => {
     if (editingEntry) {
      setExpenseEntries(prev => prev.map(e => e.id === editingEntry.id ? { ...editingEntry, ...data } : e));
      toast({ title: "Expense Updated", description: `${data.description} successfully updated.`});
    } else {
      const newEntry: ExpenseEntry = { ...data, id: crypto.randomUUID() };
      setExpenseEntries(prev => [newEntry, ...prev].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }
    setShowForm(false);
    setEditingEntry(null);
  };

  const handleEdit = (entry: ExpenseEntry) => {
    setEditingEntry(entry);
    setShowForm(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingEntryId) {
      setExpenseEntries(prev => prev.filter(e => e.id !== deletingEntryId));
      toast({ title: "Expense Deleted", description: `Entry successfully deleted.`, variant: "destructive" });
      setDeletingEntryId(null);
    }
  };
  
  const openFormForNew = () => {
    setEditingEntry(null);
    setShowForm(true);
  }

  return (
    <>
      <PageHeader title="Record Expenses" description="Track your business expenditures.">
        {!showForm && (
          <Button onClick={openFormForNew}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Expense
          </Button>
        )}
      </PageHeader>

      {showForm && (
        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <CardTitle>{editingEntry ? "Edit Expense Entry" : "Add New Expense Entry"}</CardTitle>
            <CardDescription>
              {editingEntry ? "Update the details of this expense entry." : "Fill in the form to record a new expense."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FinancialEntryForm
              entryType="Expense"
              onSubmit={handleAddOrUpdateExpense}
              initialData={editingEntry || undefined}
              onCancel={() => { setShowForm(false); setEditingEntry(null); }}
            />
          </CardContent>
        </Card>
      )}

      {!showForm && (
        <FinancialEntryTable
          entries={expenseEntries}
          entryType="Expense"
          onEdit={handleEdit}
          onDelete={(id) => setDeletingEntryId(id)}
        />
      )}

      <AlertDialog open={!!deletingEntryId} onOpenChange={() => setDeletingEntryId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the expense entry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
