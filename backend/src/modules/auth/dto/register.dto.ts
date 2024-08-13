import {  IsEmail, IsPhoneNumber, IsString, MinLength } from 'class-validator'

export class RegisterDto {
  @MinLength(3)
  @IsString()
  name: string

  @IsEmail()
  email: string

  @MinLength(8)
  @IsString()
  password: string

  @IsPhoneNumber()
  phone_number: string
}
