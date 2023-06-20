import { CustomerWorkoutInterface } from 'interfaces/customer-workout';
import { OrganizationInterface } from 'interfaces/organization';
import { GetQueryInterface } from 'interfaces';

export interface WorkoutPlanInterface {
  id?: string;
  name: string;
  organization_id?: string;
  created_at?: any;
  updated_at?: any;
  customer_workout?: CustomerWorkoutInterface[];
  organization?: OrganizationInterface;
  _count?: {
    customer_workout?: number;
  };
}

export interface WorkoutPlanGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  organization_id?: string;
}
