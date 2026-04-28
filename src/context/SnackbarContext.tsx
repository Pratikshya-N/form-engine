import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type SnackbarType = "success" | "error" | "info" | "warning";

interface SnackbarState {
  open: boolean;
  message: string;
  type: SnackbarType;
}

interface SnackbarContextProps {
  showMessage: (message: string, type?: SnackbarType) => void;
}

const SnackbarContext = createContext<SnackbarContextProps | null>(null);

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    type: "info"
  });

  const showMessage = (
    message: string,
    type: SnackbarType = "info"
  ) => {
    setSnackbar({
      open: true,
      message,
      type
    });

    setTimeout(() => {
      setSnackbar({
        open: false,
        message: "",
        type: "info"
      });
    }, 3000);
  };

  const getBackground = (type: SnackbarType) => {
    switch (type) {
      case "success":
        return "#2ecc71";
      case "error":
        return "#e74c3c";
      case "warning":
        return "#f39c12";
      default:
        return "#3498db";
    }
  };

  return (
    <SnackbarContext.Provider value={{ showMessage }}>
      {children}

      {snackbar.open && (
        <div
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            background: getBackground(snackbar.type),
            color: "#fff",
            padding: "12px 16px",
            borderRadius: 6,
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            minWidth: "220px",
            fontSize: "14px"
          }}
        >
          {snackbar.message}
        </div>
      )}
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);

  if (!context) {
    throw new Error("useSnackbar must be used within SnackbarProvider");
  }

  return context;
};