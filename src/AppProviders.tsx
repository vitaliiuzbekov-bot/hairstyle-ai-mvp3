import React, { ReactNode } from "react";
import { UIProvider } from "./context/UIContext";
import { UserProvider } from "./context/UserContext";
import { AnalysisProvider } from "./context/AnalysisContext";

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <UIProvider>
      <UserProvider>
        <AnalysisProvider>
          {children}
        </AnalysisProvider>
      </UserProvider>
    </UIProvider>
  );
};
