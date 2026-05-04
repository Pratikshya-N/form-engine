import FormRenderer from "../components/FormRenderer";

const BuilderPreview = ({ schema }: any) => {
  if (!schema.length) return <p>No fields added</p>;

  const validSchema = schema.filter(
    (f: any) => f.name && f.label
  );

  if (!validSchema.length) {
    return <p style={{ color: "#888" }}>Configure fields to preview</p>;
  }

  return (
    <div>
      <h3>Live Preview</h3>
      <FormRenderer externalSchema={validSchema} />
    </div>
  );
};

export default BuilderPreview;