"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { FinancialEntry } from "@/types";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  description: z.string().min(2, "Description must be at least 2 characters.").max(100),
  amount: z.coerce.number().positive("Amount must be positive."),
  category: z.string().min(2, "Category must be at least 2 characters.").max(50),
  date: z.date({ required_error: "A date is required." }),
});

type FinancialEntryFormValues = z.infer<typeof formSchema>;

interface FinancialEntryFormProps {
  entryType: "Income" | "Expense";
  onSubmit: (data: Omit<FinancialEntry, 'id'>) => void;
  initialData?: Partial<FinancialEntry>;
  onCancel?: () => void;
}

export function FinancialEntryForm({ entryType, onSubmit, initialData, onCancel }: FinancialEntryFormProps) {
  const { toast } = useToast();
  const form = useForm<FinancialEntryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData?.description || "",
      amount: initialData?.amount || 0,
      category: initialData?.category || "",
      date: initialData?.date || new Date(),
    },
  });

  function handleFormSubmit(data: FinancialEntryFormValues) {
    onSubmit(data);
    toast({
      title: `${entryType} Entry Saved`,
      description: `${data.description} for ${data.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} has been recorded.`,
    });
    form.reset(); // Reset form after successful submission
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of {entryType}</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder={`e.g., Client Payment for Project X`} {...field} />
              </FormControl>
              <FormDescription>
                A brief description of the {entryType.toLowerCase()} entry.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="0.00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input placeholder={entryType === "Income" ? "e.g., Sales, Services" : "e.g., Software, Marketing"} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex space-x-2">
          <Button type="submit">Save {entryType}</Button>
          {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>}
        </div>
      </form>
    </Form>
  );
}
