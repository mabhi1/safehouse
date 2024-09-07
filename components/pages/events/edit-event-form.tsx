"use client";

import { updateEvent } from "@/actions/events";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
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
import { useState } from "react";
import { DatePicker } from "@/components/ui/date-picker";
import { EventType } from "@/lib/db-types";

type EditEventFormValues = {
  title: string;
  description: string;
  date: Date;
};

export default function EditEventForm({ event, uid }: { event: EventType; uid: string }) {
  const [openDialog, setOpenDialog] = useState(false);
  const initialFormValues: EditEventFormValues = {
    title: event.title,
    description: event.description,
    date: event.date,
  };

  const { formValues, handleInputChange, handleSubmit, isPending } = useFormSubmit<EditEventFormValues>({
    initialValues: initialFormValues,
    onSubmit: async (values) => updateEvent(event.id, values.title.trim(), values.description.trim(), values.date, uid),
    onSuccess: () => setOpenDialog(false),
  });

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button variant="ghost">Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
          <DialogDescription>Enter event details and click save when you&apos;re done.</DialogDescription>
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
              placeholder="Enter Title"
              value={formValues.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="date">
              Event Date<span className="text-destructive">*</span>
            </Label>
            <DatePicker value={formValues.date} onChange={handleInputChange} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="description">
              Description<span className="text-destructive">*</span>
            </Label>
            <Textarea
              name="description"
              id="description"
              placeholder="Enter Description"
              value={formValues.description}
              onChange={handleInputChange}
              rows={7}
              cols={45}
              required
            />
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
