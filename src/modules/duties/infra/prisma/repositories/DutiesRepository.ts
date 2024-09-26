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
  create(data: ICreateDutyDTO): Promise<Duties> {
    return this.ormRepository.create({ 
      data: {
        description: data.description,
        date: data.date,
        duration: data.duration,
        group_id: data.group_id,
        users: {
          connect: data.users_id ? data.users_id.map((id: string) => ({ id })) : []
        }
      },
      include: {
        users: {
          select: {
            id: true,
            name: true
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
        users: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
  }
  findById(id: string): Promise<Duties | null> {
    return this.ormRepository.findFirst({ 
      where: { id }, 
      include: {
        users: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
  }
  delete(id: string): Promise<Duties> {
    return this.ormRepository.delete({ 
      where: { id },
      include: {
        users: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
  }
  update(id: string, data: IUpdateDutyDTO): Promise<Duties> {
    return this.ormRepository.update({
      where: { id },
      data: {
        description: data.description,
        date: data.date,
        duration: data.duration,
        users: {
          set: data.users_id ? data.users_id.map((id: string) => ({ id })) : []
        }
      },
      include: {
        users: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
  }
  findUserDuties(user_id: string): Promise<Duties[]> {
    return this.ormRepository.findMany({
      where: {
        users: {
          some: {
            id: user_id
          }
        }
      },
      include: {
        users: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
  }
 
}
