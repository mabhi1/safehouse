import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function dateFormatter(date: Date) {
  const dateFormatter = new Intl.DateTimeFormat("en-us", { dateStyle: "long" });
  return dateFormatter.format(new Date(date));
}

export type NotesSortValues = "lastUpdated" | "firstUpdated" | "titleAsc" | "titleDesc";
export type PasswordSortValues =
  | "lastUpdated"
  | "firstUpdated"
  | "siteAsc"
  | "siteDesc"
  | "usernameAsc"
  | "usernameDesc";
export type CardsSortValues = "lastUpdated" | "firstUpdated" | "bankAsc" | "bankDesc";

export function getSortKey(
  page: "notes" | "passwords" | "cards",
  sortValue: NotesSortValues | PasswordSortValues | CardsSortValues
) {
  switch (page) {
    case "notes":
      switch (sortValue) {
        case "lastUpdated":
          return { key: "updatedAt", type: "desc" };
        case "firstUpdated":
          return { key: "updatedAt", type: "asc" };
        case "titleAsc":
          return { key: "title", type: "asc" };
        case "titleDesc":
          return { key: "title", type: "desc" };
        default:
          return { key: "updatedAt", type: "desc" };
      }
    case "passwords":
      switch (sortValue) {
        case "lastUpdated":
          return { key: "updatedAt", type: "desc" };
        case "firstUpdated":
          return { key: "updatedAt", type: "asc" };
        case "siteAsc":
          return { key: "site", type: "asc" };
        case "siteDesc":
          return { key: "site", type: "desc" };
        case "usernameAsc":
          return { key: "username", type: "asc" };
        case "usernameDesc":
          return { key: "username", type: "desc" };
        default:
          return { key: "updatedAt", type: "desc" };
      }
    case "cards":
      switch (sortValue) {
        case "lastUpdated":
          return { key: "updatedAt", type: "desc" };
        case "firstUpdated":
          return { key: "updatedAt", type: "asc" };
        case "bankAsc":
          return { key: "bank", type: "asc" };
        case "bankDesc":
          return { key: "bank", type: "desc" };
        default:
          return { key: "updatedAt", type: "desc" };
      }
    default:
      return { key: "updatedAt", type: "desc" };
  }
}
