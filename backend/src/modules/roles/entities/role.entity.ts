import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm"
import { User } from "src/modules/user/entities/user.entity"

@Entity({name: "roles"})
export class Role {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  rol: string
  
  @ManyToMany(() => User, user => user.roles)
  users: User[]
}
