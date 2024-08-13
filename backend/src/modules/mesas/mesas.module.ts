import { Module } from '@nestjs/common';
import { MesasService } from './mesas.service';
import { MesasController } from './mesas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mesa } from './entities/mesa.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Mesa])],
  controllers: [MesasController],
  providers: [MesasService],
})
export class MesasModule { }
