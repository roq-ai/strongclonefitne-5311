import * as yup from 'yup';

export const exerciseValidationSchema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string().required(),
  weight: yup.number().integer().required(),
  sets: yup.number().integer().required(),
  reps: yup.number().integer().required(),
  organization_id: yup.string().nullable(),
});
