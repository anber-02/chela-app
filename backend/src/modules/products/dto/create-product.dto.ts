import { IsNumber, IsOptional, IsPositive, IsString, Min, MinLength } from "class-validator";
import { Category } from "src/modules/category/entities/category.entity";

export class CreateProductDto {
    @MinLength(4)
    @IsString()
    product_name: string;
    @MinLength(12)
    @IsString()
    description: string;
  
    @IsNumber()
    @IsPositive()
    @Min(1)
    price: number;
  
    @IsNumber()
    @IsPositive()
    @Min(1)
    stock: number;

    @IsOptional()
    @IsString()
    image: string
    
    @IsNumber()
    @IsPositive()
    category: Category;
}
