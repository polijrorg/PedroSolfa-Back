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
      users,
    } = req.body;

    const { id } = req.token;

    const createDuty = container.resolve(CreateDutyService);

    const duty = await createDuty.execute({
      solicitor_id: id,
      description,
      date,
      duration,
      group_id,
      users,
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
    const { duty_id } = req.params;
    const { id } = req.token;

    const {
      description,
      date,
      duration,
      users,
    } = req.body;

    const updateDuty = container.resolve(UpdateDutyService);

    const duty = await updateDuty.execute({
      solicitor_id: id,
      id: duty_id,
      description,
      date,
      duration,
      users,
    });

    return res.status(201).json(duty);
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const { duty_id } = req.params;
    const { id } = req.token;

    const deleteDuty = container.resolve(DeleteDutyService);

    const duty = await deleteDuty.execute({
      solicitor_id: id,
      id: duty_id,
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
