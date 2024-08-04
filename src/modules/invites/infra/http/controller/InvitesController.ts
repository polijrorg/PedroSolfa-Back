import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateInviteService from '@modules/invites/services/CreateInviteService';
import ReadInvitesByGroupIdService from '@modules/invites/services/ReadInvitesByGroupIdService';
import DeleteInviteService from '@modules/invites/services/DeleteInviteService';

export default class InvitesController {
  public async create(req: Request, res: Response): Promise<Response> {
    const {
      group_id,
      email,
    } = req.body;

    const createInvite = container.resolve(CreateInviteService);

    const group = await createInvite.execute({
      group_id,
      email,
    });

    return res.status(201).json(group);
  }

  public async readAllInvitesByGroup(req: Request, res: Response): Promise<Response> {
    const { group_id } = req.params;

    const readUser = container.resolve(ReadInvitesByGroupIdService);

    const user = await readUser.execute({
      group_id,
    });

    return res.status(201).json(user);
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const { group_id } = req.params;
    const { email } = req.body;

    const deleteUser = container.resolve(DeleteInviteService);

    const user = await deleteUser.execute({
      group_id,
      email,
    });

    return res.status(201).json(user);
  }
}
