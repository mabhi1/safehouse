"use client";

import { Users } from "lucide-react";
import AddGroupForm from "./add-group-form";

export default function SplitBillEmptyState({ userId }: { userId: string }) {
  return (
    <>
      <div className="text-center p-10 border rounded-lg">
        <Users className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Select a Group</h3>
        <p className="text-muted-foreground mb-6">
          Select a group from the sidebar or create a new one to get started.
        </p>
        <AddGroupForm userId={userId} />
      </div>
    </>
  );
}
