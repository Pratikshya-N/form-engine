import { useState, useEffect } from "react";
import FieldRenderer from "./FieldRenderer";
import { useFormEngine } from "../hooks/useFormEngine";
import { useSnackbar } from "../context/SnackbarContext";
import StepProgress from "./StepProgress";
import { formStyles } from "../styles/formStyles";
import type { Field } from "../types/formTypes";

interface Props {
    externalSchema?: Field[];
    isTestMode?: boolean;
}

const FormRenderer = ({ externalSchema, isTestMode }: Props) => {

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        trigger,
        reset,
        watch,
        errors,
        schema,
        onSubmit
    } = useFormEngine();

    const { showMessage } = useSnackbar();

    const [step, setStep] = useState(1);
    const totalSteps = 2;

    const watchedValues = watch(); // triggers re-render

    const activeSchema =
        externalSchema && externalSchema.length > 0
            ? externalSchema
            : schema;

    // Clear adminCode if role changes
    useEffect(() => {
        const roleValue = getValues("role");
        if (roleValue !== "admin") {
            setValue("adminCode", "");
        }
    }, [watchedValues.role]);

    //  HYBRID shouldRender
    const shouldRender = (field: any) => {
        if (!field.conditional) return true;

        // trigger re-render
        const _ = watchedValues[field.conditional.field];

        // stable value read
        const parentValue = getValues(field.conditional.field);

        return parentValue === field.conditional.value;
    };

    const currentFields = activeSchema.filter(
        (f: any) => f.step === step && f?.name?.trim()
    );

    // dynamic next step detection
    const nextStepFields = activeSchema.filter(
        (f: any) =>
            f.step === step + 1 &&
            shouldRender(f) &&
            f?.name?.trim()
    );

    const hasNextStep = nextStepFields.length > 0;

    // NEXT HANDLER
    const handleNext = async () => {
        const stepFieldNames = currentFields.map((f: any) => f.name);

        const isValid = await trigger(stepFieldNames);

        if (!isValid) {
            showMessage("Please complete required fields", "error");
            return;
        }

        if (!hasNextStep) {
            if (isTestMode) {
                showMessage("Test mode: submission disabled", "info");
            } else {
                showMessage("No additional fields. You can submit now.", "info");
            }
            return;
        }

        showMessage(`Proceeding to Step ${step + 1}`, "info");
        setStep((s) => s + 1);
    };

    // FINAL SUBMIT
    const handleFinalSubmit = async (data: any) => {
        const allFields = activeSchema
            .filter((f: any) => shouldRender(f))
            .map((f: any) => f.name);

        const isValid = await trigger(allFields);

        if (!isValid) {
            showMessage("Please complete required fields", "error");
            return;
        }

        if (isTestMode) {
            showMessage("Test mode: submission disabled", "info");
            return;
        }

        const cleanedData = { ...data };

        if (cleanedData.role !== "admin") {
            delete cleanedData.adminCode;
        }

        console.log("data", cleanedData)
        const success = onSubmit(cleanedData, showMessage);

        // ONLY reset if success
        if (success) {
            reset();
            setStep(1);
        }
    };

    if (!activeSchema.length) return <div>Loading...</div>;

    return (
        <div style={{ ...formStyles.container, width: "100%" }}>
            <div style={{ marginTop: 20 }}>
                <StepProgress currentStep={step} totalSteps={totalSteps} />
            </div>
            <form onSubmit={handleSubmit(handleFinalSubmit)} style={formStyles.innerForm}>
                <h3 style={{ margin: "10px 16px" }}>Step {step}</h3>

                {/* SCROLLABLE BODY */}
                <div style={formStyles.formBody}>
                    {currentFields.map((field: any) =>
                        shouldRender(field) ? (
                            <div key={field.name} style={{ marginBottom: 18 }}>
                                <label style={formStyles.label}>
                                    {field.label || field.name}
                                </label>

                                <FieldRenderer field={field} register={register} />

                                {errors?.[field.name] && (
                                    <p style={formStyles.error}>
                                        {errors[field.name]?.message as string}
                                    </p>
                                )}
                            </div>
                        ) : null
                    )}
                </div>

                {/* FIXED FOOTER */}
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

                    {step < totalSteps && hasNextStep && (
                        <button
                            type="button"
                            onClick={handleNext}
                            style={formStyles.primaryBtn}
                        >
                            Next
                        </button>
                    )}

                    {(step === totalSteps || !hasNextStep) && (
                        <button
                            type="submit"
                            disabled={isTestMode}
                            style={
                                isTestMode
                                    ? formStyles.submitBtnDisabled
                                    : formStyles.primaryBtn
                            }
                        >
                            Submit
                        </button>
                    )}

                </div>
            </form>
        </div>
    );
};

export default FormRenderer;