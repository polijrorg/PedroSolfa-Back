import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateSwitchService from '@modules/switches/services/CreateSwitchService';
import ReadSwitchesByDutyIdService from '@modules/switches/services/ReadSwitchesByDutyIdService';
import DeleteSwitchService from '@modules/switches/services/DeleteSwitchService';
import AcceptSwitchService from '@modules/switches/services/AcceptSwitchService';
import RejectSwitchService from '@modules/switches/services/RejectSwitchService';
import ReadSwitchByIdService from '@modules/switches/services/ReadSwitchByIdService';

export default class SwitchesController {
  public async create(req: Request, res: Response): Promise<Response> {
    const {
      new_user_duty_id,
      actual_user_id,
      actual_user_duty_id,
    } = req.body;

    const { id } = req.token;

    const createSwitch = container.resolve(CreateSwitchService);

    const switchEl = await createSwitch.execute({
      new_user_id: id,
      new_user_duty_id,
      actual_user_id,
      actual_user_duty_id,
    });

    return res.status(201).json(switchEl);
  }

  public async readById(req: Request, res: Response): Promise<Response> {
    const { switch_id } = req.params;
    const { id } = req.token;

    const readUser = container.resolve(ReadSwitchByIdService);

    const user = await readUser.execute({
      id,
      switch_id,
    });

    return res.status(201).json(user);
  }

  public async readAllSwitchesByDuty(req: Request, res: Response): Promise<Response> {
    const { duty_id } = req.params;
    const { id } = req.token;

    const readUser = container.resolve(ReadSwitchesByDutyIdService);

    const user = await readUser.execute({
      id,
      duty_id,
    });

    return res.status(201).json(user);
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const { switch_id } = req.params;
    const { id } = req.token;

    const deleteUser = container.resolve(DeleteSwitchService);

    const user = await deleteUser.execute({
      id,
      switch_id,
    });

    return res.status(201).json(user);
  }

  public async accept(req: Request, res: Response): Promise<Response> {
    const { id } = req.token;
    const { switch_id } = req.body;

    const acceptSwitch = container.resolve(AcceptSwitchService);

    const group = await acceptSwitch.execute({
      id,
      switch_id,
    });

    return res.status(201).json(group);
  }

  public async reject(req: Request, res: Response): Promise<Response> {
    const { id } = req.token;
    const { switch_id } = req.body;

    const rejectSwitch = container.resolve(RejectSwitchService);

    const group = await rejectSwitch.execute({
      id,
      switch_id,
    });

    return res.status(201).json(group);
  }
}
