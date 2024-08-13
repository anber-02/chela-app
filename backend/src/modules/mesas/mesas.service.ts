import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { UpdateMesaDto } from './dto/update-mesa.dto';
import { CreateMesaDto } from './dto/create-mesa.dto';
import { Mesa } from './entities/mesa.entity';

@Injectable()
export class MesasService {

  constructor(
    @InjectRepository(Mesa)
    private readonly mesasRepository: Repository<Mesa>
  ) {

  }

  async create(createMesaDto: CreateMesaDto) {
    try {
      const mesa = this.mesasRepository.create(createMesaDto)
      await this.mesasRepository.save(mesa)
      return mesa

    } catch (e) {
      throw Error(e)
    }

  }

  findAll({ q } = { q: "" }) {
    const values = { disponible: false, ocupado: true }
    const value = values[q] ?? undefined

    if (value) return this.mesasRepository.find({ where: { status: value } })

    return this.mesasRepository.find()
  }

  async findOne(id: number) {
    const mesa = await this.mesasRepository.findOne({ where: { id: id } })
    if (!mesa) throw new NotFoundException()

    return mesa
  }

  async update(id: number, updateMesaDto: UpdateMesaDto) {
    const mesa = await this.mesasRepository.preload({
      id: id, ...updateMesaDto
    })

    await this.mesasRepository.save(mesa)

    return mesa
  }

  async remove(id: number) {
    try {
      const mesa = await this.mesasRepository.findOne({ where: { id: id } });
      console.log(mesa)
      if (!mesa) throw new NotFoundException()

      await this.mesasRepository.remove(mesa)

      return {
        message: "Mesa eliminada correctamente"
      }
    } catch (e) {
      throw e
    }
  }
}
