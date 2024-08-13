import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "tables"})
export class Mesa {
  @PrimaryGeneratedColumn()
  id:number

  @Column()
  table_number : number
  
  @Column()
  description : string

  @Column()
  capacity: number

  @Column({default: false})
  status : boolean

}
