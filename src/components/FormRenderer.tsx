import { useState } from "react";
import FieldRenderer from "./FieldRenderer";
import { useFormEngine } from "../hooks/useFormEngine";
import { useSnackbar } from "../context/SnackbarContext";

const FormRenderer = () => {
    const {
        register,
        handleSubmit,
        errors,
        values,
        schema,
        onSubmit
    } = useFormEngine();

    const { showMessage } = useSnackbar();

    const [step, setStep] = useState(1);

    const currentFields = schema.filter((f: any) => f.step === step);

    const shouldRender = (field: any) => {
        if (!field.conditional) return true;

        return values?.[field.conditional.field] === field.conditional.value;
    };

    const handleNext = () => {
        const stepFields = currentFields;

        const hasError = stepFields.some((f: any) => !values?.[f.name]);

        if (hasError) {
            showMessage("Please complete required fields", "error");
            return;
        }

        setStep((s) => s + 1);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h3>Step {step}</h3>

            {currentFields.map((field: any) =>
                shouldRender(field) ? (
                    <div key={field.name}>
                        <label>{field.label}</label>
                        <FieldRenderer field={field} register={register} />

                        {errors[field.name] && (
                            <p style={{ color: "red" }}>
                                {errors[field.name]?.message as string}
                            </p>
                        )}
                    </div>
                ) : null
            )}

            <div>
                {step > 1 && (
                    <button type="button" onClick={() => setStep(step - 1)}>
                        Previous
                    </button>
                )}

                {step < 2 && (
                    <button type="button" onClick={handleNext}>
                        Next
                    </button>
                )}

                {step === 2 && <button type="submit">Submit</button>}
            </div>
        </form>
    );
};

export default FormRenderer;