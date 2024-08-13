import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Role } from 'src/modules/roles/entities/role.entity'
import { Order } from 'src/modules/orders/entities/order.entity'
@Entity({name:"users"})
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  email: string

  @Column()
  password: string

  @Column()
  phone_number: string
  
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @ManyToMany(() => Role, roles => roles.users)
  @JoinTable({
      name: 'rol_user',
      joinColumn: {
        name: 'user_id',
        referencedColumnName: 'id'
      },
      inverseJoinColumn: {
        name: 'rol_id',
        referencedColumnName: "id"
      }
    })
  roles: Role[]

  @OneToMany(() => Order, (order) => order.user)
  order: Order[]
}

