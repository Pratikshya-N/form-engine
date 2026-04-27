import { createContext, useContext, useState } from "react";
import type { ReactNode as RN } from "react";

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

export const SnackbarProvider = ({ children }: { children: RN }) => {
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    type: "info"
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
        <div
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            padding: "10px 14px",
            background:
              snackbar.type === "error"
                ? "red"
                : snackbar.type === "success"
                  ? "green"
                  : "#333",
            color: "#fff",
            borderRadius: 6
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
  if (!context) throw new Error("useSnackbar must be used inside provider");
  return context;
};