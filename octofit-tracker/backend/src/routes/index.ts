import { Router, type Request, type Response, type NextFunction } from 'express';
import type { Model } from 'mongoose';
import { Activity, Leaderboard, Team, User, Workout } from '../models/index.js';

interface ResourceOptions {
  populate?: string[];
  sort?: Record<string, 1 | -1>;
}

function createResourceRouter(model: Model<any>, options: ResourceOptions = {}) {
  const router = Router();

  router.get('/', async (_request, response, next) => {
    try {
      const query = model.find().sort(options.sort ?? { createdAt: -1 });
      options.populate?.forEach((path) => query.populate(path));
      response.json(await query.exec());
    } catch (error) {
      next(error);
    }
  });

  router.get('/:id', async (request, response, next) => {
    try {
      const query = model.findById(request.params.id);
      options.populate?.forEach((path) => query.populate(path));
      const record = await query.exec();
      if (!record) {
        response.status(404).json({ error: 'Record not found' });
        return;
      }
      response.json(record);
    } catch (error) {
      next(error);
    }
  });

  router.post('/', async (request, response, next) => {
    try {
      response.status(201).json(await model.create(request.body));
    } catch (error) {
      next(error);
    }
  });

  const updateRecord = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const query = model.findByIdAndUpdate(request.params.id, request.body, {
        returnDocument: 'after',
        runValidators: true,
      });
      options.populate?.forEach((path) => query.populate(path));
      const record = await query.exec();
      if (!record) {
        response.status(404).json({ error: 'Record not found' });
        return;
      }
      response.json(record);
    } catch (error) {
      next(error);
    }
  };
  router.put('/:id', updateRecord);
  router.patch('/:id', updateRecord);

  router.delete('/:id', async (request, response, next) => {
    try {
      const record = await model.findByIdAndDelete(request.params.id).exec();
      if (!record) {
        response.status(404).json({ error: 'Record not found' });
        return;
      }
      response.status(204).end();
    } catch (error) {
      next(error);
    }
  });

  return router;
}

const apiRouter = Router();

apiRouter.use('/users', createResourceRouter(User, { sort: { username: 1 } }));
apiRouter.use('/teams', createResourceRouter(Team, { populate: ['members'], sort: { name: 1 } }));
apiRouter.use('/activities', createResourceRouter(Activity, { populate: ['user'], sort: { completedAt: -1 } }));
apiRouter.use(
  '/leaderboard',
  createResourceRouter(Leaderboard, {
    populate: ['user'],
    sort: { points: -1, rank: 1 },
  }),
);
apiRouter.use('/workouts', createResourceRouter(Workout, { sort: { title: 1 } }));

export default apiRouter;