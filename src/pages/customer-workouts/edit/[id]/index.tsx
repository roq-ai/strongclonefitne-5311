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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getCustomerWorkoutById, updateCustomerWorkoutById } from 'apiSdk/customer-workouts';
import { Error } from 'components/error';
import { customerWorkoutValidationSchema } from 'validationSchema/customer-workouts';
import { CustomerWorkoutInterface } from 'interfaces/customer-workout';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { WorkoutPlanInterface } from 'interfaces/workout-plan';
import { getUsers } from 'apiSdk/users';
import { getWorkoutPlans } from 'apiSdk/workout-plans';

function CustomerWorkoutEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<CustomerWorkoutInterface>(
    () => (id ? `/customer-workouts/${id}` : null),
    () => getCustomerWorkoutById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: CustomerWorkoutInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateCustomerWorkoutById(id, values);
      mutate(updated);
      resetForm();
      router.push('/customer-workouts');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<CustomerWorkoutInterface>({
    initialValues: data,
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
            Edit Customer Workout
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
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
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'customer_workout',
  operation: AccessOperationEnum.UPDATE,
})(CustomerWorkoutEditPage);
