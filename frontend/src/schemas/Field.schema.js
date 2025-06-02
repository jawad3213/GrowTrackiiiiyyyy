import * as yup from 'yup'

const coachSchema = yup.object({
field: yup
    .string().max(50, 'The name is too long')
    .required('Full name is required'),
    
description: yup
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
cin: yup
    .string()
    .max(12, 'CIN is too long')
    .required('CIN is required'),
field: yup
    .string().optional(),   
note: yup
    .string().max(200, 'Notes are too long')
})
  
export default coachSchema;