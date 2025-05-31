import * as yup from 'yup';

export const contactUsSchema = yup.object({
    Email: yup
      .string()
      .email('Invalid email format')
      .required('Email is required')
      .max(100, 'Email is too long'),
    
    FirstName: yup
      .string()
      .required('First name is required')
      .max(50, 'First name is too long')
      .matches(/^[A-Za-z\s]+$/, 'First name can only contain letters and spaces'),
    
    LastName: yup
      .string()
      .required('Last name is required')
      .max(50, 'Last name is too long')
      .matches(/^[A-Za-z\s]+$/, 'Last name can only contain letters and spaces'),
    
    Phone: yup
      .string()
      .required('Phone number is required')
      .matches(
        /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/, // Supports international formats
        'Invalid phone number'
      )
      .max(20, 'Phone number is too long')
      .min(10, 'Invalide Phone number'),
    
    Message: yup
      .string()
      .required('Message is required')
      .max(1000, 'Message cannot exceed 1000 characters')
      .min(2, 'Message is too short')
  });