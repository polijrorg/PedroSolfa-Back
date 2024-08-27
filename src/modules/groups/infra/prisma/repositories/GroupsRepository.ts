import prisma from '@shared/infra/prisma/client';
import { Prisma, Groups } from '@prisma/client';

import IGroupsRepository from '@modules/groups/repositories/IGroupsRepository';
import ICreateGroupDTO from '@modules/groups/dtos/ICreateGroupDTO';
import IUpdateGroupDTO from '@modules/groups/dtos/IUpdateGroupDTO';

export default class GroupsRepository implements IGroupsRepository {
  private ormRepository: Prisma.GroupsDelegate<Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>

  constructor() {
    this.ormRepository = prisma.groups;
  }

  public async create(data: ICreateGroupDTO & { include: { invited_users: { select: { email: true; name: true; }; }; }; }): Promise<Groups> {
    const group = await this.ormRepository.create({
      data: {
        name: data.name,
        super_adm_id: data.super_adm_id,
        subscription: {
          connect: { id: data.subscription_id }
        },
        description: data.description,
      },
      include: {
        invited_users: {
          select: {
            email: true,
            name: true,
          },
        },
        invited_emails: {
          select: {
            email: true,
          },
        },
        users: {
          select: {
            email: true,
            name: true,
          },
        },
        adms: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

    return group;
  }

  public async findAll(): Promise<Groups[]> {
    const groups = await this.ormRepository.findMany({
      include: {
        invited_users: {
          select: {
            email: true,
            name: true,
          },
        },
        invited_emails: {
          select: {
            email: true,
          },
        },
        users: {
          select: {
            email: true,
            name: true,
          },
        },
        adms: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

    return groups;
  }

  public async findById(id: string): Promise<Groups | null> {
    const group = await this.ormRepository.findFirst({
      where: { id },
      include: {
        invited_users: {
          select: {
            email: true,
            name: true,
          },
        },
        invited_emails: {
          select: {
            email: true,
          },
        },
        users: {
          select: {
            email: true,
            name: true,
          },
        },
        adms: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

    return group;
  }

  public async delete(id: string): Promise<Groups> {
    const group = await this.ormRepository.delete({
      where: { id },
      include: {
        invited_users: {
          select: {
            email: true,
            name: true,
          },
        },
        invited_emails: {
          select: {
            email: true,
          },
        },
        users: {
          select: {
            email: true,
            name: true,
          },
        },
        adms: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

    return group;
  }

  public async update(id: string, data: IUpdateGroupDTO): Promise<Groups> {
    const group = await this.ormRepository.update({
      where: { id },
      data,
      include: {
        invited_users: {
          select: {
            email: true,
            name: true,
          },
        },
        invited_emails: {
          select: {
            email: true,
          },
        },
        users: {
          select: {
            email: true,
            name: true,
          },
        },
        adms: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

    return group;
  }
}
