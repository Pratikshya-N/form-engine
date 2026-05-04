import { useState } from "react";
import FieldEditor from "./FieldEditor";
import type { Field } from "../types/formTypes";
import { builderStyles } from "../styles/formStyles";
import { useSnackbar } from "../context/SnackbarContext";
import FormRenderer from "../components/FormRenderer";


const FormBuilder = () => {
  const [fields, setFields] = useState<Field[]>([]);
  const [showTest, setShowTest] = useState(false);

  const { showMessage } = useSnackbar();

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

  const updateField = (index: number, updated: any) => {
    const newFields = [...fields];
    newFields[index] = updated;
    setFields(newFields);
  };

  const deleteField = (index: number) => {
    const newFields = fields.filter((_, i) => i !== index);
    setFields(newFields);
  };

  const handleTest = () => {
    const validFields = fields.filter(
      (f) => f.name && f.label
    );

    if (!validFields.length) {
      showMessage("Add at least one valid field", "error");
      return;
    }

    setShowTest(true);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(fields, null, 2);

    const blob = new Blob([dataStr], { type: "application/json" });
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

        // basic validation
        if (!Array.isArray(parsed)) {
          throw new Error("Invalid schema format");
        }

        setFields(parsed);
      } catch (err) {
        showMessage("Invalid JSON file", "error");
      }
    };

    reader.readAsText(file);
  };

  return (
    <div style={builderStyles.panel}>
      <div style={builderStyles.header}>
        <h3 style={builderStyles.title}>Form Builder</h3>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={addField} style={builderStyles.addBtn}>
            + Add Field
          </button>

          <button onClick={handleTest} style={builderStyles.testBtn}>
            Test Form
          </button>

          {showTest && (
            <div style={{ marginTop: 20 }}>
              <h3>Test Form</h3>

              <FormRenderer externalSchema={fields} />

              <button onClick={() => setShowTest(false)}>
                Close Test
              </button>
            </div>
          )}

          <button onClick={handleExport}>
            Export JSON
          </button>

          <input type="file" accept="application/json" onChange={handleImport} />
        </div>
      </div>

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
              onChange={(updated: any) => updateField(i, updated)}
              onDelete={() => deleteField(i)}
            />
          ))
        )}
      </div>

      {/* JSON Preview */}
      <div style={builderStyles.jsonBox}>
        <h4>Schema JSON</h4>
        <pre style={builderStyles.jsonPreview}>
          {JSON.stringify(fields, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default FormBuilder;