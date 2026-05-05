import { useState, useEffect } from "react";
import FormRenderer from "./components/FormRenderer";
import { appStyles } from "./styles/formStyles";
import FormBuilder from "./builder/FormBuilder";
import type { Field } from "./types/formTypes";
import { getFormSchema } from "./api/getFormSchema";

type View = "form" | "builder";

const App = () => {
  const [baseSchema, setBaseSchema] = useState<Field[]>([]);
  const [draftSchema, setDraftSchema] = useState<Field[]>([]);
  const [activeSchema, setActiveSchema] = useState<Field[]>([]);
  const [activeView, setActiveView] = useState<View>("form");

  useEffect(() => {
    getFormSchema().then((data) => {
      setBaseSchema(data);
      setActiveSchema(data); // default form uses original
    });
  }, []);

  return (
    <div style={appStyles.container}>
      <div style={appStyles.card}>
        <h2 style={{ textAlign: "center", margin: "12px 0" }}>Dynamic Form Engine</h2>
        {/* SWITCH BUTTONS */}
        <div style={appStyles.switchContainer}>
          <button
            style={{
              ...appStyles.switchButton,
              ...(activeView === "form" ? appStyles.active : {})
            }}
            onClick={() => setActiveView("form")}
          >
            Form
          </button>

          <button
            style={{
              ...appStyles.switchButton,
              ...(activeView === "builder" ? appStyles.active : {})
            }}
            onClick={() => setActiveView("builder")}
          >
            Builder
          </button>
        </div>

        {/* VIEWS */}
        <div style={appStyles.content}>
          {activeView === "builder" && (
            <FormBuilder
              schema={draftSchema}
              setSchema={setDraftSchema}
              onSave={(newFields) => {
                const merged = [
                  ...baseSchema,
                  ...newFields.filter(
                    (nf) => !baseSchema.some((bf) => bf.name === nf.name)
                  )
                ];
                setActiveSchema(merged);
                setDraftSchema([]); // reset builder after save
              }}
            />
          )}

          {activeView === "form" && (
            <FormRenderer
              externalSchema={activeSchema}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;