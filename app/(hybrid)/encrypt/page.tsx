"use client";

import Spinner from "@/components/layout/spinner";
import { deriveKey, encryptAES } from "@/lib/crypto";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}

export default function EncryptNativePage() {
  const searchParams = useSearchParams();
  const password = searchParams.get("password");
  const salt = searchParams.get("salt");
  const text = searchParams.get("text");

  useEffect(() => {
    async function encrypt() {
      if (!password || !salt || !text) return "error";
      const key = await deriveKey(password, salt);
      return JSON.stringify(encryptAES(key, Buffer.from(text)));
    }

    encrypt().then((encryptedText) => {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(encryptedText);
      }
    });
  }, [password, salt]);

  return (
    <div className="flex-1 flex justify-center items-center">
      <Spinner size="small" />
    </div>
  );
}
