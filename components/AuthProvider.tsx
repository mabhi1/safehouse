"use client";
import { SetStateAction, createContext, useContext, useState, Dispatch, useEffect } from "react";
import auth from "../firebase/firebase";
import Login from "./Login";
import LoadingPage from "@/app/LoadingPage";

const AuthContext = createContext<Dispatch<SetStateAction<boolean>>>(() => {});

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) setVerified(true);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingPage />;
  if (!verified) return <Login setVerified={setVerified} />;
  return <AuthContext.Provider value={setVerified}>{children}</AuthContext.Provider>;
};

export { AuthProvider };

export default function useAuth() {
  return useContext(AuthContext);
}
