import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface UserContextType {
  userRole: "client" | "master" | "salon";
  setUserRole: (val: "client" | "master" | "salon") => void;
  salonName: string;
  setSalonName: (val: string) => void;
  userAvatar: string | null;
  setUserAvatar: (val: string | null) => void;
  consentGiven: boolean;
  setConsentGiven: (val: boolean) => void;
  consentError: boolean;
  setConsentError: (val: boolean) => void;

  userId: string | null;
  setUserId: (val: string | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userRole, setUserRole] = useState<"client" | "master" | "salon">("client");
  const [salonName, setSalonName] = useState("");
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [consentGiven, setConsentGiven] = useState(false);
  const [consentError, setConsentError] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const welcomeShown = localStorage.getItem("welcomeShown");
    if (welcomeShown) {
      const storedRole = localStorage.getItem("userRole") as "client" | "master" | "salon";
      if (storedRole) setUserRole(storedRole);
      const storedSalonName = localStorage.getItem("salonName");
      if (storedSalonName) setSalonName(storedSalonName);
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        userRole,
        setUserRole,
        salonName,
        setSalonName,
        userAvatar,
        setUserAvatar,
        consentGiven,
        setConsentGiven,
        consentError,
        setConsentError,
        userId,
        setUserId
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
