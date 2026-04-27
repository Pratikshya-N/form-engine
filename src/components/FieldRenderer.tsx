const FieldRenderer = ({ field, register }: any) => {
  switch (field.type) {
    case "text":
      return <input {...register(field.name)} />;

    case "select":
      return (
        <select {...register(field.name)}>
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