import { IsString, MinLength } from "class-validator";

export class CreateCategoryDto {
    @MinLength(4)
    @IsString()
    name: string;
    @MinLength(8)
    @IsString()
    description: string;
}
