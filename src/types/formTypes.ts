export type FieldType = 'text' | 'number' | 'select';

export interface Field {
  name: string;
  label: string;
  type: FieldType;

  options?: { label: string; value: string }[];

  validation?: {
    required?: boolean;
    minLength?: number;
  };

  conditional?: {
    field: string;
    value: string;
  };
}