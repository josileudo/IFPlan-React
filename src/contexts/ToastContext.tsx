import React, { createContext, useContext, useState, useCallback } from "react";

export type ToastType = "success" | "alert" | "info" | "error";

interface ToastContextData {
  showToast: (message: string, type?: ToastType) => void;
  hideToast: () => void;
  toast: {
    message: string;
    type: ToastType;
    visible: boolean;
  };
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
    visible: boolean;
  }>({
    message: "",
    type: "info",
    visible: false,
  });

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "info") => {
      setToast({
        message,
        type,
        visible: true,
      });

      setTimeout(() => {
        hideToast();
      }, 3000);
    },
    [hideToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, hideToast, toast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
