"use client";

import Spinner from "@/components/layout/spinner";
import { deriveKey, decryptAES } from "@/lib/crypto";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}

export default function DecryptNativePage() {
  const searchParams = useSearchParams();
  const password = searchParams.get("password");
  const salt = searchParams.get("salt");
  const text = searchParams.get("text");

  useEffect(() => {
    async function decrypt() {
      if (!password || !salt || !text) return "error";
      const key = await deriveKey(password, salt);
      return decryptAES(key, JSON.parse(text)).toString();
    }

    decrypt().then((decryptedText) => {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(decryptedText);
      }
    });
  }, [password, salt]);

  return (
    <div className="flex-1 flex justify-center items-center">
      <Spinner size="small" />
    </div>
  );
}
