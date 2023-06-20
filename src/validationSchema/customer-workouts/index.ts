import * as yup from 'yup';

export const customerWorkoutValidationSchema = yup.object().shape({
  user_id: yup.string().nullable(),
  workout_plan_id: yup.string().nullable(),
});
