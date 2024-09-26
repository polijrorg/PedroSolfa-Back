import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateDutyService from '@modules/duties/services/CreateDutyService';
import ReadAllDutiesService from '@modules/duties/services/ReadAllDutiesService';
import ReadDutyByIdService from '@modules/duties/services/ReadDutyByIdService';
import DeleteDutyService from '@modules/duties/services/DeleteDutyService';
import UpdateDutyService from '@modules/duties/services/UpdateDutyService';
import ReadUserDutiesService from '@modules/duties/services/ReadUserDutiesService';

export default class DutyController {
  public async create(req: Request, res: Response): Promise<Response> {
    const {
      description,
      date,
      duration,
      group_id,
      users_id,
    } = req.body;

    const createDuty = container.resolve(CreateDutyService);

    const duty = await createDuty.execute({
      description,
      date,
      duration,
      group_id,
      users_id,
    });

    return res.status(201).json(duty);
  }

  public async readAll(req: Request, res: Response): Promise<Response> {
    const { group_id } = req.params;

    const readDuties = container.resolve(ReadAllDutiesService);

    const duties = await readDuties.execute(group_id);

    return res.status(201).json(duties);
  }

  public async readById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const readDuty = container.resolve(ReadDutyByIdService);

    const duty = await readDuty.execute({
      id,
    });

    return res.status(201).json(duty);
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const {
      description,
      date,
      duration,
      users_id,
    } = req.body;

    const updateDuty = container.resolve(UpdateDutyService);

    const duty = await updateDuty.execute({
      id,
      description,
      date,
      duration,
      users_id,
    });

    return res.status(201).json(duty);
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const deleteDuty = container.resolve(DeleteDutyService);

    const duty = await deleteDuty.execute({
      id,
    });

    return res.status(201).json(duty);
  }

  public async readUserDuties(req: Request, res: Response): Promise<Response> {
    const { id } = req.token;

    const readUserDuties = container.resolve(ReadUserDutiesService);

    const duties = await readUserDuties.execute(id);

    return res.status(201).json(duties);
  }
}
