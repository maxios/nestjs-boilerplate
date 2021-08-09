import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, Length, ValidateIf } from 'class-validator';

export class CreateUserDto {
  @ApiPropertyOptional()
  @ValidateIf(o => !o.email)
  @Length(11, undefined, { message: "Phone number must be 13 digits" })
  phoneNumber?: string

  @ApiPropertyOptional()
  firstName?: string

  @ApiPropertyOptional()
  lastName?: string

  @ApiPropertyOptional()
  @ValidateIf(o => !o.phoneNumber)
  @IsEmail()
  email?: string

  @ApiPropertyOptional()
  password?: string
}
