import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface LoadingContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  pageLoading: Record<string, boolean>;
  setPageLoading: (page: string, loading: boolean) => void;
  sectionLoading: Record<string, boolean>;
  setSectionLoading: (section: string, loading: boolean) => void;
  errorState: Record<string, string | null>;
  setErrorState: (key: string, error: string | null) => void;
  retryAction: Record<string, () => void>;
  registerRetry: (key: string, retryFn: () => void) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const SkeletonProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pageLoading, setPageLoadingState] = useState<Record<string, boolean>>({});
  const [sectionLoading, setSectionLoadingState] = useState<Record<string, boolean>>({});
  const [errorState, setErrorStateMap] = useState<Record<string, string | null>>({});
  const [retryActions, setRetryActions] = useState<Record<string, () => void>>({});

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  const setPageLoading = useCallback((page: string, loading: boolean) => {
    setPageLoadingState((prev) => ({ ...prev, [page]: loading }));
  }, []);

  const setSectionLoading = useCallback((section: string, loading: boolean) => {
    setSectionLoadingState((prev) => ({ ...prev, [section]: loading }));
  }, []);

  const setErrorState = useCallback((key: string, error: string | null) => {
    setErrorStateMap((prev) => ({ ...prev, [key]: error }));
  }, []);

  const registerRetry = useCallback((key: string, retryFn: () => void) => {
    setRetryActions((prev) => ({ ...prev, [key]: retryFn }));
  }, []);

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        setLoading,
        pageLoading,
        setPageLoading,
        sectionLoading,
        setSectionLoading,
        errorState,
        setErrorState,
        retryAction: retryActions,
        registerRetry,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a SkeletonProvider');
  }
  return context;
};

export const useSkeleton = (sectionKey: string) => {
  const { sectionLoading, setSectionLoading, errorState, setErrorState, retryAction } = useLoading();
  return {
    isLoading: !!sectionLoading[sectionKey],
    setLoading: (loading: boolean) => setSectionLoading(sectionKey, loading),
    error: errorState[sectionKey] || null,
    setError: (error: string | null) => setErrorState(sectionKey, error),
    retry: retryAction[sectionKey],
  };
};
