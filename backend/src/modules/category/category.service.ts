import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {

  constructor(
    @InjectRepository(Category) private CategoryRepo: Repository<Category>,
  ) {
    //Inject the Category entity repository
  }

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const category = this.CategoryRepo.create(createCategoryDto);
      await this.CategoryRepo.save(category);
      return category;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll() {
    try {
      const categories = this.CategoryRepo.find();
      return categories;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(ids: number) {
    try {
      const category = this.CategoryRepo.findOne({
        where: { id: ids },
      });
      if (!category) {
        throw new NotFoundException(`Category with id ${ids} not found`);
      }
      return category;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      const category = await this.CategoryRepo.preload({
        id,
        ...updateCategoryDto,
      });
      await this.CategoryRepo.save(category);
      return category;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async remove(ids: number) {
    try {
      const category = await this.CategoryRepo.findOne({
        where: { id: ids },
      });
      if (!category) {
        throw new NotFoundException(`Category with id ${ids} not found`);
      }
      await this.CategoryRepo.delete(ids);
      return { message: `The category with id: ${ids} has been deleted` };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

}
