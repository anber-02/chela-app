import { Type } from "class-transformer";
import { IsArray, IsInt, IsNumber, IsPositive, Min, ValidateNested } from "class-validator";

class OrderProducts {
  @IsInt()
  @Min(1)
  quantity: number;

  @IsNumber()
  @IsPositive()
  unit_price: number;

  @IsNumber()
  @IsPositive()
  total: number;

  @IsInt()
  @Min(1)
  product_id: number;
}


export class CreateOrderDto {
  @IsInt()
  @IsNumber()
  @IsPositive()
  @Min(1)
  user_id: number

  @IsNumber()
  @IsPositive()
  total: number

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderProducts)
  products: OrderProducts[]
}
