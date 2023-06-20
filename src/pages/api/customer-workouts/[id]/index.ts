import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { customerWorkoutValidationSchema } from 'validationSchema/customer-workouts';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.customer_workout
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getCustomerWorkoutById();
    case 'PUT':
      return updateCustomerWorkoutById();
    case 'DELETE':
      return deleteCustomerWorkoutById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getCustomerWorkoutById() {
    const data = await prisma.customer_workout.findFirst(convertQueryToPrismaUtil(req.query, 'customer_workout'));
    return res.status(200).json(data);
  }

  async function updateCustomerWorkoutById() {
    await customerWorkoutValidationSchema.validate(req.body);
    const data = await prisma.customer_workout.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteCustomerWorkoutById() {
    const data = await prisma.customer_workout.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
