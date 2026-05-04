import { useState } from "react";
import FormRenderer from "./components/FormRenderer";
import { appStyles } from "./styles/formStyles";
import FormBuilder from "./builder/FormBuilder";
import type { Field } from "./types/formTypes";

type View = "form" | "builder";

const App = () => {
  const [schema, setSchema] = useState<Field[]>([]);
  const [activeView, setActiveView] = useState<View>("form");

  return (
    <div style={appStyles.container}>
      <div style={appStyles.card}>
        <h2 style={{textAlign: "center"}}>Dynamic Form Engine</h2>
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
              schema={schema}
              setSchema={setSchema}
            />
          )}

          {activeView === "form" && (
            <FormRenderer
              externalSchema={schema}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;