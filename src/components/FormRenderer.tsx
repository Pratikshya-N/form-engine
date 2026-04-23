import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema } from '../schema/formSchema';
import FieldRenderer from './FieldRenderer';
import { buildValidationSchema } from '../utils/validation';

const validationSchema = buildValidationSchema(formSchema);

const FormRenderer = () => {
    const {
        register,
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(validationSchema)
    });

    const [step, setStep] = useState(1);

    const values = useWatch({ control });

    const onSubmit = (data: any) => {
        console.log('Form Data:', data);
    };

    const currentFields = formSchema.filter((field) => field.step === step);

    const shouldRender = (field: any) => {
        if (!field.conditional) return true;

        if (!values || !values[field.conditional.field]) return false;

        return values[field.conditional.field] === field.conditional.value;
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>

            <h3>Step {step} of 2</h3>

            {currentFields.map((field) =>
                shouldRender(field) ? (
                    <div key={field.name}>
                        <label>{field.label}</label>

                        <FieldRenderer field={field} register={register} />

                        {errors[field.name] && (
                            <p style={{ color: 'red' }}>
                                {errors[field.name]?.message as string}
                            </p>
                        )}
                    </div>
                ) : null
            )}

            <div style={{ marginTop: '20px' }}>
                {step > 1 && (
                    <button type="button" onClick={() => setStep(step - 1)}>
                        Previous
                    </button>
                )}

                {step < 2 && (
                    <button type="button" onClick={() => setStep(step + 1)}>
                        Next
                    </button>
                )}

                {step === 2 && <button type="submit">Submit</button>}
            </div>

        </form>
    );
};

export default FormRenderer;