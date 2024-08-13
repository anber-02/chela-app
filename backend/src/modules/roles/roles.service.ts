import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>
  ) { }

  async create(value: CreateRoleDto) {
    const rol = this.rolesRepository.create(value)

    await this.rolesRepository.save(rol)
    return rol
  }

  findAll() {
    return this.rolesRepository.find()
  }
  findOne(id: number) {
    return this.rolesRepository.findOne({ where: { id: id } })
  }
  findOneByName(name: string) {
    return this.rolesRepository.findOne({ where: { rol: name } })
  }

  async update(id: number, updateUserDto: UpdateRoleDto) {
    const user = await this.rolesRepository.preload({
      id: id, ...updateUserDto
    })
    await this.rolesRepository.save(user)

    return user
  }

  remove(id: number) {
    try {
      this.rolesRepository.delete(id);
    } catch (e) {
      throw new Error(e)
    }

    return { message: 'rol eliminado' }
  }

}
