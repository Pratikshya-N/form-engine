import type { Field } from '../types/formTypes';

interface Props {
    field: Field;
    register: any;
}

const FieldRenderer = ({ field, register }: Props) => {
    switch (field.type) {
        case 'text':
            return <input {...register(field.name)} placeholder={field.label} />;

        case 'number':
            return <input type="number" {...register(field.name)} />;

        case 'select':
            return (
                <select {...register(field.name)}>
                    <option value="">Select</option>
                    {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            );

        default:
            return null;
    }
};

export default FieldRenderer;