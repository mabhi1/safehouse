import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function dateFormatter(date: Date) {
  const formatter = new Intl.DateTimeFormat("en-us", { dateStyle: "long" });
  return formatter.format(new Date(date));
}

export function amountFormatter(currency: string, amount: number) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  });
  return formatter.format(amount);
}

export function isMatching(text1: string, text2: string) {
  return text1.toLowerCase().includes(text2.toLowerCase());
}
