import prisma from '@shared/infra/prisma/client';
import { Prisma, Duties } from '@prisma/client';

import IDutiesRepository from '@modules/duties/repositories/IDutiesRepository';
import ICreateDutyDTO from '@modules/duties/dtos/ICreateDutyDTO';
import IUpdateDutyDTO from '@modules/duties/dtos/IUpdateDutyDTO';

export default class DutiesRepository implements IDutiesRepository {
  private ormRepository;

  constructor() {
    this.ormRepository = prisma.duties;
  }

  async create(data: ICreateDutyDTO): Promise<Duties> {
    const duty = await this.ormRepository.create({
      data: {
        description: data.description,
        date: data.date,
        duration: data.duration,
        group_id: data.group_id,
      }
    });

    const usersOnDuty = await prisma.usersOnDuty.createMany({
      data: data.users.map((user: { id: string; role?: string }) => ({
      user_id: user.id,
      duty_id: duty.id,
      role: user.role?.toUpperCase()
      })),
      skipDuplicates: true
    });

    const usersOnDutyArray = await prisma.usersOnDuty.findMany({
      where: {
        duty_id: duty.id
      },
      select: {
        id: true,
      }
    });

    const usersOnDutyIds = await usersOnDutyArray.map((user: { id: string }) => user.id);

    return this.ormRepository.update({
      where: { id: duty.id },
      data: {
        usersOnDuty: {
          set: usersOnDutyIds ? usersOnDutyIds.map((id: string) => ({ id })) : []
        }
      },
      include: {
        usersOnDuty: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true
              }
            },
            role: true
          }
        }
      }
    });
  }

  findAll(group_id: string): Promise<Duties[]> {
    return this.ormRepository.findMany({
      where: {
        group_id
      },
      include: {
        usersOnDuty: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true
              }
            },
            role: true
          }
        }
      }
    });
  }

  findById(id: string): Promise<Duties | null> {
    return this.ormRepository.findFirst({ 
      where: { id }, 
      include: {
        usersOnDuty: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true
              }
            },
            role: true
          }
        }
      }
    });
  }

  async delete(id: string): Promise<Duties> {
    await prisma.usersOnDuty.deleteMany({
      where: {
        duty_id: id
      }
    });

    return this.ormRepository.delete({ 
      where: { id }
    });
  }

  async update(id: string, data: IUpdateDutyDTO): Promise<Duties> {
    await prisma.usersOnDuty.deleteMany({
      where: {
        duty_id: id
      }
    });

    const usersOnDuty = await prisma.usersOnDuty.createMany({
      data: data.users.map((user: { id: string; role?: string }) => ({
      user_id: user.id,
      duty_id: id,
      role: user.role?.toUpperCase()
      })),
      skipDuplicates: true
    });

    const usersOnDutyArray = await prisma.usersOnDuty.findMany({
      where: {
        duty_id: id
      },
      select: {
        id: true,
      }
    });

    const usersOnDutyIds = await usersOnDutyArray.map((user: { id: string }) => user.id);

    return this.ormRepository.update({
      where: { id },
      data: {
        description: data.description,
        date: data.date,
        duration: data.duration,
        group_id: data.group_id,
        usersOnDuty: {
          set: usersOnDutyIds ? usersOnDutyIds.map((id: string) => ({ id })) : []
        }
      },
      include: {
        usersOnDuty: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true
              }
            },
            role: true
          }
        }
      }
    });
  }

  findUserDuties(user_id: string): Promise<Duties[]> {
    return this.ormRepository.findMany({
      where: {
        usersOnDuty: {
          some: {
            user: {
              id: user_id
            }
          }
        }
      },
      include: {
        usersOnDuty: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true
              }
            },
            role: true
          }
        }
      }
    });
  }
 
}
