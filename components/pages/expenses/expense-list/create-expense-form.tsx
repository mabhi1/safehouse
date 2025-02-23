"use client";

import { addExpense } from "@/actions/expenses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CircleSlash, Plus, Save } from "lucide-react";
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
import { ExpenseCategoryType } from "@/lib/db-types";

type CreateExpenseFormValues = {
  amount: string;
  categoryId: string;
  paymentTypeId: string;
  currencyId: string;
  date: Date;
  title: string;
  description: string;
};

export default function CreateExpenseForm({
  uid,
  categoryData,
  paymentTypeData,
  currencyData,
}: {
  uid: string;
  categoryData: ExpenseCategoryType[];
  paymentTypeData: ExpenseCategoryType[];
  currencyData: {
    id: string;
    code: string;
    name: string;
    symbol: string;
  }[];
}) {
  const [openDialog, setOpenDialog] = useState(false);
  const initialFormValues: CreateExpenseFormValues = {
    amount: "0",
    categoryId: "",
    paymentTypeId: "",
    currencyId: "",
    date: new Date(),
    title: "",
    description: "",
  };

  const { formValues, handleInputChange, handleSubmit, isPending, isValid } = useFormSubmit<CreateExpenseFormValues>({
    initialValues: initialFormValues,
    onSubmit: async (values) =>
      addExpense(
        parseFloat(values.amount),
        values.categoryId,
        values.paymentTypeId,
        values.currencyId,
        values.date,
        values.title,
        values.description,
        uid
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
        <Button className="hidden md:flex" ICON={Plus} mobileVariant>
          Add Expense
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Expense</DialogTitle>
          <DialogDescription>Enter expense details and click save when you&apos;re done.</DialogDescription>
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
