import * as yup from 'yup';

const disallowedPasswords = [
  "password",
  "12345678",
  "qwertyui",
  "abcdefgh",
  "87654321"
];

const fieldsByYear = {
  AP: ['TD1', 'TD2', 'TD3'],
  CI: ['GINF1', 'GSEA', 'CYS', 'GSR', 'GINL']
}

export const AddStudentSchema = yup.object({
     full_name: yup
      .string()
      .required('Fullname is required')
      .max(60, 'Fullname is too long')
      .matches(/^[A-Za-z\s]+$/, 'Fullname can only contain letters and spaces'),
      
    cin: yup
      .string()
      .required('CIN is required')
      .max(12, 'CIN is too long'),
    
    email: yup
      .string()
      .email('Invalid email format')
      .required('Email is required')
      .max(100, 'Email is too long'),

    pass: yup
        .string()
        .required('The password is required')
        .min(8, 'The password must have at least 8 characters')
        .max(64, 'The password must be at most 64 characters')
        .test(
        'not-in-disallowed',
        'The password is weak.',
            value => !disallowedPasswords.includes(value?.toLowerCase())
        )
        .matches(
        /^(?=.*[A-Z])(?=.*\d).+$/,
        'The password must contain at least one uppercase letter and one number.'
        ),

    id_sector: yup.string()
    .required('Year is required')
    .test(
      'valid-year',
      'Year must start with AP or CI',
      (value) => value.startsWith('AP') || value.startsWith('CI')
    ),

    id_class: yup.string()
    .required('Field is required')
    .when('year', {
      is: (id_sector) => id_sector?.startsWith('AP'),
      then: () => yup.string().oneOf(fieldsByYear.AP, 'Invalid field for AP year'),
      otherwise: () => yup.string().oneOf(fieldsByYear.CI, 'Invalid field for CI year')
    }),
    
    note: yup
      .string()
      .max(1000, 'Admine Notes cannot exceed 1000 characters')
  });