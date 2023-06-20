import * as yup from 'yup';

export const workoutPlanValidationSchema = yup.object().shape({
  name: yup.string().required(),
  organization_id: yup.string().nullable(),
});
