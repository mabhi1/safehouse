"use client";

import { useAuth } from "@clerk/nextjs";
import { createContext, useContext, useEffect, useState } from "react";
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
import { usePathname, useRouter } from "next/navigation";

const MasterPasswordContext = createContext<{
  masterPassword: string;
  salt: string;
  hash: string;
  saveMasterPassword: (password: string) => void;
  openPasswordDialog: () => boolean;
  clearMasterPassword: () => void;
} | null>(null);

interface MasterPasswordProviderProps {
  children: React.ReactNode;
  salt: string;
  hash: string;
}

const protectedRoutes = ["/passwords"];

export const MasterPasswordProvider = ({ children, salt, hash }: MasterPasswordProviderProps) => {
  const [masterPassword, setMasterPassword] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { userId } = useAuth();

  useEffect(() => {
    if (protectedRoutes.includes(pathname) && salt && hash && !masterPassword) {
      setDialogOpen(true);
    }
  }, [pathname, userId, masterPassword, salt, hash]);

  useEffect(() => {
    if (!userId) setMasterPassword("");
  }, [userId]);

  // Function to set the master password
  const saveMasterPassword = (password: string) => {
    setMasterPassword(password);
  };

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
    } else {
      toast.error("Incorrect master password. Please try again.");
    }
  };

  // Function called when the dialog is canceled
  const handleDialogCancel = () => {
    router.back();
    setDialogOpen(false);
  };

  // Function to clear the master password
  const clearMasterPassword = () => {
    setMasterPassword("");
  };

  // Function to open the password dialog
  const openPasswordDialog = () => {
    if (!masterPassword || !masterPassword.length) {
      setDialogOpen(true);
      return true;
    } else return false;
  };

  return (
    <MasterPasswordContext.Provider
      value={{ masterPassword, salt, hash, saveMasterPassword, clearMasterPassword, openPasswordDialog }}
    >
      <Dialog
        open={dialogOpen}
        onOpenChange={(state) => {
          if (state === false && masterPassword.length === 0) setDialogOpen(true);
          else setDialogOpen(state);
        }}
      >
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
