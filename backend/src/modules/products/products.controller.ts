import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll(@Query('category') category: number ) {
    return this.productsService.findAll(category);
  }

  @Get('/search')
  search(@Query('termino') termino: string) {
    return this.productsService.buscarProducto(termino);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Get('/byfecha')
  buscarPorFecha(@Query('date') date: string) {
    const fechaTrans = new Date(date);
    return this.productsService.BuscarPorFecha(fechaTrans);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Patch(':id/activar')
  activar(@Param('id') id: string) {
    this.productsService.activeProd(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
