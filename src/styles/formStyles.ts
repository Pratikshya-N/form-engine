import type { CSSProperties } from "react";

export const appStyles: Record<string, CSSProperties> = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f3f4f6",
  },

  card: {
    width: 900,
    height: "90vh",
    maxHeight: "95vh",
    background: "#fff",
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },

  switchContainer: {
    display: "flex",
    borderBottom: "1px solid #eee",
  },

  switchButton: {
    flex: 1,
    padding: 10,
    border: "none",
    cursor: "pointer",
    background: "#f9fafb",
  },

  active: {
    background: "#4a6cf7",
    color: "#fff",
  },

  content: {
    flex: 1,
    minHeight: 0,
    display: "flex",
    flexDirection: "column",
    //  border: "2px solid red"
  }
};

export const formStyles: Record<string, CSSProperties> = {
  container: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  innerForm: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    minHeight: 0
  },
  formBody: {
    flex: 1,
    overflowY: "auto",
    padding: "0 16px 12px 16px",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    padding: "12px 16px",
    borderTop: "1px solid #eee",
    background: "#fff",
  },
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
    marginTop: 4,
    boxSizing: "border-box",
  },
  addBtn: {
    background: "#4a6cf7",
    color: "#fff",
    border: "none",
    padding: "10px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    marginBottom: "10px"
  },
  submitBtnDisabled: {
    backgroundColor: "#ccc",
    color: "#666",
    cursor: "not-allowed",
    border: "none",
    padding: "10px 16px",
    borderRadius: 6,
  }
};

export const builderStyles: Record<string, CSSProperties> = {

  panel: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },

  panelBody: {
    flex: 1,
    overflowY: "auto",
    padding: 16,
  },

  header: {
    padding: 12,
    borderBottom: "1px solid #eee",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    margin: 0,
  },

  addBtn: {
    background: "#4a6cf7",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: 6,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontWeight: 500
  },

  testBtn: {
    background: "#10b981",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: 6,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontWeight: 500
  },

  actions: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },

  iconBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    cursor: "pointer",
    background: "#fff"
  },

  exportBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 12px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    background: "#6b7280", // neutral grey
    color: "#fff",
    fontWeight: 500
  },

  closeIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    background: "#ef4444", // red
    color: "#fff"
  },

  emptyState: {
    textAlign: "center",
    color: "#888",
    marginTop: 40,
  },

  jsonBox: {
    borderTop: "1px solid #eee",
    padding: 12,
    background: "#fafafa",
  },

  jsonPreview: {
    fontSize: 12,
    maxHeight: 150,
    overflowY: "auto",
    background: "#111",
    color: "#0f0",
    padding: 10,
    borderRadius: 6,
  },
};

export const FieldEditorStyles: Record<string, CSSProperties> = {
  card: {
    border: "1px solid #ddd",
    borderRadius: 8,
    marginBottom: 10,
    overflow: "hidden",
  },

  cardHeader: {
    background: "#f5f5f5",
    padding: "10px 12px",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    fontWeight: 500,
  },

  cardBody: {
    padding: 12,
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
};