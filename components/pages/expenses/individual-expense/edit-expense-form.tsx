"use client";

import { editExpense } from "@/actions/expenses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CircleSlash, FilePenLine, Save } from "lucide-react";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { DatePicker } from "@/components/ui/date-picker";
import { ExpenseCategoryType, ExpenseCurrencyType, ExpenseType } from "@/lib/db-types";
import { useAuth } from "@clerk/nextjs";

type EditExpenseFormValues = {
  amount: string;
  categoryId: string;
  paymentTypeId: string;
  currencyId: string;
  date: Date;
  title: string;
  description: string;
};

export default function EditExpenseForm({
  categoryData,
  paymentTypeData,
  currencyData,
  expense,
}: {
  categoryData: ExpenseCategoryType[];
  paymentTypeData: ExpenseCategoryType[];
  currencyData: ExpenseCurrencyType[];
  expense: ExpenseType;
}) {
  const { userId } = useAuth();
  const [openDialog, setOpenDialog] = useState(false);
  const initialFormValues: EditExpenseFormValues = {
    amount: expense.amount.toString(),
    categoryId: expense.categoryId,
    paymentTypeId: expense.paymentTypeId,
    currencyId: expense.currencyId,
    date: expense.date,
    title: expense.title,
    description: expense.description || "",
  };

  const { formValues, handleInputChange, handleSubmit, isPending, isValid } = useFormSubmit<EditExpenseFormValues>({
    initialValues: initialFormValues,
    onSubmit: async (values) =>
      editExpense(
        expense.id,
        parseFloat(values.amount),
        values.categoryId,
        values.paymentTypeId,
        values.currencyId,
        values.date,
        values.title,
        values.description,
        userId!
      ),
    onSuccess: () => setOpenDialog(false),
    optionalFields: ["description"],
    validations: {
      amount: (value) => parseFloat(value.toString()) > 0,
    },
  });

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button variant="secondary" ICON={FilePenLine} mobileVariant>
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Expense</DialogTitle>
          <DialogDescription>Enter updated expense details and click save when you&apos;re done.</DialogDescription>
        </DialogHeader>
        <form id="form" className="space-y-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">
              Title<span className="text-destructive">*</span>
            </Label>
            <Input
              name="title"
              id="title"
              type="text"
              autoFocus={true}
              required
              placeholder="Enter Title"
              value={formValues.title}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="amount">
              Amount<span className="text-destructive">*</span>
            </Label>
            <Input
              name="amount"
              id="amount"
              type="number"
              required
              placeholder="Enter amount"
              value={formValues.amount}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="date">
              Expense Date<span className="text-destructive">*</span>
            </Label>
            <DatePicker value={formValues.date} onChange={handleInputChange} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="description">
              Category<span className="text-destructive">*</span>
            </Label>
            <Select
              value={formValues.categoryId}
              onValueChange={(value) => handleInputChange({ target: { id: "categoryId", value } })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categoryData.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-3 gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="description">
                Currency<span className="text-destructive">*</span>
              </Label>
              <Select
                value={formValues.currencyId}
                onValueChange={(value) => handleInputChange({ target: { id: "currencyId", value } })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencyData.map((currency) => (
                    <SelectItem key={currency.id} value={currency.id}>
                      {currency.code} {currency.symbol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 flex flex-col gap-2">
              <Label htmlFor="description">
                Payment type<span className="text-destructive">*</span>
              </Label>
              <Select
                value={formValues.paymentTypeId}
                onValueChange={(value) => handleInputChange({ target: { id: "paymentTypeId", value } })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment" />
                </SelectTrigger>
                <SelectContent>
                  {paymentTypeData.map((payment) => (
                    <SelectItem key={payment.id} value={payment.id}>
                      {payment.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              name="description"
              id="description"
              placeholder="Enter Description"
              value={formValues.description}
              onChange={handleInputChange}
              rows={7}
              cols={45}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" ICON={CircleSlash}>
                Cancel
              </Button>
            </DialogClose>
            <Button loading={isPending} ICON={Save} disabled={!isValid}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
