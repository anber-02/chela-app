import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { User } from "src/modules/user/entities/user.entity";
import { OrderDetail } from "./order-detail.entity";

@Entity({ name: "orders" })
export class Order {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User, (user) => user.order)
  @JoinColumn({name:"user_id"})
  user: User

  @Column({ type: 'float', precision: 10, scale: 2 })
  total: number;

  @Column({ default: 'pending' })
  status: string

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order)
  order_detail: OrderDetail[]
}