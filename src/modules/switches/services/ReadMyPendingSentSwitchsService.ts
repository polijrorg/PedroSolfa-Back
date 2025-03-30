import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import { inject, injectable } from 'tsyringe';
import ISwitchesRepository from '../repositories/ISwitchesRepository';

@injectable()
class ReadMyPendingSentSwitchsService {
  constructor(
    @inject("SwitchesRepository")
    private switchsRepository: ISwitchesRepository,
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(user_id: string) {
    const switchs = await this.switchsRepository.readMySentSwitchesPending(user_id);

    return switchs;
  }
}
export default ReadMyPendingSentSwitchsService;
