import { useState } from "react";
import FormRenderer from "./components/FormRenderer";
import { appStyles } from "./styles/formStyles";
import FormBuilder from "./builder/FormBuilder";

export default function App() {

  const [activeView, setActiveView] = useState<"form" | "builder">("form");

  return (

    <div style={appStyles.container}>
      <div style={appStyles.card}>

        {/* Top Switch */}
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

        {/* CONTENT AREA (shared for both) */}
        <div style={appStyles.content}>
          {activeView === "form" ? (
            <FormRenderer />
          ) : (
            <FormBuilder />
          )}
        </div>

      </div>
    </div>
  );
}
