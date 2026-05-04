import { formStyles } from "../styles/formStyles";

const FieldRenderer = ({ field, register }: any) => {

  if (!field?.name) return null;

  const rules = {
    required: field.validation?.required
      ? `${field.label} is required`
      : false
  };


  switch (field.type) {
    case "text":
      return (
        <input
          {...register(field.name, rules)}
          style={formStyles.input}
        />
      );

    case "select":
      return (
        <select
          {...register(field.name, rules)}
          style={formStyles.input}
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