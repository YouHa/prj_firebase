"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { FinancialEntryForm } from "@/components/financial-entry/financial-entry-form";
import { FinancialEntryTable } from "@/components/financial-entry/financial-entry-table";
import type { IncomeEntry } from "@/types";
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

// Mock initial income data
const MOCK_INCOME_DATA: IncomeEntry[] = [
  { id: 'inc1', date: new Date('2024-07-01'), description: 'Consulting Gig', amount: 1200, category: 'Services' },
  { id: 'inc2', date: new Date('2024-07-15'), description: 'Online Course Sales', amount: 450, category: 'Digital Products' },
];

export default function IncomePage() {
  const [incomeEntries, setIncomeEntries] = useState<IncomeEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<IncomeEntry | null>(null);
  const [deletingEntryId, setDeletingEntryId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // In a real app, fetch this from localStorage or an API
    setIncomeEntries(MOCK_INCOME_DATA);
  }, []);

  const handleAddOrUpdateIncome = (data: Omit<IncomeEntry, 'id'>) => {
    if (editingEntry) {
      setIncomeEntries(prev => prev.map(e => e.id === editingEntry.id ? { ...editingEntry, ...data } : e));
      toast({ title: "Income Updated", description: `${data.description} successfully updated.`});
    } else {
      const newEntry: IncomeEntry = { ...data, id: crypto.randomUUID() };
      setIncomeEntries(prev => [newEntry, ...prev].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }
    setShowForm(false);
    setEditingEntry(null);
  };

  const handleEdit = (entry: IncomeEntry) => {
    setEditingEntry(entry);
    setShowForm(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingEntryId) {
      setIncomeEntries(prev => prev.filter(e => e.id !== deletingEntryId));
      toast({ title: "Income Deleted", description: `Entry successfully deleted.`, variant: "destructive" });
      setDeletingEntryId(null);
    }
  };

  const openFormForNew = () => {
    setEditingEntry(null);
    setShowForm(true);
  }

  return (
    <>
      <PageHeader title="Record Income" description="Manage your income sources and amounts.">
        {!showForm && (
          <Button onClick={openFormForNew}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Income
          </Button>
        )}
      </PageHeader>

      {showForm && (
        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <CardTitle>{editingEntry ? "Edit Income Entry" : "Add New Income Entry"}</CardTitle>
            <CardDescription>
              {editingEntry ? "Update the details of this income entry." : "Fill in the form to record new income."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FinancialEntryForm
              entryType="Income"
              onSubmit={handleAddOrUpdateIncome}
              initialData={editingEntry || undefined}
              onCancel={() => { setShowForm(false); setEditingEntry(null); }}
            />
          </CardContent>
        </Card>
      )}

      {!showForm && (
        <FinancialEntryTable
          entries={incomeEntries}
          entryType="Income"
          onEdit={handleEdit}
          onDelete={(id) => setDeletingEntryId(id)}
        />
      )}

      <AlertDialog open={!!deletingEntryId} onOpenChange={() => setDeletingEntryId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the income entry.
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
