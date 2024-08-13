import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreatePlanService from '@modules/plans/services/CreatePlanService';
import ReadAllPlansService from '@modules/plans/services/ReadAllPlansService';
import ReadPlanByIdService from '@modules/plans/services/ReadPlanByIdService';
import DeletePlanService from '@modules/plans/services/DeletePlanService';
import UpdatePlanService from '@modules/plans/services/UpdatePlanService';

export default class PlanController {
  public async create(req: Request, res: Response): Promise<Response> {
    const {
      name,
      price,
      max_users,
    } = req.body;

    const createPlan = container.resolve(CreatePlanService);

    const plan = await createPlan.execute({
      name,
      price,
      max_users,
    });

    return res.status(201).json(plan);
  }

  public async readAll(req: Request, res: Response): Promise<Response> {
    const readPlans = container.resolve(ReadAllPlansService);

    const plans = await readPlans.execute();

    return res.status(201).json(plans);
  }

  public async readById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const readPlan = container.resolve(ReadPlanByIdService);

    const plan = await readPlan.execute({
      id,
    });

    return res.status(201).json(plan);
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const {
      name,
      price,
      max_users,
    } = req.body;

    const updatePlan = container.resolve(UpdatePlanService);

    const plan = await updatePlan.execute({
      id,
      name,
      price,
      max_users,
    });

    return res.status(201).json(plan);
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const deletePlan = container.resolve(DeletePlanService);

    const plan = await deletePlan.execute({
      id,
    });

    return res.status(201).json(plan);
  }
}
