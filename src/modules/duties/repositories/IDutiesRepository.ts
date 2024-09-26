import { Duties } from '@prisma/client';

import ICreateDutyDTO from '../dtos/ICreateDutyDTO';
import IUpdateDutyDTO from '../dtos/IUpdateDutyDTO';

interface IDutiesRepository {
  create(data: ICreateDutyDTO): Promise<Duties>;
  findAll(group_id: string): Promise<Duties[]>;
  findById(id: string): Promise<Duties | null>;
  delete(id: string): Promise<Duties>;
  update(id: string, data: IUpdateDutyDTO): Promise<Duties>;
  findUserDuties(user_id: string): Promise<Duties[]>;
}

export default IDutiesRepository;
