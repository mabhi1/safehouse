"use client";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "../ui/input";
import { ChangeEvent, useEffect, useMemo, useState, useTransition } from "react";
import { searchNotes } from "@/actions/notes";
import { EventType, ExpenseType, FileType, NotesType, PasswordType } from "@/lib/db-types";
import MarkedText from "../ui/marked-text";
import { useRouter } from "next/navigation";
import { isMatching } from "@/lib/utils";
import { searchPasswords } from "@/actions/passwords";
import { useAuth } from "@clerk/nextjs";
import { searchEvents } from "@/actions/events";
import { searchExpenses } from "@/actions/expenses";
import { searchDocuments } from "@/actions/documents";
import { Search } from "lucide-react";
import Spinner from "./spinner";
import debounce from "lodash/debounce";
import { useSearch } from "../providers/search-provider";
import { Separator } from "../ui/separator";

const defaultStorageValue = {
  notes: [] as NotesType[],
  events: [] as EventType[],
  passwords: [] as PasswordType[],
  expenses: [] as ExpenseType[],
  documents: [] as FileType[],
};

export default function SearchButton() {
  const { userId } = useAuth();
  const { isSearchOpen } = useSearch();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [cache, setCache] = useState(defaultStorageValue);
  const [isPending, startTransition] = useTransition();
  const [results, setResults] = useState(defaultStorageValue);
  const [storageSelect, setStorageSelect] = useState("all");
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        setDialogOpen(true);
      } else return true;
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    setDialogOpen(isSearchOpen);
  }, [isSearchOpen]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setSearchText(text);
    debouncedSearch(text);
  };

  const handleSearch = async (text: string) => {
    if (text.trim().length < 3) {
      setResults({ notes: [], events: [], passwords: [], expenses: [], documents: [] });
      return;
    }

    startTransition(async () => {
      const newResults = {
        ...cache,
      };

      const notCached = (key: keyof typeof results) =>
        ["all", key].includes(storageSelect) && (text !== searchText || !newResults[key].length);

      if (notCached("notes")) {
        const notesData = await searchNotes(text, userId!);
        if (notesData.data) newResults.notes = notesData.data;
      }

      if (notCached("events")) {
        const eventsData = await searchEvents(text, userId!);
        if (eventsData.data) newResults.events = eventsData.data;
      }

      if (notCached("passwords")) {
        const passwordsData = await searchPasswords(text, userId!);
        if (passwordsData.data) newResults.passwords = passwordsData.data;
      }

      if (notCached("expenses")) {
        const expensesData = await searchExpenses(text, userId!);
        if (expensesData.data) newResults.expenses = expensesData.data;
      }

      if (notCached("documents")) {
        const documentsData = await searchDocuments(text, userId!);
        if (documentsData.data) newResults.documents = documentsData.data;
      }

      setResults(newResults);
      setCache(newResults);
    });
  };

  const debouncedSearch = useMemo(
    () =>
      debounce((text: string) => {
        handleSearch(text);
      }, 300),
    [storageSelect]
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  useEffect(() => {
    if (searchText.trim().length >= 3) {
      handleSearch(searchText);
    }
  }, [storageSelect]);

  const handleRoute = (route: string) => {
    router.push(route);
  };

  return (
    <Dialog onOpenChange={setDialogOpen} open={dialogOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="flex-1 w-48 lg:w-80 text-muted-foreground cursor-pointer">
          <div className="w-full flex justify-between">
            <span>Search</span>
            <span>&#8984;K</span>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="p-4 md:max-w-[40rem]">
        <DialogHeader>
          <DialogTitle className="m-2 font-light uppercase">Search Site</DialogTitle>
          <DialogDescription className="hidden">Type at least 3 letters to search...</DialogDescription>
          <div className="flex gap-2 relative">
            <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 left-2" />
            <Input
              placeholder="Type at least 3 letters to search..."
              className="pl-7 pr-[9.5rem]"
              value={searchText}
              onChange={handleChange}
            />
            <Select defaultValue="all" value={storageSelect} onValueChange={setStorageSelect}>
              <SelectTrigger className="w-36 absolute top-1/2 -translate-y-1/2 right-1 border-x-0 rounded-none focus:rounded">
                <SelectValue placeholder="Sort Notes" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Storage</SelectLabel>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="notes">Notes</SelectItem>
                  <SelectItem value="passwords">Passwords</SelectItem>
                  <SelectItem value="events">Events</SelectItem>
                  <SelectItem value="expenses">Expenses</SelectItem>
                  <SelectItem value="documents">Documents</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </DialogHeader>
        {isPending ? (
          <div className="h-96 overflow-y-auto">
            <Spinner size="small" />
          </div>
        ) : (
          <div className="h-96 overflow-y-auto px-1">
            {searchText.length >= 3 ? (
              <div className="space-y-2">
                {["all", "notes"].includes(storageSelect) && (
                  <div>
                    {results.notes.length ? (
                      <div>
                        <DialogDescription className="pl-4 py-2">Notes</DialogDescription>
                        {results.notes.map((note) => (
                          <DialogClose key={note.id} asChild>
                            <Button
                              variant="ghost"
                              className="w-full font-normal justify-start h-fit"
                              onClick={() => handleRoute(`/notes?search=${searchText}`)}
                            >
                              <MarkedText
                                searchTerm={searchText}
                                text={isMatching(note.title, searchText) ? note.title : note.description}
                              />
                            </Button>
                          </DialogClose>
                        ))}
                      </div>
                    ) : (
                      <DialogDescription className="pl-4 pb-2">Notes not found</DialogDescription>
                    )}
                  </div>
                )}
                <Separator />
                {["all", "events"].includes(storageSelect) && (
                  <div>
                    {results.events.length ? (
                      <div>
                        <DialogDescription className="pl-4 py-2">Events</DialogDescription>
                        {results.events.map((event) => (
                          <DialogClose key={event.id} asChild>
                            <Button
                              variant="ghost"
                              className="w-full font-normal justify-start h-fit"
                              onClick={() =>
                                handleRoute(
                                  `/events?month=${event.date.getMonth()}&date=${event.date.getDate()}&year=${event.date.getFullYear()}&search=${searchText}`
                                )
                              }
                            >
                              <MarkedText
                                searchTerm={searchText}
                                text={isMatching(event.title, searchText) ? event.title : event.description}
                              />
                            </Button>
                          </DialogClose>
                        ))}
                      </div>
                    ) : (
                      <DialogDescription className="pl-4 pb-2">Events not found</DialogDescription>
                    )}
                  </div>
                )}
                <Separator />
                {["all", "passwords"].includes(storageSelect) && (
                  <div>
                    {results.passwords.length ? (
                      <div>
                        <DialogDescription className="pl-4 py-2">Passwords</DialogDescription>
                        {results.passwords.map((password) => (
                          <DialogClose key={password.id} asChild>
                            <Button
                              variant="ghost"
                              className="w-full font-normal justify-start h-fit"
                              onClick={() => handleRoute(`/passwords?search=${searchText}`)}
                            >
                              <MarkedText searchTerm={searchText} text={password.site} />
                              <div className="text-xs ml-2">
                                <MarkedText searchTerm={searchText} text={password.username} />
                              </div>
                            </Button>
                          </DialogClose>
                        ))}
                      </div>
                    ) : (
                      <DialogDescription className="pl-4 pb-2">Passwords not found</DialogDescription>
                    )}
                  </div>
                )}
                <Separator />
                {["all", "expenses"].includes(storageSelect) && (
                  <div>
                    {results.expenses.length ? (
                      <div>
                        <DialogDescription className="pl-4 py-2">Expenses</DialogDescription>
                        {results.expenses.map((expense) => (
                          <DialogClose key={expense.id} asChild>
                            <Button
                              variant="ghost"
                              className="w-full font-normal justify-start h-fit"
                              onClick={() => handleRoute(`/expenses/expense-list?search=${searchText}`)}
                            >
                              <MarkedText searchTerm={searchText} text={expense.title} />
                              <div className="text-xs ml-2">
                                <MarkedText searchTerm={searchText} text={expense.description || "No Description"} />
                              </div>
                            </Button>
                          </DialogClose>
                        ))}
                      </div>
                    ) : (
                      <DialogDescription className="pl-4 pb-2">Expenses not found</DialogDescription>
                    )}
                  </div>
                )}
                <Separator />
                {["all", "documents"].includes(storageSelect) && (
                  <div>
                    {results.documents.length ? (
                      <div>
                        <DialogDescription className="pl-4 py-2">Documents</DialogDescription>
                        {results.documents.map((document) => (
                          <DialogClose key={document.id} asChild>
                            <Button
                              variant="ghost"
                              className="w-full font-normal justify-start h-fit"
                              onClick={() => handleRoute(`/documents?search=${searchText}`)}
                            >
                              <MarkedText searchTerm={searchText} text={document.name} />
                            </Button>
                          </DialogClose>
                        ))}
                      </div>
                    ) : (
                      <DialogDescription className="pl-4 pb-2">Documents not found</DialogDescription>
                    )}
                  </div>
                )}
              </div>
            ) : !searchText.length ? (
              <div className="p-4">
                <div className="text-muted-foreground text-center text-sm">Start typing to search...</div>
              </div>
            ) : (
              <div className="p-4">
                <div className="text-muted-foreground text-center text-sm">Type at least 3 letters to search...</div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
