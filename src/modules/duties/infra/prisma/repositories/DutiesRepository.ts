import prisma from '@shared/infra/prisma/client';
import { Prisma, Duties, Groups } from '@prisma/client';

import IDutiesRepository from '@modules/duties/repositories/IDutiesRepository';
import ICreateDutyDTO from '@modules/duties/dtos/ICreateDutyDTO';
import IUpdateDutyDTO from '@modules/duties/dtos/IUpdateDutyDTO';
import IUserOnDuty from '@modules/duties/dtos/IUserOnDutyDTO';
import { OmittedDutyWithUsers } from '@modules/duties/repositories/IDutiesRepository';

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
  
  findUserDuty(user_id: string, duty_id: string): Promise<Duties | null> {
    return this.ormRepository.findFirst({
      where: {
        id: duty_id,
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

  async dutiesOnSameGroup(actual_user_duty_id: string, new_user_duty_id: string): Promise<Groups | null> {
    const actualUserGroup = await this.ormRepository.findFirst({
      where: {
        id: actual_user_duty_id
      },
      select: {
        group_id: true
      }
    });
    const newUserGroup = await this.ormRepository.findFirst({
      where: {
        id: new_user_duty_id
      },
      select: {
        group_id: true
      }
    });

    return (actualUserGroup && newUserGroup && actualUserGroup.group_id === newUserGroup.group_id)?
      prisma.groups.findFirst({
        where: {
          id: actualUserGroup.group_id
        }}) 
      : null;
  }

  public async findOmittedDuty(id: string): Promise<OmittedDutyWithUsers | null> {
    const omittedDuty = await this.ormRepository.findFirst({ 
      where: { id }, 
      include: {
        usersOnDuty: {
          select: {
            id: true,
            role: true,
            user: {
              select: {
                id: true,
              }
            },
          }
        }
      }
    });
    
    if (!omittedDuty) return null;

    return { ...omittedDuty, users: omittedDuty.usersOnDuty };
  }

  async switchUsersOnDuty(actual_user_id: string, actual_user_duty_id: string, new_user_id: string, new_user_duty_id: string): Promise<Duties[]> {
    const actualUserDuty = await this.findOmittedDuty(actual_user_duty_id);
    const newUserDuty = await this.findOmittedDuty(new_user_duty_id);
    if (!actualUserDuty || !newUserDuty) return [];

    const actualUserDutyIndex = actualUserDuty.users.findIndex(userOnDuty => userOnDuty.user.id === actual_user_id);
    if (actualUserDutyIndex === -1) return [];

    const newUserDutyIndex = newUserDuty.users.findIndex(userOnDuty => userOnDuty.user.id === new_user_id);
    if (newUserDutyIndex === -1) return [];

    actualUserDuty.users[actualUserDutyIndex].user.id = new_user_id;
    newUserDuty.users[newUserDutyIndex].user.id = actual_user_id;

    const updatedActualUserDuty = await this.update(actual_user_duty_id, {
      description: actualUserDuty.description,
      date: actualUserDuty.date,
      duration: actualUserDuty.duration,
      users: actualUserDuty.users.map(user => ({ id: user.user.id, role: user.role ?? undefined }))
    });

    const updatedNewUserDuty = await this.update(new_user_duty_id, {
      description: newUserDuty.description,
      date: newUserDuty.date,
      duration: newUserDuty.duration,
      users: newUserDuty.users.map(user => ({ id: user.user.id, role: user.role ?? undefined }))
    });

    return [updatedActualUserDuty, updatedNewUserDuty];
  }

  async findDutyByUserOnDutyId(user_on_duty_id: string): Promise<IUserOnDuty | null> {
    const duty = await this.ormRepository.findFirst({
      where: {
        usersOnDuty: {
          some: {
            id: user_on_duty_id
          }
        }
      }, 
      include: {
        usersOnDuty: {
          select: {
            id: true,
            role: true,
            user: {
              select: {
                id: true,
              }
            },
          }
        }
      }
    });

    if (duty){
      // @ts-ignore
      for (const userOnDuty of duty.usersOnDuty){
        if (userOnDuty.id === user_on_duty_id){
          // @ts-ignore
          return { // @ts-ignore
            user_id: userOnDuty.user.id, // @ts-ignore
            duty_id: duty.id,
          }
        }
      }
    }

    return null;
  }
}
