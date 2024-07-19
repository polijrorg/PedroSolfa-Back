import prisma from '@shared/infra/prisma/client';
import { Prisma, Groups } from '@prisma/client';

import IInvitesRepository from '@modules/invites/repositories/IInvitesRepository';
import ICreateInviteDTO from '@modules/invites/dtos/ICreateInviteDTO';

export default class InvitesRepository implements IInvitesRepository {
  async findByEmail(group_id: string, email: string): Promise<Groups | null> {
    return await prisma.groups.findUnique({
      where: {
        invited_users: {
          some: { email },
        },
        id: group_id,
      }
    });
  }

  async findGroupById(group_id: string): Promise<Groups | null> {
    return await prisma.groups.findUnique({
      where: {
        id: group_id,
      },
      include: {
        invited_users: {
          select: {
            email: true,
            name: true,
          }
        },
      },
    });
  }

  async create(data: ICreateInviteDTO): Promise<Groups> {
    const user = await prisma.users.findUnique({
      where: {
        email: data.email,
      },
      
    });

    const updatedGroup = await prisma.groups.update({
      where: {
        id: data.group_id,
      },
      data: {
        invited_users: {
          connect: {
            id: user?.id,
          },
        },
      },
      include: {
        invited_users: {
          select: {
            email: true,
            name: true,
          }
        },
      },
    });

    return updatedGroup;
  }

  async findAll(): Promise<Groups[]> {
    return await prisma.groups.findMany({
      include: {
        invited_users: {
          select: {
            email: true,
            name: true,
          }
        },
      },
    });
  }

  async delete(group_id: string, email: string): Promise<Groups> {
    const user = await prisma.users.findUnique({
      where: {
        email: email,
      },
      
    });

    const updatedGroup = await prisma.groups.update({
      where: {
        id: group_id,
      },
      data: {
        invited_users: {
          disconnect: {
            id: user?.id,
          },
        },
      },
      include: {
        invited_users: {
          select: {
            email: true,
            name: true,
          }
        },
      },
    });

    return updatedGroup;
  }
}
