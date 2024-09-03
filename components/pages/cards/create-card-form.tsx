"use client";

import { addCard } from "@/actions/cards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CardType } from "@prisma/client";

type CreateCardFormValues = {
  bank: string;
  cvv: string;
  expiry: string;
  number: string;
  type: CardType;
};

export default function CreateCardForm({ uid }: { uid: string }) {
  const [openDialog, setOpenDialog] = useState(false);
  const initialFormValues: CreateCardFormValues = {
    bank: "",
    cvv: "",
    expiry: "",
    number: "",
    type: "credit",
  };

  const { formValues, handleInputChange, handleSubmit, isPending } = useFormSubmit<CreateCardFormValues>({
    initialValues: initialFormValues,
    onSubmit: async (values) => addCard(values.bank, values.cvv, values.expiry, values.number, values.type, uid),
    onSuccess: () => setOpenDialog(false),
  });

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button>Add Card</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Card</DialogTitle>
          <DialogDescription>Enter card details and click save when you&apos;re done.</DialogDescription>
        </DialogHeader>
        <form id="form" className="space-y-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <Label>
              Card Type<span className="text-destructive">*</span>
            </Label>
            <RadioGroup
              defaultValue="credit"
              className="flex items-center gap-5"
              value={formValues.type}
              onValueChange={(value) => handleInputChange({ target: { id: "type", value } })}
            >
              <div className="flex items-center gap-1">
                <RadioGroupItem value="credit" id="credit" />
                <Label htmlFor="credit">Credit</Label>
              </div>
              <div className="flex items-center gap-1">
                <RadioGroupItem value="debit" id="debit" />
                <Label htmlFor="debit">Debit</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="bank">
              Bank Name<span className="text-destructive">*</span>
            </Label>
            <Input
              name="bank"
              id="bank"
              type="text"
              autoFocus={true}
              placeholder="Enter Bank Name"
              value={formValues.bank}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="number">
              Card Number<span className="text-destructive">*</span>
            </Label>
            <Input
              name="number"
              id="number"
              type="number"
              autoFocus={true}
              placeholder="Enter Card Number"
              value={formValues.number}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="expiry">
                Expiry<span className="text-destructive">*</span>
              </Label>
              <Input
                name="expiry"
                id="expiry"
                type="month"
                autoFocus={true}
                placeholder="Enter Expiry Date"
                value={formValues.expiry}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="cvv">
                CVV<span className="text-destructive">*</span>
              </Label>
              <Input
                name="cvv"
                id="cvv"
                type="number"
                autoFocus={true}
                placeholder="Enter CVV"
                value={formValues.cvv}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
