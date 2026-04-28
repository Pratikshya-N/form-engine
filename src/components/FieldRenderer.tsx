const FieldRenderer = ({ field, register }: any) => {
  const rules = {
    required: field.validation?.required
      ? `${field.label} is required`
      : false
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    marginTop: 4
  };

  switch (field.type) {
    case "text":
      return (
        <input
          {...register(field.name, rules)}
          style={inputStyle}
        />
      );

    case "select":
      return (
        <select
          {...register(field.name, rules)}
          style={inputStyle}
        >
          <option value="">Select</option>
          {field.options?.map((o: any) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );

    default:
      return null;
  }
};

export default FieldRenderer;