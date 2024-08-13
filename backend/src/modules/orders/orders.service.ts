import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { OrderDetail } from './entities/order-detail.entity';
import { UserService } from '../user/user.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {

  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderDetail)
    private readonly orderDetailRepo: Repository<OrderDetail>,

    private readonly userService: UserService,
    private readonly productService: ProductsService
  ) { }

  async create(createOrderDto: CreateOrderDto) {
    const { user_id, products } = createOrderDto

    // Calcular el total
    let calcularTotal = 0;
    try {
      products.forEach(products => calcularTotal += products.total)
      const user = await this.userService.findOne(user_id)

      const order = this.orderRepo.create({ total: calcularTotal, user })
      await this.orderRepo.save(order)


      const orderDetails = await Promise.all(
        products.map(async product => {
          const productEntity = await this.productService.findOne(product.product_id)
          return this.orderDetailRepo.create({
            ...product, product: productEntity, order: order
          })
        })
      )
      await this.orderDetailRepo.save(orderDetails)

    } catch (e) {
      throw new Error(e)
    }
  }

  async findAll(page: number = 0, size: number = 20) {
    const totalItems = await this.orderRepo.count();
    const orders = await this.orderRepo.find({
      relations: ['order_detail.product', 'user'],
      order: { id: 'DESC' },
      skip: page * size,
      take: size
    })

    return {
      orders: orders,
      totalItems,
      currentPage: page,
      pageSize: size,
    }
  }

  async getOrdersByUser(id: number, page: number = 0, size: number = 20) {
    const user = await this.userService.findOne(id)

    const totalItems = await this.orderRepo.count({
      where: { user: user }
    });

    const orders = await this.orderRepo.find({
      where: { user: user },
      relations: ['order_detail.product', 'user'],
      order: { id: 'DESC' },
      skip: page * size,
      take: size
    })
    return {
      orders: orders,
      totalItems,
      currentPage: page,
      pageSize: size,
    }
  }

  async findOne(id: number) {
    return await this.orderRepo.find({
      where: { id: id },
      relations: ['order_detail.product', 'user']
    })
  }



  async changeStatusOrder(data: { order_id: number, status: string }) {
    const { order_id, status } = data;
    const order = await this.orderRepo.findOne({ where: { id: order_id } });

    if (!order) {
      throw new NotFoundException(`Order with ID ${order_id} not found`);
    }
    order.status = status;
    return this.orderRepo.save(order);
  }


  update(id: number, updateOrderDto: UpdateOrderDto) {
    console.log(updateOrderDto)
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
