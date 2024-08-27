import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateInviteService from '@modules/invites/services/CreateInviteService';
import ReadInvitesByGroupIdService from '@modules/invites/services/ReadInvitesByGroupIdService';
import DeleteInviteService from '@modules/invites/services/DeleteInviteService';
import AcceptInviteService from '@modules/invites/services/AcceptInviteService';
import RejectInviteService from '@modules/invites/services/RejectInviteService';
import TurnIntoAdmService from '@modules/invites/services/TurnIntoAdmService';

export default class InvitesController {
  public async create(req: Request, res: Response): Promise<Response> {
    const {
      group_id,
      email,
    } = req.body;

    const { id } = req.token;

    const createInvite = container.resolve(CreateInviteService);

    const group = await createInvite.execute({
      id,
      group_id,
      email,
    });

    return res.status(201).json(group);
  }

  public async readAllInvitesByGroup(req: Request, res: Response): Promise<Response> {
    const { group_id } = req.params;
    const { id } = req.token;

    const readUser = container.resolve(ReadInvitesByGroupIdService);

    const user = await readUser.execute({
      id,
      group_id,
    });

    return res.status(201).json(user);
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const { group_id } = req.params;
    const { email } = req.body;
    const { id } = req.token;

    const deleteUser = container.resolve(DeleteInviteService);

    const user = await deleteUser.execute({
      id,
      group_id,
      email,
    });

    return res.status(201).json(user);
  }

  public async accept(req: Request, res: Response): Promise<Response> {
    const { id } = req.token;
    const { group_id } = req.body;

    const acceptInvite = container.resolve(AcceptInviteService);

    const group = await acceptInvite.execute({
      user_id: id,
      group_id,
    });

    return res.status(201).json(group);
  }

  public async reject(req: Request, res: Response): Promise<Response> {
    const { id } = req.token;
    const { group_id } = req.body;

    const rejectInvite = container.resolve(RejectInviteService);

    const group = await rejectInvite.execute({
      user_id: id,
      group_id,
    });

    return res.status(201).json(group);
  }

  public async turnIntoAdm(req: Request, res: Response): Promise<Response> {
    const { group_id } = req.body;
    const { user_id } = req.params;
    const { id } = req.token;

    const turnIntoAdm = container.resolve(TurnIntoAdmService);

    const group = await turnIntoAdm.execute({
      id,
      group_id,
      user_id,
    });

    return res.status(201).json(group);
  }
}
