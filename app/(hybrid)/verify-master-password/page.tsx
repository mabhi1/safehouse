"use client";

import Spinner from "@/components/layout/spinner";
import { deriveKey, generateHash } from "@/lib/crypto";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}

export default function CryptoNativePage() {
  const searchParams = useSearchParams();
  const password = searchParams.get("password");
  const salt = searchParams.get("salt");
  const hash = searchParams.get("hash");

  useEffect(() => {
    async function verifyMasterPassword() {
      if (!password || !salt || !hash) return "verification failed";
      const derivedDEK = await deriveKey(password, salt);
      const dekHash = generateHash(derivedDEK);
      return dekHash.localeCompare(hash) === 0 ? "verified" : "verification failed";
    }

    verifyMasterPassword().then((result) => {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(result);
      }
    });
  }, [password, salt, hash]);

  return (
    <div className="flex-1 flex justify-center items-center">
      <Spinner size="small" />
    </div>
  );
}
