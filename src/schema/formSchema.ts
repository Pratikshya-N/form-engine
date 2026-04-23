import type { Field } from '../types/formTypes';

export const formSchema: Field[] = [
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    validation: { required: true }
  },
  {
    name: 'role',
    label: 'Role',
    type: 'select',
    options: [
      { label: 'User', value: 'user' },
      { label: 'Admin', value: 'admin' }
    ]
  },
  {
    name: 'adminCode',
    label: 'Admin Code',
    type: 'text',
    conditional: {
      field: 'role',
      value: 'admin'
    }
  }
];