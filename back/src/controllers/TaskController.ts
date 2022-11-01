import { NextFunction, Request, Response } from 'express';
import { get, post, del, patch } from './decorators/routes';
import { use } from './decorators/use';
import { controller } from './decorators/controller';
import { requireAuth } from '../middlewares/requireAuth';
import { StatusCodes } from 'http-status-codes';
import { createCustomError } from '../errors/CustomError';

@controller('/api/v1/tasks')
export class TaskController {
  // @use(requireAuth)
  @get('/')
  async getAllTask(req: Request, res: Response) {
    // const { completed, name, sort, fields } = req.query;

    // const queryObject: any = { author: req.body.username };

    // if (completed) {
    //   queryObject.completed = completed === 'true' ? true : false;
    // }

    // if (name) {
    //   queryObject.name = { $regex: name, $options: 'i' };
    // }

    // let result = TaskModal.find(queryObject);

    // if (sort) {
    //   const sortList = (sort as string).split(',').join(' ');
    //   result = result.sort(sortList);
    // } else {
    //   result = result.sort('createdAt');
    // }

    // if (fields) {
    //   const fieldsList = (fields as string).split(',').join(' ');
    //   result = result.select(fieldsList);
    // }

    // const page = Number(req.query.page) || 1;
    // const limit = Number(req.query.limit) || 1000000;
    // const skip = (page - 1) * limit;

    // result = result.skip(skip).limit(limit);

    // const tasks: Task[] = [];
    // res.status(StatusCodes.OK).json({ tasks: tasks, nbHits: tasks.length });
    res.status(StatusCodes.OK).json({ mes: 'u suck' });
  }

  // @use(requireAuth)
  // @get('/:id')
  // async getTask(req: Request, res: Response, next: NextFunction) {
  //   const { id: taskID } = req.params;
  //   const task = await TaskModal.findOne({
  //     _id: taskID,
  //     author: req.body.username,
  //   });
  //   if (!task) {
  //     return next(
  //       createCustomError(`No task with id : ${taskID}`, StatusCodes.NOT_FOUND)
  //     );
  //   }
  //   res.status(StatusCodes.OK).json({ success: true, data: task });
  // }

  // //add bodyvalidator
  // @use(requireAuth)
  // @post('/')
  // async createTask(req: Request, res: Response) {
  //   const newTask = { ...req.body, author: req.body.username };
  //   const task = await TaskModal.create(newTask);
  //   res.status(StatusCodes.CREATED).json({ success: true, task });
  // }

  // @use(requireAuth)
  // @del('/:id')
  // async deleteTask(req: Request, res: Response, next: NextFunction) {
  //   const { id: taskID } = req.params;
  //   const task = await TaskModal.findOneAndDelete({
  //     _id: taskID,
  //     author: req.body.username,
  //   });
  //   if (!task) {
  //     return next(
  //       createCustomError(`No task with id : ${taskID}`, StatusCodes.NOT_FOUND)
  //     );
  //   }
  //   res.status(StatusCodes.OK).json({ success: true });
  // }

  // @use(requireAuth)
  // @patch('/:id')
  // async updateTask(req: Request, res: Response, next: NextFunction) {
  //   const { id: taskID } = req.params;

  //   const task = await TaskModal.findOneAndUpdate(
  //     { _id: taskID, author: req.body.username },
  //     req.body,
  //     {
  //       new: true,
  //       runValidators: true,
  //     }
  //   );

  //   if (!task) {
  //     return next(
  //       createCustomError(`No task with id : ${taskID}`, StatusCodes.NOT_FOUND)
  //     );
  //   }

  //   res.status(StatusCodes.OK).json({ task });
  // }
}
