"use client";
import { SetStateAction, createContext, useContext, useState, Dispatch } from "react";
import auth from "../firebase/firebase";
import Login from "./Login";

const AuthContext = createContext<Dispatch<SetStateAction<boolean>>>(() => {});

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  auth.onAuthStateChanged((user) => {
    if (user) setVerified(true);
    setLoading(false);
  });

  if (loading) return <div>Loading...</div>;
  if (!verified) return <Login setVerified={setVerified} />;
  return <AuthContext.Provider value={setVerified}>{children}</AuthContext.Provider>;
};

export { AuthProvider };

export default function useAuth() {
  return useContext(AuthContext);
}
