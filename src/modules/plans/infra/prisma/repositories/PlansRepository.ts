import prisma from '@shared/infra/prisma/client';
import { Prisma, Plans } from '@prisma/client';

import IPlansRepository from '@modules/plans/repositories/IPlansRepository';
import ICreatePlanDTO from '@modules/plans/dtos/ICreatePlanDTO';

export default class PlansRepository implements IPlansRepository {
  private ormRepository: Prisma.PlansDelegate<Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>

  constructor() {
    this.ormRepository = prisma.plans;
  }

  public findById(id: string): Promise<Plans | null>{
    return this.ormRepository.findFirst({ where: { id } });
  }

  public create(data: ICreatePlanDTO): Promise<Plans>{
    return this.ormRepository.create({ data });
  }

  public findAll(): Promise<Plans[]>{
    return this.ormRepository.findMany();
  }

  public delete(id: string): Promise<Plans>{
    return this.ormRepository.delete({ where: { id } });
  }
  public update(id: string, data: ICreatePlanDTO): Promise<Plans>{
    return this.ormRepository.update({ where: { id }, data });
  }

}
