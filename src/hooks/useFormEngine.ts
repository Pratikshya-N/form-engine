import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { buildValidationSchema } from '../utils/validation';
import { getFormSchema } from '../api/getFormSchema';
import type { Field } from '../types/formTypes';
import { useSnackbar } from "../context/SnackbarContext";


const STORAGE_KEY = 'form-engine-data';

export const useFormEngine = () => {
    const [schema, setSchema] = useState<Field[]>([]);   
    
    const { showMessage } = useSnackbar();

    const validationSchema = buildValidationSchema(schema || []);

    const defaultValues = schema.reduce((acc: any, field: any) => {
        acc[field.name] = "";
        return acc;
    }, {});

    const form = useForm({
        resolver: zodResolver(validationSchema),
        defaultValues
    });

    const { register, control, handleSubmit, setValue, formState: { errors } } = form;

    const values = useWatch({ control });


    useEffect(() => {
        const loadSchema = async () => {
            const data = await getFormSchema();
            setSchema(data);
        };

        loadSchema();
    }, []);

    // Load draft
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (saved) {
            const parsed = JSON.parse(saved);
            Object.keys(parsed).forEach((key) => {
                setValue(key, parsed[key]);
            });
        }
    }, [setValue]);

    // Auto-save draft
    useEffect(() => {
        if (values) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
        }
    }, [values]);

    const onSubmit = (data: any) => {
        console.log(data);
        localStorage.removeItem(STORAGE_KEY);

        showMessage("Form submitted successfully!", "success");
    };

    const getStepFields = (step: number) =>
        schema.filter((f: any) => f.step === step);

    const validateStep = async (step: number) => {
        const stepFields = getStepFields(step);

        const stepSchema = buildValidationSchema(stepFields);

        const result = stepSchema.safeParse(values);

        return result;
    };

    const validateAndProceed = async (
        currentStep: number,
        setStep: (step: number) => void
    ) => {
        const result = await validateStep(currentStep);

        if (!result.success) {
            return result.error.flatten().fieldErrors;
        }

        setStep(currentStep + 1);
        return null;
    };


    return {
        register,
        control,
        handleSubmit,
        setValue,
        errors,
        values,
        onSubmit,
        schema,
        validateAndProceed
    };
};