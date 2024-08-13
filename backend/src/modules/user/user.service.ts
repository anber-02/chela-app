import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private rolesService: RolesService
  ) { }

  async create(createUserDto: CreateUserDto) {
    const user =  this.userRepository.create(createUserDto)

    const userRole = await this.rolesService.findOneByName('user')
    if (userRole) {
      user.roles = [userRole]
    }


    await this.userRepository.save(user)
    return user
  }

  findAll() {
    return this.userRepository.find({
      relations: { roles: true }
    })
  }

  findOne(id: number) {
    return this.userRepository.findOne({
      where: { id: id },
      relations: {
        roles: true
      }
    })
  }

  findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
      relations: {
        roles: true
      }
    })
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.preload({
      id: id, ...updateUserDto
    })
    await this.userRepository.save(user)

    return user
  }

  remove(id: number) {
    try {
      this.userRepository.delete(id);
    } catch (e) {
      throw new Error(e)
    }

    return { message: 'Usuario eliminado' }
  }
  async assignRolToUse(data: { user_id: number, rol_id: number }) {
    const { user_id, rol_id } = data
    const user = await this.userRepository.findOne({ where: { id: user_id }, relations: { roles: true } })
    if (!user) {
      throw new Error('User not found');
    }
    const role = await this.rolesService.findOne(rol_id)

    if (!role) {
      throw new Error('Role not found');
    }

    user.roles.push(role)
    await this.userRepository.save(user)

    return {message: 'Role assigned successfully' }
  }
}
