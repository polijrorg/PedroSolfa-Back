import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateSwitchService from '@modules/switches/services/CreateSwitchService';
import ReadSwitchesByDutyIdService from '@modules/switches/services/ReadSwitchesByDutyIdService';
import DeleteSwitchService from '@modules/switches/services/DeleteSwitchService';
import AcceptSwitchService from '@modules/switches/services/AcceptSwitchService';
import RejectSwitchService from '@modules/switches/services/RejectSwitchService';
import ReadSwitchByIdService from '@modules/switches/services/ReadSwitchByIdService';
import ReadMyPendingSentSwitchsService from '@modules/switches/services/ReadMyPendingSentSwitchsService';
import ReadMyPendingReceivedSwitchsService from '@modules/switches/services/ReadMyPendingReceivedSwitchsService';
import ReadMyAceptedSentSwitchsService from '@modules/switches/services/ReadMyAceptedSentSwitchsService';
import ReadMyAceptedReceivedSwitchsService from '@modules/switches/services/ReadMyAceptedReceivedSwitchsService';

export default class SwitchesController {
  public async create(req: Request, res: Response): Promise<Response> {
    const {
      user_on_duty_id,
      user_on_another_duty_id,
    } = req.body;

    const { id } = req.token;

    const createSwitch = container.resolve(CreateSwitchService);

    const switchEl = await createSwitch.execute({
      user_on_duty_id,
      user_on_another_duty_id,
    });

    return res.status(201).json(switchEl);
  }

  public async readPendingSentSwitches(req: Request, res: Response): Promise<Response> {
    const { id } = req.token;

    const readUser = container.resolve(ReadMyPendingSentSwitchsService);

    const user = await readUser.execute(
      id,
    );

    return res.status(201).json(user);
  }

  public async readPendingReceivedSwitches(req: Request, res: Response): Promise<Response> {
    const { id } = req.token;

    const readUser = container.resolve(ReadMyPendingReceivedSwitchsService);

    const user = await readUser.execute(
      id,
    );

    return res.status(201).json(user);
  }

  public async readActiveSentSwitches(req: Request, res: Response): Promise<Response> {
    const { id } = req.token;

    const readUser = container.resolve(ReadMyAceptedSentSwitchsService);

    const user = await readUser.execute(
      id,
    );

    return res.status(201).json(user);
  }

  public async readActiveReceivedSwitches(req: Request, res: Response): Promise<Response> {
    const { id } = req.token;

    const readUser = container.resolve(ReadMyAceptedReceivedSwitchsService);

    const user = await readUser.execute(
      id,
    );

    return res.status(201).json(user);
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
