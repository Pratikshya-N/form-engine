import { useState, useEffect } from "react";
import FieldRenderer from "./FieldRenderer";
import { useFormEngine } from "../hooks/useFormEngine";
import { useSnackbar } from "../context/SnackbarContext";
import StepProgress from "./StepProgress";
import { formStyles } from "../styles/formStyles";

const FormRenderer = () => {
    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        trigger,
        reset,
        errors,
        schema,
        onSubmit
    } = useFormEngine();

    const { showMessage } = useSnackbar();

    const [skipToSubmit, setSkipToSubmit] = useState(false);
    const [step, setStep] = useState(1);
    const totalSteps = 2;

    const roleValue = getValues("role");

    useEffect(() => {
        if (roleValue !== "admin") {
            // clear adminCode when not admin
            setValue("adminCode", "");
        }
    }, [roleValue]);

    const shouldRender = (field: any) => {
        if (!field.conditional) return true;

        const values = getValues();
        return values[field.conditional.field] === field.conditional.value;
    };

    const currentFields = schema.filter((f: any) => f.step === step);

    const handleNext = async () => {
        const stepFieldNames = currentFields
            .filter((f: any) => shouldRender(f))
            .map((f: any) => f.name);

        const isValid = await trigger(stepFieldNames);

        if (!isValid) {
            showMessage("Please complete required fields", "error");
            return;
        }

        const nextStepFields = schema.filter(
            (f: any) => f.step === step + 1 && shouldRender(f)
        );

        if (nextStepFields.length === 0) {
            setSkipToSubmit(true);
            showMessage("No additional fields for this role. You can submit now.", "info");
            return;
        }

        setStep((s) => s + 1);
    };

    const handleFinalSubmit = async (data: any) => {
        const allFields = schema
            .filter((f: any) => shouldRender(f))
            .map((f: any) => f.name);

        const isValid = await trigger(allFields);

        if (!isValid) {
            showMessage("Please complete required fields", "error");
            return;
        }

        const cleanedData = { ...data };

        if (cleanedData.role !== "admin") {
            delete cleanedData.adminCode;
        }

        const success = onSubmit(cleanedData, showMessage);

        // 🚨 ONLY reset if success
        if (success) {
            reset();
            setStep(1);
            setSkipToSubmit(false);
        }
    };

    if (!schema.length) return <div>Loading...</div>;

    return (
        <div style={{ width: "100%" }}>
            <StepProgress currentStep={step} totalSteps={totalSteps} />

            <form onSubmit={handleSubmit(handleFinalSubmit)}>
                <h3>Step {step}</h3>

                {currentFields.map((field: any) =>
                    shouldRender(field) ? (
                        <div key={field.name} style={{ marginBottom: 18 }}>
                            <label style={formStyles.label}>{field.label}</label>

                            <FieldRenderer field={field} register={register} />

                            {errors[field.name] && (
                                <p style={formStyles.error}>
                                    {errors[field.name]?.message as string}
                                </p>
                            )}
                        </div>
                    ) : null
                )}

                <div style={formStyles.buttonContainer}>
                    {step > 1 && (
                        <button
                            type="button"
                            onClick={() => setStep(step - 1)}
                            style={formStyles.secondaryBtn}
                        >
                            Previous
                        </button>
                    )}

                    {step < totalSteps && !skipToSubmit && (
                        <button
                            type="button"
                            onClick={handleNext}
                            style={formStyles.primaryBtn}
                        >
                            Next
                        </button>
                    )}

                    {(step === totalSteps || skipToSubmit) && (
                        <button type="submit" style={formStyles.primaryBtn}>
                            Submit
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={() => {
                            currentFields
                                .filter((f: any) => shouldRender(f))
                                .forEach((field: any) => {
                                    setValue(field.name, "");
                                });
                        }}
                        style={formStyles.secondaryBtn}
                    >
                        Clear
                    </button>
                </div>
            </form >
        </div >
    );
};

export default FormRenderer;