import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateUserService from '@modules/users/services/CreateUserService';
import ReadAllUsersService from '@modules/users/services/ReadAllUsersService';
import ReadUserByIdService from '../../../services/ReadUserByIdService';

export default class UserController {
  public async create(req: Request, res: Response): Promise<Response> {
    const {
      name,
      nickname,
      email,
      cpf,
      profession,
      specialization,
      phone,
      password,
      city,
      state,
    } = req.body;

    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute({
      name,
      nickname,
      email,
      cpf,
      profession,
      specialization,
      phone,
      password,
      city,
      state,
    });

    user.password = '###';

    return res.status(201).json(user);
  }

  public async readAll(req: Request, res: Response): Promise<Response> {

    const readUsers = container.resolve(ReadAllUsersService);

    const users = await readUsers.execute();

    if(users) {
        users.forEach(user => {
        user.password = '###';
      });
    }
    return res.status(201).json(users);
  }

  public async readById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const readUser = container.resolve(ReadUserByIdService);

    const user = await readUser.execute({
      id,
    });

    if(user){
      user.password = '###';
    }

    return res.status(201).json(user);
  }
}
