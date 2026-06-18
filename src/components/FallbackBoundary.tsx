import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class FallbackBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 text-red-500">
            <AlertCircle size={32} />
          </div>
          <h2 className="text-xl font-bold mb-2">Упс, что-то пошло не так</h2>
          <p className="text-gray-500 max-w-sm">
            Произошла критическая ошибка при отображении компонента. Пожалуйста, обновите страницу.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Обновить страницу
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
