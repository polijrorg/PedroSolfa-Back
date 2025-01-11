import { Groups, Duties } from '@prisma/client';

import ICreateDutyDTO from '../dtos/ICreateDutyDTO';
import IUpdateDutyDTO from '../dtos/IUpdateDutyDTO';

export type UserOnDuty = {
  id: string;
  role: string | null;
  user: {id: string};
};

export type OmittedDutyWithUsers = Omit<Duties, 'id' | 'group_id'> & {
  users: UserOnDuty[];
};

interface IDutiesRepository {
  create(data: ICreateDutyDTO): Promise<Duties>;
  findAll(group_id: string): Promise<Duties[]>;
  findById(id: string): Promise<Duties | null>;
  findOmittedDuty(id: string): Promise<OmittedDutyWithUsers | null>;
  delete(id: string): Promise<Duties>;
  update(id: string, data: IUpdateDutyDTO): Promise<Duties>;
  findUserDuties(user_id: string): Promise<Duties[]>;
  findUserDuty(user_id: string, duty_id: string): Promise<Duties | null>;
  dutiesOnSameGroup(actual_user_duty_id: string, new_user_duty_id: string): Promise<Groups | null>;
  switchUsersOnDuty(actual_user_id: string, actual_user_duty_id: string, new_user_id: string, new_user_duty_id: string): Promise<Duties[]>;
}

export default IDutiesRepository;
