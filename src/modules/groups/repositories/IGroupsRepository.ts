import { Groups } from '@prisma/client';

import ICreateGroupDTO from '../dtos/ICreateGroupDTO';
import IUpdateGroupDTO from '../dtos/IUpdateGroupDTO';

interface IGroupsRepository {
  create(data: ICreateGroupDTO): Promise<Groups>;
  findAll(): Promise<Groups[]>;
  findById(id: string): Promise<Groups | null>;
  delete(id: string): Promise<Groups>;
  update(id: string, data: IUpdateGroupDTO): Promise<Groups>;
  groupIsFull(id: string): Promise<boolean>;
}

export default IGroupsRepository;
