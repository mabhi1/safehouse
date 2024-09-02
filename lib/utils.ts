import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type NotesSortValues = "lastUpdated" | "firstUpdated" | "titleAsc" | "titleDesc";

export type PasswordSortValues =
  | "lastUpdated"
  | "firstUpdated"
  | "siteAsc"
  | "siteDesc"
  | "usernameAsc"
  | "usernameDesc";
export function getSortKey(page: "notes" | "passwords", sortValue: NotesSortValues | PasswordSortValues) {
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
    default:
      return { key: "updatedAt", type: "desc" };
  }
}
