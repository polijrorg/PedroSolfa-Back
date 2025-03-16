import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateGroupService from '@modules/groups/services/CreateGroupService';
import ReadAllGroupsService from '@modules/groups/services/ReadAllGroupsService';
import ReadGroupByIdService from '@modules/groups/services/ReadGroupByIdService';
import DeleteGroupService from '@modules/groups/services/DeleteGroupService';
import UpdateGroupService from '@modules/groups/services/UpdateGroupService';
import { generateUserImageUrlbyId } from '@shared/infra/http/middlewares/GenerateUserImageUrl';

export default class GroupController {
  public async create(req: Request, res: Response): Promise<Response> {
    const {
      name,
      description,
      subscription_id,
    } = req.body;

    const { id } = req.token;

    const createGroup = container.resolve(CreateGroupService);

    const group = await createGroup.execute({
      name,
      subscription_id,
      description,
      super_adm_id: id,
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

    // prisma does not considre the fields that I included in the include object's response
    if (group) {
      let image;
        // @ts-ignore
      for (let i = 0; i < group.invited_users.length; i++) {
        // @ts-ignore
        image = await generateUserImageUrlbyId(group.invited_users[i].id);
        // @ts-ignore
        group.invited_users[i].image = image;
      }
      // @ts-ignore
      for (let i = 0; i < group.users.length; i++) {
        // @ts-ignore
        image = await generateUserImageUrlbyId(group.users[i].id);
        // @ts-ignore
        group.users[i].image = image;
      }
      // @ts-ignore
      for (let i = 0; i < group.adms.length; i++) {
        // @ts-ignore
        image = await generateUserImageUrlbyId(group.adms[i].id);
        // @ts-ignore
        group.adms[i].image = image;
      }
    }
    
    return res.status(201).json(group);
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const {
      name,
      description,
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
