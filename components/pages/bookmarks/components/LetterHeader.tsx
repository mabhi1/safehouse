"use client";

import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";

interface LetterHeaderProps {
  letter: string;
}

export default function LetterHeader({ letter }: LetterHeaderProps) {
  return (
    <TableRow id={letter} className="scroll-mt-28 hover:bg-transparent">
      <TableCell colSpan={6} className="px-4 py-2">
        <div className="flex items-center gap-5">
          <h2 className="text-muted-foreground/60">{letter}</h2>
        </div>
      </TableCell>
    </TableRow>
  );
}
