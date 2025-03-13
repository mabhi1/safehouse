"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Banknote, CircleSlash, Percent, Plus, Save } from "lucide-react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Select, SelectTrigger, SelectItem, SelectContent, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { getAllCurrenciesAction } from "@/actions/currency";
import { currency } from "@prisma/client";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { UserResult } from "@/lib/db-types";
import { getUsersByIds } from "@/actions/users";
import { createBillExpenseAction } from "@/actions/bill-expenses";
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { v4 as uuidV4 } from "uuid";
import "@/firebase";

type CreateExpenseFormValues = {
  title: string;
  description: string;
  amount: number;
  currencyId: string;
  splitType: "equal" | "percentage" | "amount";
  paidBy: string;
};

export default function CreateExpenseForm({
  members,
  groupId,
  userId,
}: {
  members: { id: string; userId: string }[];
  groupId: string;
  userId: string;
}) {
  const [currencies, setCurrencies] = useState<currency[]>([]);
  const [loadingCurrencies, setLoadingCurrencies] = useState(true);
  const [users, setUsers] = useState<UserResult[]>([]);
  const storage = getStorage();
  const [selectedMembers, setSelectedMembers] = useState<Record<string, boolean>>({});
  const [memberShares, setMemberShares] = useState<Record<string, { amount: number; percentage: number }>>({});

  // Initialize selected members and shares
  useEffect(() => {
    const initialSelectedMembers: Record<string, boolean> = {};
    const initialMemberShares: Record<string, { amount: number; percentage: number }> = {};

    members.forEach((member) => {
      initialSelectedMembers[member.id] = true;
      initialMemberShares[member.id] = { amount: 0, percentage: 0 };
    });

    setSelectedMembers(initialSelectedMembers);
    setMemberShares(initialMemberShares);
  }, [members]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await getUsersByIds(members.map((member) => member.userId));
      if (error || !data) {
        throw new Error(error);
      }
      setUsers(data);
    };
    fetchUsers();
  }, [members]);

  const getUser = (userId: string) => {
    return users.find((user) => user.id === userId);
  };
  // Fetch currencies
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const { data, error } = await getAllCurrenciesAction();
        if (error) {
          throw new Error(error);
        }

        if (data) {
          setCurrencies(data);
        }
      } catch (error) {
        toast.error("Failed to load currencies");
        console.error(error);
      } finally {
        setLoadingCurrencies(false);
      }
    };

    fetchCurrencies();
  }, []);

  const uploadImage = (file: File | undefined | null) => {
    return new Promise((resolve, _) => {
      if (!file) resolve(undefined);
      const dbId = uuidV4();
      const storageRef = ref(storage, dbId);

      // 'file' comes from the Blob or File API
      const uploadTask = uploadBytesResumable(storageRef, file as any);

      uploadTask.on(
        "state_changed",
        () => {},
        () => {},
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async () => {
            const url = await getDownloadURL(storageRef);
            resolve(url as string);
          });
        }
      );
    });
  };

  const [openDialog, setOpenDialog] = useState(false);
  const initialFormValues: CreateExpenseFormValues = {
    title: "",
    description: "",
    amount: 0,
    currencyId: currencies.find((currency) => currency.code === "USD")?.id || "",
    splitType: "equal",
    paidBy: userId,
  };

  const { formValues, handleInputChange, handleSubmit, isPending, isValid } = useFormSubmit<CreateExpenseFormValues>({
    initialValues: initialFormValues,
    onSubmit: async (values) => {
      if (!validateShares()) {
        return { data: null, error: "Invalid shares" };
      }
      const selectedMemberIds = Object.keys(selectedMembers).filter((id) => selectedMembers[id]);
      const shares = selectedMemberIds.map((memberId) => ({
        memberId,
        amount: memberShares[memberId].amount,
        percentage: values.splitType === "percentage" ? memberShares[memberId].percentage : undefined,
      }));
      const file = document.getElementById("file") as HTMLInputElement;
      const imageUrl = (await uploadImage(file?.files?.[0])) as string | undefined;

      const { data, error } = await createBillExpenseAction(
        values.title.trim(),
        parseFloat(values.amount.toString()),
        values.currencyId,
        groupId,
        values.splitType,
        values.paidBy,
        values.description.trim() || undefined,
        shares,
        imageUrl
      );
      if (error && imageUrl) {
        const imageUrlArray = imageUrl.split("/");
        const fileRef = ref(storage, imageUrlArray[imageUrlArray.length - 1].split("?")[0]);
        await deleteObject(fileRef);
      }
      return { data, error };
    },
    onSuccess: () => setOpenDialog(false),
    optionalFields: ["description"],
    validations: {
      amount: (value) => {
        if (parseFloat(value as string) <= 0) return false;
        return true;
      },
      currencyId: (value) => {
        return value !== "";
      },
      paidBy: (value) => {
        return value !== "";
      },
    },
  });

  // Calculate equal shares when amount or selected members change
  useEffect(() => {
    if (formValues.splitType === "equal") {
      calculateEqualShares();
    } else if (formValues.amount && formValues.splitType === "percentage") {
      // Recalculate amounts when total amount changes but keep percentages the same
      updateAmountsFromPercentages();
    }
  }, [formValues.amount, selectedMembers, formValues.splitType]);

  // Add this new function to update amounts based on percentages
  const updateAmountsFromPercentages = () => {
    if (!formValues.amount) return;

    const totalAmount = parseFloat(formValues.amount.toString());
    const newMemberShares = { ...memberShares };

    Object.keys(newMemberShares).forEach((memberId) => {
      if (selectedMembers[memberId]) {
        newMemberShares[memberId].amount = (newMemberShares[memberId].percentage / 100) * totalAmount;
      }
    });

    setMemberShares(newMemberShares);
  };

  const validateShares = () => {
    if (!formValues.amount) return false;

    const totalAmount = parseFloat(formValues.amount.toString());
    const selectedMemberIds = Object.keys(selectedMembers).filter((id) => selectedMembers[id]);

    if (selectedMemberIds.length === 0) {
      toast.error("Please select at least one member to split with");
      return false;
    }

    // Check if any selected member has a share of 0
    const hasZeroShare = selectedMemberIds.some((id) => memberShares[id].amount === 0);
    if (hasZeroShare) {
      toast.error("All selected members must have a share greater than 0");
      return false;
    }

    // For amount or percentage split types, validate the total
    if (formValues.splitType === "amount") {
      const totalShares = selectedMemberIds.reduce((sum, id) => sum + memberShares[id].amount, 0);
      if (Math.abs(totalShares - totalAmount) > 0.01) {
        toast.error(
          `The sum of shares (${totalShares.toFixed(2)}) must equal the total amount (${totalAmount.toFixed(2)})`
        );
        return false;
      }
    } else if (formValues.splitType === "percentage") {
      const totalPercentage = selectedMemberIds.reduce((sum, id) => sum + memberShares[id].percentage, 0);
      if (Math.abs(totalPercentage - 100) > 0.01) {
        toast.error(`The sum of percentages (${totalPercentage.toFixed(2)}%) must equal 100%`);
        return false;
      }
    }

    return true;
  };

  const getTotalShares = () => {
    const selectedMemberIds = Object.keys(selectedMembers).filter((id) => selectedMembers[id]);
    if (formValues.splitType === "amount") {
      return selectedMemberIds.reduce((sum, id) => sum + memberShares[id].amount, 0);
    } else if (formValues.splitType === "percentage") {
      return selectedMemberIds.reduce((sum, id) => sum + memberShares[id].percentage, 0);
    }
    return 0;
  };

  const getShareStatus = () => {
    if (!formValues.amount) return { isValid: false, message: "" };
    const totalAmount = formValues.amount;
    const totalShares = getTotalShares();

    if (formValues.splitType === "amount") {
      const diff = Math.abs(totalShares - totalAmount);
      if (diff < 0.01) {
        return { isValid: true, message: "Shares sum up to the total amount" };
      } else if (totalShares < totalAmount) {
        return { isValid: false, message: `${(totalAmount - totalShares).toFixed(2)} remaining to allocate` };
      } else {
        return { isValid: false, message: `${(totalShares - totalAmount).toFixed(2)} over-allocated` };
      }
    } else if (formValues.splitType === "percentage") {
      const diff = Math.abs(totalShares - 100);
      if (diff < 0.01) {
        return { isValid: true, message: "Percentages sum up to 100%" };
      } else if (totalShares < 100) {
        return { isValid: false, message: `${(100 - totalShares).toFixed(2)}% remaining to allocate` };
      } else {
        return { isValid: false, message: `${(totalShares - 100).toFixed(2)}% over-allocated` };
      }
    }

    return { isValid: true, message: "" };
  };

  const shareStatus = getShareStatus();

  const calculateEqualShares = () => {
    const numSelected = Object.values(selectedMembers).filter(Boolean).length;
    if (numSelected === 0 || !formValues.amount) return;

    const totalAmount = parseFloat(formValues.amount.toString());
    const equalShare = totalAmount / numSelected;

    const newMemberShares = { ...memberShares };

    Object.keys(selectedMembers).forEach((memberId) => {
      if (selectedMembers[memberId]) {
        newMemberShares[memberId] = {
          amount: equalShare,
          percentage: 100 / numSelected,
        };
      } else {
        newMemberShares[memberId] = { amount: 0, percentage: 0 };
      }
    });

    setMemberShares(newMemberShares);
  };

  const updateMemberShare = (memberId: string, value: string, type: "amount" | "percentage") => {
    const numValue = parseFloat(value) || 0;
    const newMemberShares = { ...memberShares };

    if (type === "amount") {
      newMemberShares[memberId] = {
        ...newMemberShares[memberId],
        amount: numValue,
      };

      // Update percentage based on amount if total amount is available
      if (formValues.amount) {
        const totalAmount = parseFloat(formValues.amount.toString());
        if (totalAmount > 0) {
          newMemberShares[memberId].percentage = (numValue / totalAmount) * 100;
        }
      }
    } else {
      newMemberShares[memberId] = {
        ...newMemberShares[memberId],
        percentage: numValue,
      };

      // Update amount based on percentage if total amount is available
      if (formValues.amount) {
        const totalAmount = parseFloat(formValues.amount.toString());
        newMemberShares[memberId].amount = (numValue / 100) * totalAmount;
      }
    }

    setMemberShares(newMemberShares);
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button variant="default" className="gap-1">
          <Plus className="h-4 w-4" />
          Add Expense
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
          <DialogDescription>Create a new expense to split with your group members.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">
                Title<span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="Dinner, Groceries, etc."
                value={formValues.title}
                onChange={handleInputChange}
                required
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Add more details about this expense"
                value={formValues.description}
                onChange={handleInputChange}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">
                  Amount<span className="text-destructive">*</span>
                </Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formValues.amount}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currencyId">
                  Currency<span className="text-destructive">*</span>
                </Label>
                <Select
                  name="currencyId"
                  value={formValues.currencyId}
                  onValueChange={(value) => handleInputChange({ target: { id: "currencyId", value } } as any)}
                  disabled={loadingCurrencies}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.id} value={currency.id}>
                        {currency.code} ({currency.symbol})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paidBy">
                Paid By<span className="text-destructive">*</span>
              </Label>
              <Select
                name="paidBy"
                value={formValues.paidBy}
                onValueChange={(value) => handleInputChange({ target: { id: "paidBy", value } } as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select who paid" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.id === userId ? "You" : `${user.firstName} ${user.lastName}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>
                Split Type<span className="text-destructive">*</span>
              </Label>
              <RadioGroup
                name="splitType"
                value={formValues.splitType}
                onValueChange={(value) =>
                  handleInputChange({
                    target: { id: "splitType", value },
                  } as any)
                }
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="equal" id="equal" />
                  <Label htmlFor="equal" className="font-normal cursor-pointer">
                    Equal Split
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="percentage" id="percentage" />
                  <Label htmlFor="percentage" className="font-normal cursor-pointer">
                    Percentage Split
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="amount" id="amount" />
                  <Label htmlFor="amount" className="font-normal cursor-pointer">
                    Amount Split
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>
                Split With<span className="text-destructive">*</span>
              </Label>
              <div className="border rounded-md p-4 space-y-4">
                {members.map((member) => (
                  <div key={member.id} className="flex items-start space-x-2">
                    <Checkbox
                      id={`member-${member.id}`}
                      checked={selectedMembers[member.id] || false}
                      onCheckedChange={(checked) => {
                        setSelectedMembers({ ...selectedMembers, [member.id]: !!checked });
                      }}
                      disabled={isPending}
                      className="mt-1"
                    />
                    <div className="flex-1 space-y-1">
                      <Label htmlFor={`member-${member.id}`} className="cursor-pointer">
                        {member.userId === userId
                          ? "You"
                          : `${getUser(member.userId)?.firstName} ${getUser(member.userId)?.lastName}`}
                      </Label>

                      {selectedMembers[member.id] && (
                        <div className="flex items-center space-x-2">
                          {formValues.splitType === "equal" ? (
                            <div className="text-sm text-muted-foreground">
                              {formValues.amount ? (
                                <span>
                                  {memberShares[member.id]?.amount.toFixed(2)} (
                                  {memberShares[member.id]?.percentage.toFixed(2)}%)
                                </span>
                              ) : (
                                <span>Equal share</span>
                              )}
                            </div>
                          ) : formValues.splitType === "percentage" ? (
                            <div className="flex items-center space-x-2 w-full">
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                max="100"
                                value={memberShares[member.id]?.percentage || 0}
                                onChange={(e) => {
                                  updateMemberShare(member.id, e.target.value, "percentage");
                                  handleInputChange({
                                    target: {
                                      id: "memberShares",
                                      value: {
                                        ...memberShares,
                                        [member.id]: {
                                          ...memberShares[member.id],
                                          percentage: parseFloat(e.target.value),
                                        },
                                      },
                                    },
                                  });
                                }}
                                disabled={isPending}
                                className="w-24"
                              />
                              <Percent className="h-4 w-4 text-muted-foreground" />
                              {formValues.amount && (
                                <span className="text-sm text-muted-foreground">
                                  = {memberShares[member.id]?.amount.toFixed(2)}
                                </span>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2 w-full">
                              <Banknote className="h-4 w-4 text-muted-foreground" />
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                value={memberShares[member.id]?.amount || 0}
                                onChange={(e) => {
                                  updateMemberShare(member.id, e.target.value, "amount");
                                  handleInputChange({
                                    target: {
                                      id: "memberShares",
                                      value: {
                                        ...memberShares,
                                        [member.id]: {
                                          ...memberShares[member.id],
                                          amount: parseFloat(e.target.value),
                                        },
                                      },
                                    },
                                  });
                                }}
                                disabled={isPending}
                                className="w-24"
                              />
                              {formValues.amount && (
                                <span className="text-sm text-muted-foreground">
                                  = {memberShares[member.id]?.percentage.toFixed(2)}%
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {(formValues.splitType === "amount" || formValues.splitType === "percentage") && (
                  <div className="pt-2 border-t">
                    <div className={`text-sm ${shareStatus.isValid ? "text-green-600" : "text-amber-600"}`}>
                      {shareStatus.message}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="file">Upload Receipt</Label>
              <Input type="file" multiple={false} id="file" name="file" />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" ICON={CircleSlash}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" ICON={Save} loading={isPending} disabled={!isValid || !shareStatus.isValid}>
              Save Expense
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
