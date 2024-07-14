import { Groups } from '@prisma/client';

import ICreateGroupDTO from '../dtos/ICreateGroupDTO';
import IUpdateGroupDTO from '../dtos/IUpdateGroupDTO';

interface IGroupsRepository {
  // findByEmailWithRelations(email: string): Promise<Groups | null>;
  // findByEmailPhoneOrCpf(email: string, phone: string, cpf: string): Promise<Groups | null>;
  create(data: ICreateGroupDTO): Promise<Groups>;
  findAll(): Promise<Groups[]>;
  findById(id: string): Promise<Groups | null>;
  delete(id: string): Promise<Groups>;
  update(id: string, data: IUpdateGroupDTO): Promise<Groups>;
}

export default IGroupsRepository;
