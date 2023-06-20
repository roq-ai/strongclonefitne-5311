import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { customerWorkoutValidationSchema } from 'validationSchema/customer-workouts';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getCustomerWorkouts();
    case 'POST':
      return createCustomerWorkout();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getCustomerWorkouts() {
    const data = await prisma.customer_workout
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'customer_workout'));
    return res.status(200).json(data);
  }

  async function createCustomerWorkout() {
    await customerWorkoutValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.customer_workout.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
