import type { Field } from '../types/formTypes';

export const formSchema: (Field & { step: number })[] = [
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    step: 1,
    validation: { required: true }
  },
  {
    name: 'role',
    label: 'Role',
    type: 'select',
    step: 1,
    options: [
      { label: 'User', value: 'user' },
      { label: 'Admin', value: 'admin' }
    ]
  },
  {
    name: 'adminCode',
    label: 'Admin Code',
    type: 'text',
    step: 2,
    conditional: {
      field: 'role',
      value: 'admin'
    }
  }
];