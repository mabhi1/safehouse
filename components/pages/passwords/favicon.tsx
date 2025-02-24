"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface FaviconProps {
  websiteUrl: string;
}

export default function Favicon({ websiteUrl }: FaviconProps) {
  const [faviconUrl, setFaviconUrl] = useState("");

  useEffect(() => {
    if (!websiteUrl) return;

    try {
      const url = new URL(`https://${websiteUrl}`);
      const domain = url.hostname;

      // Google Favicon API
      setFaviconUrl(`https://www.google.com/s2/favicons?sz=64&domain=${domain}`);
    } catch (error) {
      console.error("Invalid URL:", websiteUrl);
    }
  }, [websiteUrl]);

  return (
    <div className="flex items-center gap-2">
      {faviconUrl ? (
        <Image
          src={faviconUrl}
          alt="Favicon"
          width={24}
          height={24}
          className="rounded"
          onError={() => setFaviconUrl("")}
        />
      ) : (
        <Image src="/favicon.png" alt="Favicon" width={24} height={24} className="rounded" />
      )}
    </div>
  );
}
