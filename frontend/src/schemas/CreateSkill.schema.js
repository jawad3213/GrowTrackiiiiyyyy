import * as yup from 'yup'

const SkillSchema = yup.object({
    skill_name: yup.string()
        .required('Skill name is required')
        .min(3, 'Skill name must be at least 3 characters')
        .max(50, 'Skill name cannot exceed 50 characters'),
        
    description_skill: yup.string()
        .required('Description is required')
        .min(10, 'Description must be at least 10 characters')
        .max(500, 'Description cannot exceed 500 characters'),
    question1: yup.string()
        .required('Question is required')
        .min(10, 'Question must be at least 10 characters')
        .max(100, 'Question cannot exceed 500 characters'),
    question2: yup.string()
        .required('Question is required')
        .min(10, 'Question must be at least 10 characters')
        .max(100, 'Question cannot exceed 500 characters'),
    question3: yup.string()
        .required('Question is required')
        .min(10, 'Question must be at least 10 characters')
        .max(100, 'Question cannot exceed 500 characters'),
    id_admin: yup.string()
        .required('Admin ID is required')
});
export default SkillSchema ;