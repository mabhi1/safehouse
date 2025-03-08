"use client";

import { PasswordType } from "@/lib/db-types";
import PasswordCard from "./password-card";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { CreatePasswordForm } from "./create-password-form";
import { Badge } from "@/components/ui/badge";
import { FloatingDock } from "@/components/ui/floating-dock";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface PasswordsPageProps {
  passwords: PasswordType[];
  userId: string;
  searchText: string;
}

export default function PasswordsPage({ passwords, userId, searchText }: PasswordsPageProps) {
  const [searchTerm, setSearchTerm] = useState(searchText || "");
  const [activeLetter, setActiveLetter] = useState<string>("A");
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Create a memoized function to update URL
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }

      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    if (searchText) setSearchTerm(searchText);
  }, [searchText]);

  useEffect(() => {
    const queryString = createQueryString("search", searchTerm);
    router.push(`${pathname}?${queryString}`, { scroll: false });
  }, [searchTerm, router, pathname, createQueryString, searchText]);

  const filteredPasswords = useMemo(
    () =>
      searchTerm
        ? passwords.filter((password) => {
            let url;
            try {
              url = new URL(`https://${password.site}`);
            } catch (error) {
              url = { hostname: password.site };
            }
            const domain = url.hostname.split(".");
            const title = domain[0] === "www" ? domain[1] : domain[0];
            return (
              title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              password.username.toLowerCase().includes(searchTerm.toLowerCase())
            );
          })
        : passwords,
    [searchTerm, passwords]
  );

  filteredPasswords.sort((a, b) => a.site.localeCompare(b.site));

  const groupedPasswords = filteredPasswords.reduce((acc, entry) => {
    let url;
    try {
      url = new URL(`https://${entry.site}`);
    } catch (error) {
      url = { hostname: entry.site };
    }
    const domain = url.hostname.split(".");
    const title = domain[0] === "www" ? domain[1] : domain[0];
    const firstLetter = title[0].toUpperCase(); // Convert to uppercase for consistency
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(entry);
    return acc;
  }, {} as { [key: string]: PasswordType[] });

  const availableLetters = Object.keys(groupedPasswords);

  const handleScroll = useCallback(() => {
    if (!availableLetters) return;
    let currentLetter = "";
    for (const letter of availableLetters) {
      const element = document.getElementById(letter);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top >= 0 || rect.bottom >= window.innerHeight / 5) {
          currentLetter = letter;
          break;
        }
      }
    }

    setActiveLetter(currentLetter);
  }, [availableLetters]);

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div className="space-y-5 mb-20 relative">
      <div className="flex items-center gap-3 md:gap-5">
        <div className="flex items-center mr-auto gap-1">
          <span className="text-xl capitalize">Passwords</span>
          <Badge variant="secondary" className="font-normal">
            {filteredPasswords.length}
          </Badge>
        </div>
        <div>
          <Input
            placeholder="Search Passwords"
            className="h-9 w-36 md:w-56"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <CreatePasswordForm uid={userId!} />
      </div>

      {filteredPasswords.length === 0 ? (
        <div className="text-lg">No Saved Passwords</div>
      ) : (
        availableLetters.map((letter) => (
          <div key={letter} className="space-y-5 scroll-mt-28" id={letter}>
            <div className="flex items-center gap-5">
              <h2 className="text-muted-foreground/60">{letter}</h2>
              <div className="w-full h-[1px] bg-muted-foreground/20"></div>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
              {groupedPasswords[letter].map((password) => (
                <PasswordCard key={password.id} password={password} uid={userId!} searchTerm={searchTerm} />
              ))}
            </ul>
          </div>
        ))
      )}

      <div className="fixed bottom-5 right-5 md:left-1/2 md:bottom-20 transform md:-translate-x-1/2 md:w-full md:max-w-[60rem] md:overflow-x-auto no-scrollbar">
        <FloatingDock
          items={availableLetters.map((letter) => {
            return {
              title: letter,
              href: `#${letter}`,
            };
          })}
          activeLetter={activeLetter}
        />
      </div>
    </div>
  );
}
