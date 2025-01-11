import { Switches } from '@prisma/client';

import ICreateSwitchDTO from '../dtos/ICreateSwitchDTO';

interface ISwitchesRepository {
  create(data: ICreateSwitchDTO): Promise<Switches>;
  findAll(duty_id: string): Promise<Switches[]>;
  findById(id: string): Promise<Switches | null>;
  delete(id: string): Promise<Switches>;
  switchAlreadyExists(new_user_id: string, new_user_duty_id: string, actual_user_id: string, actual_user_duty_id: string): Promise<Switches | null>;
  acceptSwitch(id: string): Promise<Switches>;
  refuseSwitch(id: string): Promise<Switches>;
}

export default ISwitchesRepository;
