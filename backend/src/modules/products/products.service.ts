import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { LessThan, Like, Repository } from 'typeorm';
import { CategoryService } from '../category/category.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private prodRepo: Repository<Product>,
    private categoryService: CategoryService
  ) { }

  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.prodRepo.create(createProductDto);
      await this.prodRepo.save(product);
      return product;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(categoryId: number) {
    try {
      if (!categoryId) {
        const products = await this.prodRepo.find();
        return products;
      }
      const category = await this.categoryService.findOne(categoryId)
      
      const products = await this.prodRepo.find({
        where: { category: category }
      });
      return products;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(ids: number) {
    try {
      const product = await this.prodRepo.findOne({
        where: { id: ids },
      });
      if (!product) {
        throw new NotFoundException(`Product with id ${ids} not found`);
      }
      return product;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      const product = await this.prodRepo.preload({
        id,
        ...updateProductDto,
      });
      await this.prodRepo.save(product);
      return product;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async remove(ids: number) {
    try {
      const product = await this.prodRepo.findOne({
        where: { id: ids },
      });
      if (!product) {
        throw new NotFoundException(`Product with id ${ids} not found`);
      }
      await this.prodRepo.delete(ids);
      return { message: `El producto con el id: ${ids} ha sido eliminado` };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async buscarProducto(termino: string) {
    const buscados = await this.prodRepo.find({
      where: {
        product_name: Like(`%${termino}%`), //Las % Son para indicar que puede estar donde sea,
      },
    });
    return buscados;
  }

  async activeProd(id: number) {
    try {
      const product = await this.prodRepo.findOne({
        where: { id },
      });
      const productActive = await this.prodRepo.preload({
        id,
        is_active: !product.is_active,
      });
      await this.prodRepo.save(productActive);
      return productActive;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async BuscarPorFecha(fecha: Date) {
    return this.prodRepo.find({
      where: {
        created_at: LessThan(fecha),
      },
    });
  }
}
