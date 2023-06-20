import axios from 'axios';
import queryString from 'query-string';
import { CustomerWorkoutInterface, CustomerWorkoutGetQueryInterface } from 'interfaces/customer-workout';
import { GetQueryInterface } from '../../interfaces';

export const getCustomerWorkouts = async (query?: CustomerWorkoutGetQueryInterface) => {
  const response = await axios.get(`/api/customer-workouts${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createCustomerWorkout = async (customerWorkout: CustomerWorkoutInterface) => {
  const response = await axios.post('/api/customer-workouts', customerWorkout);
  return response.data;
};

export const updateCustomerWorkoutById = async (id: string, customerWorkout: CustomerWorkoutInterface) => {
  const response = await axios.put(`/api/customer-workouts/${id}`, customerWorkout);
  return response.data;
};

export const getCustomerWorkoutById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/customer-workouts/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteCustomerWorkoutById = async (id: string) => {
  const response = await axios.delete(`/api/customer-workouts/${id}`);
  return response.data;
};
