import { UserInterface } from 'interfaces/user';
import { WorkoutPlanInterface } from 'interfaces/workout-plan';
import { GetQueryInterface } from 'interfaces';

export interface CustomerWorkoutInterface {
  id?: string;
  user_id?: string;
  workout_plan_id?: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  workout_plan?: WorkoutPlanInterface;
  _count?: {};
}

export interface CustomerWorkoutGetQueryInterface extends GetQueryInterface {
  id?: string;
  user_id?: string;
  workout_plan_id?: string;
}
