import { useState } from "react";
import type { Field } from "../types/formTypes";
import { FieldEditorStyles } from "../styles/formStyles";

type Option = {
  label: string;
  value: string;
};

interface Props {
  field: Field;
  allFields: Field[];
  onChange: (field: Field) => void;
  onDelete: () => void;
}

const FieldEditor = ({ field, allFields, onChange, onDelete }: Props) => {

  const [open, setOpen] = useState(true);

  const getFieldByName = (name: string) => {
    return allFields.find((f) => f.name === name);
  };

  const updateConditional = (key: string, value: any) => {
    onChange({
      ...field,
      conditional: {
        field: field.conditional?.field || "",
        value: field.conditional?.value || "",
        [key]: value
      }
    });
  };

  const updateFieldValue = (key: keyof Field, value: any) => {
    onChange({
      ...field,
      [key]: value
    });
  };

  const addOption = () => {
    const updatedOptions: Option[] = [
      ...(field.options || []),
      { label: "", value: "" }
    ];

    onChange({ ...field, options: updatedOptions });
  };

  const updateOption = (index: number, key: keyof Option, value: string) => {
    const updatedOptions = [...(field.options || [])];

    updatedOptions[index][key] = value;

    // auto-fill value when label changes
    if (key === "label") {
      updatedOptions[index].value = value
        .toLowerCase()
        .replace(/\s+/g, "_");
    }

    onChange({ ...field, options: updatedOptions });
  };

  const deleteOption = (index: number) => {
    const updatedOptions: Option[] = (field.options || []).filter(
      (_, i) => i !== index
    );

    onChange({ ...field, options: updatedOptions });
  };

  return (
    <div style={FieldEditorStyles.card}>
      {/* Header (always visible) */}
      <div style={FieldEditorStyles.cardHeader} onClick={() => setOpen(!open)}>
        <span>
          {field.label || field.name || "New Field"}
        </span>

        <span>{open ? "▲" : "▼"}</span>
      </div>

      {/* Collapsible content */}
      {open && (
        <div style={FieldEditorStyles.cardBody}>
          <input
            placeholder="Field Name"
            value={field.name || ""}
            onChange={(e) => updateFieldValue("name", e.target.value)}
          />

          <input
            placeholder="Label"
            value={field.label || ""}
            onChange={(e) => updateFieldValue("label", e.target.value)}
          />

          <select
            value={field.type || "text"}
            onChange={(e) => updateFieldValue("type", e.target.value)}
          >
            <option value="text">Text</option>
            <option value="select">Select</option>
          </select>

          {field.type === "select" && (
            <div style={{ marginTop: 10 }}>
              <p style={{ fontWeight: 500 }}>Options</p>

              {(field.options || []).map((opt, i) => (
                <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                  <input
                    placeholder="Label"
                    value={opt.label || ""}
                    onChange={(e) =>
                      updateOption(i, "label", e.target.value)
                    }
                  />

                  <input
                    placeholder="Value"
                    value={opt.value || ""}
                    onChange={(e) =>
                      updateOption(i, "value", e.target.value)
                    }
                  />

                  <button onClick={() => deleteOption(i)}>X</button>
                </div>
              ))}

              <button onClick={addOption}>+ Add Option</button>
            </div>
          )}

          <input
            type="number"
            value={field.step || ""}
            onChange={(e) => updateFieldValue("step", Number(e.target.value))}
          />

          <label>
            Required
            <input
              type="checkbox"
              checked={field.validation?.required || false}
              onChange={(e) => updateFieldValue("validation", { required: e.target.checked })}
            />
          </label>

          {/* CONDITIONAL CONFIG */}
          <div style={{ marginTop: 12 }}>
            <label>
              Conditional Field
              <input
                type="checkbox"
                checked={!!field.conditional}
                onChange={(e) => {
                  if (e.target.checked) {
                    onChange({
                      ...field,
                      conditional: { field: "", value: "" }
                    });
                  } else {
                    const updated = { ...field };
                    delete updated.conditional;
                    onChange(updated);
                  }
                }}
              />
            </label>
          </div>

          {field.conditional && (
            <div style={{ marginTop: 10 }}>
              {/* SELECT CONTROLLING FIELD */}
              <select
                value={field.conditional.field || ""}
                onChange={(e) => {
                  const newField = e.target.value;
                  onChange({
                    ...field,
                    conditional: {
                      field: newField,
                      value: "" // reset safely
                    }
                  });
                }}
              >
                <option value="">Select Field</option>

                {allFields
                  .filter((f) => f.name && f.name !== field.name)
                  .map((f) => (
                    <option key={f.name} value={f.name}>
                      {f.label || f.name}
                    </option>
                  ))}
              </select>

              {/* VALUE INPUT / DROPDOWN */}
              {(() => {
                const controllingField = getFieldByName(field.conditional.field);

                // CASE 1: controlling field is SELECT → show dropdown
                if (controllingField?.type === "select") {
                  return (
                    <select
                      value={field.conditional.value || ""}
                      onChange={(e) =>
                        updateConditional("value", e.target.value)
                      }
                      style={{ marginLeft: 10 }}
                    >
                      <option value="">Select Value</option>

                      {(controllingField.options || []).map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  );
                }

                // CASE 2: controlling field is TEXT → show input
                return (
                  <input
                    placeholder="Enter exact match value"
                    value={field.conditional.value || ""}
                    onChange={(e) =>
                      updateConditional("value", e.target.value)
                    }
                    style={{ marginLeft: 10 }}
                  />
                );
              })()}
            </div>
          )}

          <button onClick={onDelete}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default FieldEditor;