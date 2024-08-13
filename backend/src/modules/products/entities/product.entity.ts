import { Category } from "src/modules/category/entities/category.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity({name:"products"})
export class Product {
    @PrimaryGeneratedColumn() id: number;
    @Column() product_name: string;
    @Column({ type: 'float', precision: 10, scale: 2 }) price: number;
    @Column() description: string;
    @Column() stock: number;
    @Column({ default: true }) is_active: boolean;
    @Column({ nullable: true }) image: string;
    // @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
    // @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @ManyToOne(() => Category, (cat) => cat.products)
    category: Category;
}
