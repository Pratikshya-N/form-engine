import { z } from 'zod';
import type { Field } from '../types/formTypes';

export const buildValidationSchema = (fields: Field[]) => {
  const shape: Record<string, any> = {};

  fields.forEach((field) => {
    let validator;

    switch (field.type) {
      case 'text':
        validator = z.string();
        if (field.validation?.required) {
          validator = validator.min(1, `${field.label} is required`);
        }
        if (field.validation?.minLength) {
          validator = validator.min(
            field.validation.minLength,
            `${field.label} must be at least ${field.validation.minLength} characters`
          );
        }
        break;

      case 'number':
        validator = z.number();
        break;

      case 'select':
        validator = z.string();
        if (field.validation?.required) {
          validator = validator.min(1, `${field.label} is required`);
        }
        break;

      default:
        validator = z.any();
    }

    shape[field.name] = validator;
  });

  return z.object(shape);
};