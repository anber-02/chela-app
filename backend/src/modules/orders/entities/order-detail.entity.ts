import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { Product } from "src/modules/products/entities/product.entity";
import { Order } from "./order.entity";


@Entity({name: 'order_detail'})
export class OrderDetail{
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  quantity: number

  @Column({ type: 'float', precision: 10, scale: 2 })
  unit_price: number

  @Column({ type: 'float', precision: 10, scale: 2 })
  total: number

  @ManyToOne(() => Product)
  @JoinColumn({ name: "product_id" })
  product: Product;

  @ManyToOne(() => Order, (order) => order.order_detail)
  @JoinColumn({name:"order_id"})
  order: Order
}
