const mapping: Record<string, string> = {
  'customer-workouts': 'customer_workout',
  exercises: 'exercise',
  organizations: 'organization',
  users: 'user',
  'workout-plans': 'workout_plan',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
