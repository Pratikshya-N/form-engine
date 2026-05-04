import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getFormSchema } from "../api/getFormSchema";
import type { Field } from "../types/formTypes";

const USERS_KEY = "users-db";

export const useFormEngine = () => {
    const [schema, setSchema] = useState<Field[]>([]);

    const form = useForm({
        mode: "onChange"
    });

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        trigger,
        reset,
        watch,
        formState: { errors }
    } = form;

    // 🔹 Load schema
    useEffect(() => {
        const loadSchema = async () => {
            const data = await getFormSchema();
            setSchema(data || []);
        };

        loadSchema();
    }, []);

    // 🔹 Submit with duplicate validation
    const onSubmit = (data: any, showMessage: any) => {
        const existingUsers = JSON.parse(
            localStorage.getItem(USERS_KEY) || "[]"
        );

        // ❗ Duplicate check: same name with DIFFERENT role
        const duplicate = existingUsers.find(
            (u: any) =>
                u.name.trim().toLowerCase() ===
                data.name.trim().toLowerCase() &&
                u.role !== data.role
        );

        if (duplicate) {
            showMessage(
                "Same name cannot be used for another role",
                "error"
            );
            return false; // 🚨 important
        }

        // ✅ Save valid user
        const updatedUsers = [...existingUsers, data];

        localStorage.setItem(
            USERS_KEY,
            JSON.stringify(updatedUsers)
        );

        showMessage("Form submitted successfully", "success");

        return true; // ✅ success flag
    };

    return {
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
    };
};