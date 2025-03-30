import prisma from '@shared/infra/prisma/client';
import { Groups } from '@prisma/client';

import IGroupsRepository from '@modules/groups/repositories/IGroupsRepository';
import ICreateGroupDTO from '@modules/groups/dtos/ICreateGroupDTO';
import IUpdateGroupDTO from '@modules/groups/dtos/IUpdateGroupDTO';

export default class GroupsRepository implements IGroupsRepository {
  private ormRepository;

  constructor() {
    this.ormRepository = prisma.groups;
  }

  public async updateImage(id: string, image?: string | null): Promise<Groups> {
    console.log(image);
    const group = await this.ormRepository.update({
      where: { id },
      data: {
        image,
      },
      include: {
        invited_users: {
          select: {
            id: true,
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
            id: true,
            email: true,
            name: true,
          },
        },
        adms: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        duties: {
          select: {
            id: true,
            description: true,
            date: true,
            duration: true,
            usersOnDuty: {
              select: {
                id: true,
                user: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
                role: true,
              },
            },
          },
        },
      },
    });

    return group;
  }

  public async create(data: ICreateGroupDTO & { include: { invited_users: { select: { email: true; name: true; }; }; }; }): Promise<Groups> {
    const group = await this.ormRepository.create({
      data: {
        name: data.name,
        super_adm_id: data.super_adm_id,
        subscription: {
          connect: { id: data.subscription_id },
        },
        description: data.description,
      },
      include: {
        invited_users: {
          select: {
            id: true,
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
            id: true,
            email: true,
            name: true,
          },
        },
        adms: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        duties: {
          select: {
            id: true,
            description: true,
            date: true,
            duration: true,
            usersOnDuty: {
              select: {
                id: true,
                user: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
                role: true,
              },
            },
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
            id: true,
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
            id: true,
            email: true,
            name: true,
          },
        },
        adms: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        duties: {
          select: {
            id: true,
            description: true,
            date: true,
            duration: true,
            usersOnDuty: {
              select: {
                id: true,
                user: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
                role: true,
              },
            },
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
            id: true,
            email: true,
            phone: true,
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
            id: true,
            phone: true,
            email: true,
            name: true,
          },
        },
        adms: {
          select: {
            id: true,
            phone: true,
            email: true,
            name: true,
          },
        },
        duties: {
          select: {
            id: true,
            description: true,
            date: true,
            duration: true,
            usersOnDuty: {
              select: {
                id: true,
                user: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
                role: true,
              },
            },
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
            id: true,
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
            id: true,
            email: true,
            name: true,
          },
        },
        adms: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        duties: {
          select: {
            id: true,
            description: true,
            date: true,
            duration: true,
            usersOnDuty: {
              select: {
                id: true,
                user: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
                role: true,
              },
            },
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
            id: true,
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
            id: true,
            email: true,
            name: true,
          },
        },
        adms: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        duties: {
          select: {
            id: true,
            description: true,
            date: true,
            duration: true,
            usersOnDuty: {
              select: {
                user: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return group;
  }

  public async groupIsFull(id: string): Promise<boolean> {
    const group = await this.ormRepository.findFirst({
      where: { id },
      include: {
        invited_users: {
          select: {
            id: true,
          },
        },
        invited_emails: {
          select: {
            email: true,
          },
        },
        users: {
          select: {
            id: true,
          },
        },
        adms: {
          select: {
            id: true,
          },
        },
        subscription: {
          select: {
            plan: {
              select: {
                max_users: true,
              },
            },
          },
        },
      },
    });

    if (!group) return false;

    const totalMembers = group.invited_users.length + group.invited_emails.length + group.users.length + group.adms.length;
    return group.subscription ? totalMembers >= group.subscription.plan.max_users : false;
  }
}
