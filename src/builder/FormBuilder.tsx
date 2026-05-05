import { useState, useEffect } from "react";
import FieldEditor from "./FieldEditor";
import type { Field } from "../types/formTypes";
import { builderStyles } from "../styles/formStyles";
import { useSnackbar } from "../context/SnackbarContext";
import FormRenderer from "../components/FormRenderer";
import { Upload, Download, Plus, Play, X } from "lucide-react";

type Mode = "edit" | "test";

interface Props {
  schema: Field[];
  setSchema: (data: Field[]) => void;
  onSave: (data: Field[]) => void;
}

const FormBuilder = ({ schema, setSchema, onSave }: Props) => {
  const [fields, setFields] = useState<Field[]>(schema || []);
  const [mode, setMode] = useState<Mode>("edit");

  const { showMessage } = useSnackbar();

  useEffect(() => {
    setFields(schema);
  }, [schema]);

  useEffect(() => {
    setSchema(fields);
  }, [fields]);

  const addField = () => {
    setFields((prev) => [
      ...prev,
      {
        name: "",
        label: "",
        type: "text",
        step: 1,
        options: [],
        validation: { required: false },
        conditional: undefined
      }
    ]);
  };

  const updateField = (index: number, updated: Field) => {
    const newFields = [...fields];
    newFields[index] = updated;
    setFields(newFields);
  };

  const deleteField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleTest = () => {
    const validFields = fields.filter(f => f.name && f.label);

    if (!validFields.length) {
      showMessage("Add at least one valid field", "error");
      return;
    }

    setMode("test");
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(fields, null, 2)], {
      type: "application/json"
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "form-schema.json";
    a.click();

    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);

        if (!Array.isArray(parsed)) {
          throw new Error("Invalid schema");
        }

        // Merge without duplicates (by name)
        const merged = [...fields];

        parsed.forEach((newField) => {
          const exists = merged.some(
            (f) => f.name === newField.name
          );

          if (!exists) {
            merged.push(newField);
          }
        });

        setFields(merged);
        showMessage("Schema merged successfully", "success");

      } catch {
        showMessage("Invalid JSON file", "error");
      }
    };

    reader.readAsText(file);
  };

  const handleSave = () => {
    const validFields = fields.filter((f) => f.name && f.label);

    if (!validFields.length) {
      showMessage("Add valid fields before saving", "error");
      return;
    }

    onSave(validFields); // send to App

    showMessage("Fields saved to form", "success");

    setFields([]);      // reset builder
    setMode("edit");    // go back
  };

  return (
    <div style={{ ...builderStyles.panel, width: "100%" }}>

      {/* HEADER */}
      <div style={builderStyles.header}>
        <h3 style={builderStyles.title}>Form Builder</h3>

        <div style={builderStyles.actions}>

          {/* Import Icon */}
          <label style={builderStyles.iconBtn}>
            <Upload size={18} />
            <input
              type="file"
              accept="application/json"
              onChange={handleImport}
              style={{ display: "none" }}
            />
          </label>

          {/* Export Button */}
          <button
            onClick={handleExport}
            style={builderStyles.exportBtn}
          >
            <Download size={16} />
            Export JSON
          </button>

          {/* Add Field */}
          <button
            onClick={addField}
            style={builderStyles.addBtn}
          >
            <Plus size={14} />
            Add Field
          </button>

          {/* Test Form */}
          <button
            onClick={handleTest}
            style={builderStyles.testBtn}
          >
            <Play size={14} />
            Test Form
          </button>

          {/* Close Icon (only in test mode) */}
          {mode === "test" && (
            <>
              <button onClick={handleSave} style={builderStyles.addBtn}>
                Save Form
              </button>

              <button
                onClick={() => setMode("edit")}
                style={builderStyles.closeIcon}
              >
                <X size={18} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* BODY SWITCH */}
      {mode === "edit" ? (
        <>
          <div style={builderStyles.panelBody}>
            {fields.length === 0 ? (
              <div style={builderStyles.emptyState}>
                No fields added
              </div>
            ) : (
              fields.map((field, i) => (
                <FieldEditor
                  key={i}
                  field={field}
                  allFields={fields}
                  onChange={(updated) => updateField(i, updated)}
                  onDelete={() => deleteField(i)}
                />
              ))
            )}
          </div>

          <div style={builderStyles.jsonBox}>
            <h4>Schema JSON</h4>
            <pre style={builderStyles.jsonPreview}>
              {JSON.stringify(fields, null, 2)}
            </pre>
          </div>
        </>
      ) : (
        <div style={builderStyles.testContainer}>
          <FormRenderer externalSchema={fields} isTestMode={true} />
        </div>
      )}
    </div>
  );
};

export default FormBuilder;