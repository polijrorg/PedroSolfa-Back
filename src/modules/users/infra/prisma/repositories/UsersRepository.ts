import prisma from '@shared/infra/prisma/client';
import { Prisma, Users } from '@prisma/client';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IUpdateUserDTO from '@modules/users/dtos/IUpdateUserDTO';

export default class UsersRepository implements IUsersRepository {
  private ormRepository;

  constructor() {
    this.ormRepository = prisma.users;
  }
  public async  registeredUsers(ids: string[]): Promise<boolean> {
    const users = await this.ormRepository.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return users.length === ids.length;
  }
 

  public async findByEmailWithRelations(email: string): Promise<Users | null> {
    const user = await this.ormRepository.findFirst({
      where: { email },
      include: {
        invited_groups: {
          select: {
            id: true,
            name: true,
          },
        },
        user_groups: {
          select: {
            id: true,
            name: true,
          },
        },
        invited_adms: {
          select: {
            id: true,
            name: true,
          },
        },
        adm_groups: {
          select: {
            id: true,
            name: true,
          },
        },
        super_groups: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return user;
  }

  public async findByEmailPhoneOrCpf(email: string, phone: string, cpf: string): Promise<Users | null> {
    const user = await this.ormRepository.findFirst({
      where: { OR: [{ email }, { phone }, { cpf }] },
    });

    return user;
  }

  public async create(data: ICreateUserDTO): Promise<Users> {
    const user = await this.ormRepository.create({
      data,
      include: {
        invited_groups: {
          select: {
            id: true,
            name: true,
          },
        },
        user_groups: {
          select: {
            id: true,
            name: true,
          },
        },
        invited_adms: {
          select: {
            id: true,
            name: true,
          },
        },
        adm_groups: {
          select: {
            id: true,
            name: true,
          },
        },
        super_groups: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return user;
  }

  public async findAll(): Promise<Users[]> {
    const users = await this.ormRepository.findMany({
      include: {
        invited_groups: {
          select: {
            id: true,
            name: true,
          },
        },
        user_groups: {
          select: {
            id: true,
            name: true,
          },
        },
        invited_adms: {
          select: {
            id: true,
            name: true,
          },
        },
        adm_groups: {
          select: {
            id: true,
            name: true,
          },
        },
        super_groups: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return users;
  }

  public async findById(id: string): Promise<Users | null> {
    const user = await this.ormRepository.findFirst({
      where: { id },
      include: {
        invited_groups: {
          select: {
            id: true,
            name: true,
          },
        },
        user_groups: {
          select: {
            id: true,
            name: true,
          },
        },
        invited_adms: {
          select: {
            id: true,
            name: true,
          },
        },
        adm_groups: {
          select: {
            id: true,
            name: true,
          },
        },
        super_groups: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return user;
  }

  public async delete(id: string): Promise<Users> {
    await prisma.usersOnDuty.deleteMany({
      where: { user_id: id },
    });

    await prisma.switches.deleteMany({
      where: { new_user_id: id },
    });
    
    const user = await this.ormRepository.delete({
      where: { id },
      include: {
        invited_groups: {
          select: {
            id: true,
            name: true,
          },
        },
        user_groups: {
          select: {
            id: true,
            name: true,
          },
        },
        invited_adms: {
          select: {
            id: true,
            name: true,
          },
        },
        adm_groups: {
          select: {
            id: true,
            name: true,
          },
        },
        super_groups: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return user;
  }

  public async update(id: string, data: IUpdateUserDTO): Promise<Users> {
    const user = await this.ormRepository.update({
      where: { id },
      data,
      include: {
        invited_groups: {
          select: {
            id: true,
            name: true,
          },
        },
        user_groups: {
          select: {
            id: true,
            name: true,
          },
        },
        invited_adms: {
          select: {
            id: true,
            name: true,
          },
        },
        adm_groups: {
          select: {
            id: true,
            name: true,
          },
        },
        super_groups: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return user;
  }
}
