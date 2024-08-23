import prisma from '@shared/infra/prisma/client';
import { Prisma, Groups, InvitedEmails } from '@prisma/client';

import IInvitesRepository from '@modules/invites/repositories/IInvitesRepository';
import ICreateInviteDTO from '@modules/invites/dtos/ICreateInviteDTO';

export default class InvitesRepository implements IInvitesRepository {
  async findByEmail(group_id: string, email: string): Promise<Groups | null> {
    return await prisma.groups.findUnique({
      where: {
        id: group_id,
        OR: [
          {
            invited_users: {
              some: { email },
            },
          },
          {
            invited_emails: {
              some: { email },
            },
          },
        ],
      },
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
          },
        },
        invited_emails: {
          select: {
            email: true,
          },
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

    let updatedGroup: Groups;

    if (user) {
      updatedGroup = await prisma.groups.update({
        where: {
          id: data.group_id,
        },
        data: {
          invited_users: {
            connect: {
              id: user.id,
            },
          },
        },
        include: {
          invited_users: {
            select: {
              email: true,
              name: true,
            },
          },
        },
      });
    } else {
      const invite = await prisma.invitedEmails.create({ data });
      updatedGroup = await prisma.groups.update({
        where: {
          id: data.group_id,
        },
        data: {
          invited_emails: {
            connect: {
              id: invite.id,
            },
          },
        },
        include: {
          invited_emails: {
            select: {
              email: true,
            },
          },
        },
      });
    }

    return updatedGroup;
  }

  async findAll(): Promise<Groups[]> {
    return await prisma.groups.findMany({
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
      },
    });
  }

  async delete(group_id: string, email: string): Promise<Groups> {
    const user = await prisma.users.findUnique({
      where: {
        email,
      },

    });

    let updatedGroup: Groups;

    if (user) {
      updatedGroup = await prisma.groups.update({
        where: {
          id: group_id,
        },
        data: {
          invited_users: {
            disconnect: {
              id: user.id,
            },
          },
        },
        include: {
          invited_users: {
            select: {
              email: true,
              name: true,
            },
          },
        },
      });
    } else {
      const invite = await prisma.invitedEmails.findFirst({ where: { email } });
      updatedGroup = await prisma.groups.update({
        where: {
          id: group_id,
        },
        data: {
          invited_emails: {
            delete: {
              id: invite?.id,
            },
          },
        },
        include: {
          invited_emails: {
            select: {
              email: true,
            },
          },
        },
      });
    }

    return updatedGroup;
  }

  async updateInvites(email: string): Promise<Groups[]> {
    const user = await prisma.users.findUnique({
      where: {
        email,
      },
    });

    const invites = await prisma.invitedEmails.findMany({
      where: {
        email,
      },
    });

    return await Promise.all(invites.map(async (invite) => await prisma.groups.update({
      where: {
        id: invite.group_id,
      },
      data: {
        invited_emails: {
          delete: {
            id: invite.id,
          },
        },
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
          },
        },
        invited_emails: {
          select: {
            email: true,
          },
        },
      },
    })));
  }

  async acceptInvite(group_id: string, user_id: string): Promise<Groups> {
    return await prisma.groups.update({
      where: {
        id: group_id,
      },
      data: {
        invited_users: {
          disconnect: {
            id: user_id,
          },
        },
        users: {
          connect: {
            id: user_id,
          },
        },
      },
      include: {
        invited_users: {
          select: {
            email: true,
            name: true,
          },
        },
        users: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });
  }

  async isAlreadyUser(group_id: string, user_id: string): Promise<Groups | null> {
    return await prisma.groups.findUnique({
      where: {
        id: group_id,
        users: {
          some: { id: user_id },
        }, 
      },
    });
  }

  async isAlreadyAdm(group_id: string, id: string): Promise<Groups | null> {
    return await prisma.groups.findUnique({
      where: {
        id: group_id,
        adms: {
          some: { id },
        }, 
      },
    });
  }

  async turnIntoAdm(group_id: string, user_id: string): Promise<Groups> {
    return await prisma.groups.update({
      where: {
        id: group_id,
      },
      data: {
        users: {
          disconnect: {
            id: user_id,
          },
        },
        adms: {
          connect: {
            id: user_id,
          },
        },
      },
      include: {
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
  }

  async defaultAdm(group_id: string, user_id: string): Promise<Groups> {
    return await prisma.groups.update({
      where: {
        id: group_id,
      },
      data: {
        adms: {
          connect: {
            id: user_id,
          },
        },
      },
      include: {
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
  }
}
