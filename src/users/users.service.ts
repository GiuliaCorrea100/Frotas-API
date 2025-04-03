import { Injectable } from '@nestjs/common';
import { UsersDto } from './users.dto';
import { v4 as uuid } from 'uuid';
import { hashSync as bcryptHashSync } from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly users: UsersDto[] = [];

  create(newUser: UsersDto) {
    newUser.id = uuid();
    newUser.password = bcryptHashSync(newUser.password, 10); //esse 10 indica quantas vezes o script vai
    // ser rodado, quanto maior mais seguro, alterar depois
    this.users.push(newUser);
  }

  findByUsername(username: string): UsersDto | null {
    return this.users.find((user) => user.username === username) || null;
  }
}
