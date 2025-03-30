import prisma from '@shared/infra/prisma/client';
import { Switches } from '@prisma/client';

import ISwitchesRepository from '@modules/switches/repositories/ISwitchesRepository';
import ICreateInviteDTO from '@modules/switches/dtos/ICreateSwitchDTO';

export default class SwitchesRepository implements ISwitchesRepository {
  create(data: ICreateInviteDTO): Promise<Switches> {
    return prisma.switches.create({
      data: {
        new_user_id: data.new_user_id,
        new_user_duty_id: data.new_user_duty_id,
        actual_user_id: data.actual_user_id,
        actual_user_duty_id: data.actual_user_duty_id,
        analized: false,
        accepted: false,
      },
    });
  }

  findAll(duty_id: string): Promise<Switches[]> {
    return prisma.switches.findMany({
      where: {
        OR: [
          { new_user_duty_id: duty_id },
          { actual_user_duty_id: duty_id },
        ],
      },
    });
  }

  findById(id: string): Promise<Switches | null> {
    return prisma.switches.findUnique({
      where: {
        id,
      },
    });
  }

  delete(id: string): Promise<Switches> {
    return prisma.switches.delete({
      where: {
        id,
      },
    });
  }

  switchAlreadyExists(new_user_id: string, new_user_duty_id: string, actual_user_id: string, actual_user_duty_id: string): Promise<Switches | null> {
    return prisma.switches.findFirst({
      where: {
        new_user_id,
        new_user_duty_id,
        actual_user_id,
        actual_user_duty_id,
      },
    });
  }

  acceptSwitch(id: string): Promise<Switches> {
    return prisma.switches.update({
      where: {
        id,
      },
      data: {
        accepted: true,
        analized: true,
      },
    });
  }

  refuseSwitch(id: string): Promise<Switches> {
    return prisma.switches.update({
      where: {
        id,
      },
      data: {
        accepted: false,
        analized: true,
      },
    });
  }

  readMySentSwitchesAnalyzed(user_id: string): Promise<Switches[]> {
    return prisma.switches.findMany({
      where: {
        actual_user_id: user_id,
        accepted: true,
      },
    });
  }

  readMySentSwitchesPending(user_id: string): Promise<Switches[]> {
    return prisma.switches.findMany({
      where: {
        actual_user_id: user_id,
        accepted: false,
      },
    });
  }

  readMyReceivedSwitchesAnalyzed(user_id: string): Promise<Switches[]> {
    return prisma.switches.findMany({
      where: {
        new_user_id: user_id,
        accepted: true,
      },
    });
  }

  readMyReceivedSwitchesPending(user_id: string): Promise<Switches[]> {
    console.log('user_id', user_id);
    return prisma.switches.findMany({
      where: {
        new_user_id: user_id,
        accepted: false,
      },
    });
  }
}
