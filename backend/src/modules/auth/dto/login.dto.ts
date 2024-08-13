import { MinLength, IsString, IsEmail } from "class-validator"

export class LoginDto{
  @IsString()
  @IsEmail()
  email: string

  @IsString()
  @MinLength(8)
  pass: string
}