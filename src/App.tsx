import FormRenderer from "./components/FormRenderer";
import { appStyles } from "./styles/formStyles";

export default function App() {
  return (
    <div style={appStyles.app}>
      <div style={appStyles.card}>
        <h2 style={appStyles.title}>Dynamic Form Engine</h2>
        <FormRenderer />
      </div>
    </div>
  );
}