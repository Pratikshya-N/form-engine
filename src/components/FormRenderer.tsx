import { useForm, useWatch } from 'react-hook-form';
import { formSchema } from '../schema/formSchema';
import FieldRenderer from './FieldRenderer';

const FormRenderer = () => {
  const { register, control, handleSubmit } = useForm();

  const values = useWatch({ control });

  const onSubmit = (data: any) => {
    console.log('Form Data:', data);
  };

  const shouldRender = (field: any) => {
    if (!field.conditional) return true;

    return values?.[field.conditional.field] === field.conditional.value;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {formSchema.map((field) =>
        shouldRender(field) ? (
          <div key={field.name}>
            <label>{field.label}</label>
            <FieldRenderer field={field} register={register} />
          </div>
        ) : null
      )}

      <button type="submit">Submit</button>
    </form>
  );
};

export default FormRenderer;