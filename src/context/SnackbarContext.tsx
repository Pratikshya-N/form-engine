import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type SnackbarType = "success" | "error" | "info";

interface SnackbarState {
  open: boolean;
  message: string;
  type: SnackbarType;
}

interface SnackbarContextType {
  showMessage: (msg: string, type?: SnackbarType) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    type: "info",
  });

  const showMessage = (message: string, type: SnackbarType = "info") => {
    setSnackbar({ open: true, message, type });

    setTimeout(() => {
      setSnackbar({ open: false, message: "", type: "info" });
    }, 3000);
  };

  return (
    <SnackbarContext.Provider value={{ showMessage }}>
      {children}

      {snackbar.open && (
        <div style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          padding: "12px 16px",
          borderRadius: 6,
          color: "#fff",
          background:
            snackbar.type === "error"
              ? "#e74c3c"
              : snackbar.type === "success"
              ? "#2ecc71"
              : "#333",
        }}>
          {snackbar.message}
        </div>
      )}
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used inside SnackbarProvider");
  }
  return context;
};