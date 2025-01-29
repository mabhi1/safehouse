"use client";

import { addCard } from "@/actions/cards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus } from "lucide-react";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CardType } from "@prisma/client";
import { useMasterPassword } from "@/components/providers/master-password-provider";
import { deriveKey, encryptAES } from "@/lib/crypto";
import { toast } from "sonner";

type CreateCardFormValues = {
  bank: string;
  cvv: string;
  expiry: string;
  number: string;
  type: CardType;
};

export default function CreateCardForm({ uid, salt, hash }: { uid: string; salt: string; hash: string }) {
  const [openDialog, setOpenDialog] = useState(false);
  const { getMasterPassword } = useMasterPassword();
  const initialFormValues: CreateCardFormValues = {
    bank: "",
    cvv: "",
    expiry: "",
    number: "",
    type: "credit",
  };

  const { formValues, handleInputChange, handleSubmit, isPending } = useFormSubmit<CreateCardFormValues>({
    initialValues: initialFormValues,
    onSubmit: async (values) => {
      const masterPassword = (await getMasterPassword(salt, hash)) as string;
      const key = await deriveKey(masterPassword, salt);
      const newExpiry = values.expiry.split("-").reverse();
      newExpiry[1] = newExpiry[1].substring(2);
      const finalExpiry = newExpiry.join("/");
      return addCard(
        values.bank.trim(),
        JSON.stringify(encryptAES(key, Buffer.from(values.cvv.trim()))),
        finalExpiry,
        JSON.stringify(encryptAES(key, Buffer.from(values.number.trim()))),
        values.type,
        uid
      );
    },
    onSuccess: () => setOpenDialog(false),
  });

  const handleButtonClick = async () => {
    try {
      await getMasterPassword(salt, hash);
      setOpenDialog(true);
    } catch (error) {
      toast.error("Error getting master password");
    }
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <div>
        <Button className="hidden md:block" onClick={handleButtonClick}>
          Add Card
        </Button>
        <Button variant="outline" size="icon" className="md:hidden" onClick={handleButtonClick}>
          <Plus className="w-[1.2rem] h-[1.2rem]" />
        </Button>
      </div>
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
              required
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
              autoFocus
              placeholder="Enter Bank Name"
              value={formValues.bank}
              onChange={handleInputChange}
              required
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
              required
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
                required
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
                required
                placeholder="Enter CVV"
                value={formValues.cvv}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
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
