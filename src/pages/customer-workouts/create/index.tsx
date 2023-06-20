import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createCustomerWorkout } from 'apiSdk/customer-workouts';
import { Error } from 'components/error';
import { customerWorkoutValidationSchema } from 'validationSchema/customer-workouts';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { WorkoutPlanInterface } from 'interfaces/workout-plan';
import { getUsers } from 'apiSdk/users';
import { getWorkoutPlans } from 'apiSdk/workout-plans';
import { CustomerWorkoutInterface } from 'interfaces/customer-workout';

function CustomerWorkoutCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: CustomerWorkoutInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createCustomerWorkout(values);
      resetForm();
      router.push('/customer-workouts');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<CustomerWorkoutInterface>({
    initialValues: {
      user_id: (router.query.user_id as string) ?? null,
      workout_plan_id: (router.query.workout_plan_id as string) ?? null,
    },
    validationSchema: customerWorkoutValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Customer Workout
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email}
              </option>
            )}
          />
          <AsyncSelect<WorkoutPlanInterface>
            formik={formik}
            name={'workout_plan_id'}
            label={'Select Workout Plan'}
            placeholder={'Select Workout Plan'}
            fetcher={getWorkoutPlans}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'customer_workout',
  operation: AccessOperationEnum.CREATE,
})(CustomerWorkoutCreatePage);
