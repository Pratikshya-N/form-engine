export const appStyles = {
  app: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f7fb"
  },
  card: {
    width: "420px",
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.1)"
  },
  title: {
    textAlign: "center" as const,
    marginBottom: "20px"
  }
};

export const formStyles = {
  label: {
    display: "block",
    marginBottom: 6,
    fontWeight: 500
  },
  error: {
    color: "#e74c3c",
    fontSize: 12,
    marginTop: 4
  },
  buttonContainer: {
    marginTop: 20,
    display: "flex",
    justifyContent: "space-between"
  },
  primaryBtn: {
    background: "#4a6cf7",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: 6,
    cursor: "pointer"
  },
  secondaryBtn: {
    background: "#ddd",
    border: "none",
    padding: "10px 16px",
    borderRadius: 6,
    cursor: "pointer"
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    marginTop: 4
  }
};