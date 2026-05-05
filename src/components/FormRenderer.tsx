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

    //computed states
    const isStep1 = step === 1;
    const isStep2 = step === 2;

    // submit enabled logic
    const canSubmit =
        (isStep1 && !hasNextStep) || // no step 2 → allow submit in step 1
        isStep2;                     // step 2 → always allow (validation handled separately)


    // check if any field has value (for Clear button)
    const hasAnyValue = currentFields.some((field: any) => {
        const val = getValues(field.name);

        if (val === undefined || val === null) return false;
        if (typeof val === "string" && val.trim() === "") return false;
        if (Array.isArray(val) && val.length === 0) return false;

        return true;
    });

    //check for conditional field
    const conditionalParents = Array.from(
        new Set(
            activeSchema
                .filter((f: any) => f.conditional?.field)
                .map((f: any) => f.conditional.field)
        )
    );
    //check for conditional value selected or not
    const areConditionalsResolved = conditionalParents.every(
        (fieldName) => {
            const value = getValues(fieldName);
            return value !== undefined && value !== null && value !== "";
        }
    );

    // NEXT HANDLER
    const handleNext = async () => {
        const stepFieldNames = currentFields.map((f: any) => f.name);

        const isValid = await trigger(stepFieldNames);

        if (!isValid) {
            showMessage("Please complete required fields", "error");
            return;
        }

        if (!hasNextStep) return;

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

        const cleanedData = { ...data };

        if (cleanedData.role !== "admin") {
            delete cleanedData.adminCode;
        }

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

                    <div style={formStyles.btnDiv}>
                        {/* Previous */}
                        <button
                            type="button"
                            onClick={() => setStep(step - 1)}
                            disabled={isStep1}
                            style={formStyles.secondaryBtn}
                        >
                            Previous
                        </button>

                        {/* Clear */}
                        <button
                            type="button"
                            disabled={!hasAnyValue}
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

                        {/* Next */}
                        <button
                            type="button"
                            onClick={handleNext}
                            disabled={!hasNextStep}
                            style={!hasNextStep ? formStyles.submitBtnDisabled : formStyles.primaryBtn}
                        >
                            Next
                        </button>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={!canSubmit || isTestMode}
                            style={
                                !canSubmit || isTestMode
                                    ? formStyles.submitBtnDisabled
                                    : formStyles.primaryBtn
                            }
                        >
                            Submit
                        </button>
                    </div>

                    {isTestMode && (
                        <div style={{ ...formStyles.inlineText, color: "#f59e0b" }}>
                            Test mode: submission is disabled.
                        </div>
                    )}


                    {!isTestMode && !hasNextStep && areConditionalsResolved && (
                        <div style={{ ...formStyles.inlineText, color: "#10b981" }}>
                            No additional fields. You can submit now.
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};

export default FormRenderer;