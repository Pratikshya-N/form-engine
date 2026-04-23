import { useFormEngine } from '../hooks/useFormEngine';
import FieldRenderer from './FieldRenderer';
import { useState } from 'react';
import { useSnackbar } from "../context/SnackbarContext";

const FormRenderer = () => {
    const {
        register,
        control,
        handleSubmit,
        errors,
        values,
        onSubmit
    } = useFormEngine();

    const [step, setStep] = useState(1);
    const [stepErrors, setStepErrors] = useState<any>({});

    const { schema, validateAndProceed } = useFormEngine();

    const { showMessage } = useSnackbar();

    const currentFields = schema.filter((f: any) => f.step === step);

    const shouldRender = (field: any) => {
        if (!field.conditional) return true;

        return values?.[field.conditional.field] === field.conditional.value;
    };

    if (!schema || schema.length === 0) {
        return <div>Loading form...</div>;
    }

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
                    <button
                        type="button"
                        onClick={async () => {
                            const errors = await validateAndProceed(step, setStep);
                            if (errors) {
                                setStepErrors(errors);
                                showMessage("Please fill all required fields before proceeding", "error");
                                return;
                            }
                            setStepErrors({});
                        }}
                    >
                        Next
                    </button>
                )}

                {step === 2 && <button type="submit">Submit</button>}
            </div>

            {/* {Object.keys(stepErrors).length > 0 && (
                <p style={{ color: 'red' }}>
                    Please complete all required fields to continue
                </p>
            )} */}
        </form>
    );
};

export default FormRenderer;