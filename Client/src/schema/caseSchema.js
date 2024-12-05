import * as yup from 'yup'

export const CaseSchema = yup.object({
    subject: yup.string().required("Subject Is required"),
    category: yup.string(),
    subcategory: yup.string(),
    description: yup.string(),
    notes: yup.string(),
    // assignmentTo: yup.string(),
    // assignmentToLead: yup.string(),
    reminder: yup.string(),
    backgroundColor: yup.string(),
    borderColor: yup.string(),
    textColor: yup.string(),
    display: yup.string(),
    url: yup.string(),
    createBy: yup.string(),
    studentName: yup.string(),
})