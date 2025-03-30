import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import { inject, injectable } from 'tsyringe';
import ISwitchesRepository from '../repositories/ISwitchesRepository';

@injectable()
class ReadMyPendingReceivedSwitchsService {
  constructor(
    @inject("SwitchesRepository")
    private switchsRepository: ISwitchesRepository,
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(user_id: string) {
    console.log('user_id service', user_id);

    const switchs = await this.switchsRepository.readMyReceivedSwitchesPending(user_id);

    return switchs;
  }
}
export default ReadMyPendingReceivedSwitchsService;
