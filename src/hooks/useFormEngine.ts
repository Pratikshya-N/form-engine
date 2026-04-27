import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getFormSchema } from "../api/getFormSchema";
import { buildValidationSchema } from "../utils/validation";

const STORAGE_KEY = "form-engine-data";

export const useFormEngine = () => {
    const [schema, setSchema] = useState<any[]>([]);

    useEffect(() => {
        const load = async () => {
            const data = await getFormSchema();
            setSchema(data as any[]);
        };

        load();
    }, []);

    const validationSchema = buildValidationSchema(schema || []);

    const form = useForm({
        resolver: zodResolver(validationSchema)
    });

    const { register, control, handleSubmit, setValue, formState: { errors } } = form;

    const values = useWatch({ control });

    // Load draft
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            Object.keys(parsed).forEach((k) => setValue(k, parsed[k]));
        }
    }, [setValue]);

    // Auto-save draft
    useEffect(() => {
        if (values) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
        }
    }, [values]);

    const onSubmit = (data: any) => {
        console.log("SUBMIT:", data);
        localStorage.removeItem(STORAGE_KEY);
    };

    return {
        register,
        control,
        handleSubmit,
        setValue,
        errors,
        values,
        onSubmit,
        schema
    };
};