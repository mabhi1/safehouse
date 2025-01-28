"use client";

import { useAuth } from "@clerk/nextjs";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deriveKey, generateHash } from "@/lib/crypto";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { Button } from "../ui/button";

const MasterPasswordContext = createContext<{
  getMasterPassword: (salt: string, hash: string) => Promise<unknown>;
  saveMasterPassword: (password: string) => void;
  clearMasterPassword: () => void;
} | null>(null);

export const MasterPasswordProvider = ({ children }: { children: React.ReactNode }) => {
  const [masterPassword, setMasterPassword] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [salt, setSalt] = useState("");
  const [hash, setHash] = useState("");
  const resolveCallbackRef = useRef<((password: string) => void) | null>(null);
  const rejectCallbackRef = useRef<((error: Error) => void) | null>(null);
  const { userId } = useAuth();

  useEffect(() => {
    if (!userId) setMasterPassword("");
  }, [userId]);

  // Function to set the master password
  const saveMasterPassword = (password: string) => {
    setMasterPassword(password);
  };

  // Function to get the master password
  const getMasterPassword = useCallback(
    (salt: string, hash: string) => {
      return new Promise((resolve, reject) => {
        if (masterPassword) {
          resolve(masterPassword);
        } else {
          resolveCallbackRef.current = resolve;
          rejectCallbackRef.current = reject;
          setSalt(salt);
          setHash(hash);
          setDialogOpen(true);
        }
      });
    },
    [masterPassword]
  );

  // Function to check if the entered password is correct
  const verifyMasterPassword = async (password: string) => {
    if (!password || password.trim().length === 0) return false;
    const derivedDEK = await deriveKey(password, salt);
    const dekHash = generateHash(derivedDEK);
    return dekHash.localeCompare(hash) === 0;
  };

  // Function called when the user submits the dialog
  const handleDialogSubmit = async (password: string) => {
    if (await verifyMasterPassword(password)) {
      setMasterPassword(password);
      setDialogOpen(false);
      if (resolveCallbackRef.current) {
        resolveCallbackRef.current(password); // Resolve the promise
        resolveCallbackRef.current = null; // Clear the ref
      }
      rejectCallbackRef.current = null;
    } else {
      toast.error("Incorrect master password. Please try again.");
    }
  };

  // Function called when the dialog is canceled
  const handleDialogCancel = () => {
    setDialogOpen(false);
    if (rejectCallbackRef.current) {
      rejectCallbackRef.current(new Error("User canceled action")); // Reject the promise
      rejectCallbackRef.current = null; // Clear the ref
    }
    resolveCallbackRef.current = null; // Clear the resolve ref
  };

  // Function to clear the master password
  const clearMasterPassword = () => {
    setMasterPassword("");
  };

  return (
    <MasterPasswordContext.Provider value={{ getMasterPassword, saveMasterPassword, clearMasterPassword }}>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const { password } = e.target as EventTarget & { password: { value: string } };
              handleDialogSubmit(password.value);
            }}
            className="space-y-5"
          >
            <DialogHeader>
              <DialogTitle>Enter your master password</DialogTitle>
              <DialogDescription>Enter master password to encrypt and decrypt your sensitive data.</DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <Label htmlFor="password">Master Password</Label>
              <Input autoFocus name="password" id="password" type="password" placeholder="Enter master password" />
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={handleDialogCancel}>
                Cancel
              </Button>
              <Button>Submit</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {children}
    </MasterPasswordContext.Provider>
  );
};

// Custom hook to access the master password context
export const useMasterPassword = () => {
  const context = useContext(MasterPasswordContext);
  if (!context) {
    throw new Error("useMasterPassword must be used within a MasterPasswordProvider");
  }
  return context;
};
