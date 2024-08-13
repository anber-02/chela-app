import { IsBoolean, IsInt, IsNumber, IsOptional, IsString, Max, Min} from "class-validator"

export class CreateMesaDto {

  @IsNumber()
  table_number : number
  
  @IsString()
  description : string

  @IsNumber()
  @IsInt()
  @Min(1)
  @Max(20)
  capacity: number

  @IsOptional()
  @IsBoolean()
  status ?: boolean
}
