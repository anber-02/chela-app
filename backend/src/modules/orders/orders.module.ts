import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrdersService } from './orders.service';
import { OrdersGateway } from './orders.gateway';
import { Order } from './entities/order.entity';
import { OrderDetail } from './entities/order-detail.entity';
import { UserModule } from '../user/user.module';
import { ProductsModule } from '../products/products.module';


@Module({
  providers: [OrdersGateway, OrdersService],
  imports: [TypeOrmModule.forFeature([OrderDetail, Order]), UserModule, ProductsModule]
})
export class OrdersModule {}
