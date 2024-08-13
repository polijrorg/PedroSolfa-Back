import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateGroupService from '@modules/groups/services/CreateGroupService';
import ReadAllGroupsService from '@modules/groups/services/ReadAllGroupsService';
import ReadGroupByIdService from '@modules/groups/services/ReadGroupByIdService';
import DeleteGroupService from '@modules/groups/services/DeleteGroupService';
import UpdateGroupService from '@modules/groups/services/UpdateGroupService';

export default class GroupController {
  public async create(req: Request, res: Response): Promise<Response> {
    const {
      name,
      super_adm_id,
    } = req.body;

    const createGroup = container.resolve(CreateGroupService);

    const group = await createGroup.execute({
      name,
      super_adm_id,
    });

    return res.status(201).json(group);
  }

  public async readAll(req: Request, res: Response): Promise<Response> {
    const readGroups = container.resolve(ReadAllGroupsService);

    const groups = await readGroups.execute();

    return res.status(201).json(groups);
  }

  public async readById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const readGroup = container.resolve(ReadGroupByIdService);

    const group = await readGroup.execute({
      id,
    });

    return res.status(201).json(group);
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const {
      name,
    } = req.body;

    const updateGroup = container.resolve(UpdateGroupService);

    const group = await updateGroup.execute({
      id,
      name,
    });

    return res.status(201).json(group);
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const deleteGroup = container.resolve(DeleteGroupService);

    const group = await deleteGroup.execute({
      id,
    });

    return res.status(201).json(group);
  }
}
