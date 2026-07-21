import React, { createContext, useContext, useState, ReactNode } from "react";
import { AnalysisResult } from "../types";

interface AnalysisContextType {
  imageBase64: string | null;
  setImageBase64: (val: string | null) => void;
  imageFile: File | null;
  setImageFile: (val: File | null) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (val: boolean) => void;
  results: AnalysisResult | null;
  setResults: (val: AnalysisResult | null) => void;
  preferredStyle: string;
  setPreferredStyle: (val: string) => void;
  tryOnStyle: any | null;
  setTryOnStyle: (val: any | null) => void;
  
  // Try on parameters
  isVtonGenerating: boolean;
  setIsVtonGenerating: (val: boolean) => void;
  vtonResultUrl: string | null;
  setVtonResultUrl: (val: string | null) => void;
  vtonError: string | null;
  setVtonError: (val: string | null) => void;

  arGeneratedImageUrl: Record<string, string>;
  setArGeneratedImageUrl: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  isArGenerating: Record<string, boolean>;
  setIsArGenerating: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  arError: Record<string, string | null>;
  setArError: React.Dispatch<React.SetStateAction<Record<string, string | null>>>;

  resetAnalysis: () => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export const AnalysisProvider = ({ children }: { children: ReactNode }) => {
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [preferredStyle, setPreferredStyle] = useState<string>("Любой");
  const [tryOnStyle, setTryOnStyle] = useState<any | null>(null);

  const [isVtonGenerating, setIsVtonGenerating] = useState(false);
  const [vtonResultUrl, setVtonResultUrl] = useState<string | null>(null);
  const [vtonError, setVtonError] = useState<string | null>(null);

  const [arGeneratedImageUrl, setArGeneratedImageUrl] = useState<Record<string, string>>({});
  const [isArGenerating, setIsArGenerating] = useState<Record<string, boolean>>({});
  const [arError, setArError] = useState<Record<string, string | null>>({});

  const resetAnalysis = () => {
    setImageBase64(null);
    setImageFile(null);
    setResults(null);
    setPreferredStyle("Любой");
    setTryOnStyle(null);
    setVtonResultUrl(null);
    setVtonError(null);
    setArGeneratedImageUrl({});
    setArError({});
  };

  return (
    <AnalysisContext.Provider
      value={{
        imageBase64, setImageBase64,
        imageFile, setImageFile,
        isAnalyzing, setIsAnalyzing,
        results, setResults,
        preferredStyle, setPreferredStyle,
        tryOnStyle, setTryOnStyle,
        
        isVtonGenerating, setIsVtonGenerating,
        vtonResultUrl, setVtonResultUrl,
        vtonError, setVtonError,

        arGeneratedImageUrl, setArGeneratedImageUrl,
        isArGenerating, setIsArGenerating,
        arError, setArError,

        resetAnalysis
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysisContext = () => {
  const context = useContext(AnalysisContext);
  if (!context) throw new Error("useAnalysisContext must be used within an AnalysisProvider");
  return context;
};
