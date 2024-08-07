import { Plans } from '@prisma/client';

import ICreatePlanDTO from '../dtos/ICreatePlanDTO';

interface IPlansRepository {
  findById(id: string): Promise<Plans | null>;
  create(data: ICreatePlanDTO): Promise<Plans>;
  findAll(): Promise<Plans[]>;
  delete(id: string): Promise<Plans>;
  update(id: string, data: ICreatePlanDTO): Promise<Plans>;
}

export default IPlansRepository;
