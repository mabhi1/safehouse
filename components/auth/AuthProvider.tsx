"use client";
import { createContext, useContext, useState, Dispatch, useEffect } from "react";
import auth from "../../firebase/firebase";
import Login from "./Login";
import LoadingPage from "@/app/LoadingPage";
import { User } from "firebase/auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const AuthContext = createContext<User | null>(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingPage />;
  if (!currentUser) return <Login />;
  return (
    <AuthContext.Provider value={currentUser}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </AuthContext.Provider>
  );
};

export { AuthProvider };

export default function useAuth() {
  return useContext(AuthContext);
}
