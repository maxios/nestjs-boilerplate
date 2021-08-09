import { ApiProperty,  ApiPropertyOptional  } from '@nestjs/swagger';
import { IsEmail, IsEnum, Length, ValidateIf } from 'class-validator';

// the available methods to signup
const providersEnum = ['phone', 'facebook', 'google', 'email'];

export class signupDto {

  @ApiProperty({ enum: providersEnum })
  @IsEnum(providersEnum)
  provider: string

  @ApiPropertyOptional()
  @ValidateIf(o => !o.email)
  @Length(11, undefined, { message: "Phone number must be 11 digits"})
  phoneNumber: string

  @ApiPropertyOptional()
  @ValidateIf(o => o.phoneNumber)
  @Length(4, undefined, { message: "otp must be 4 digits"})
  otp: number

  @ApiPropertyOptional()
  firstName: string

  @ApiPropertyOptional()
  lastName: string

  @ApiPropertyOptional()
  @ValidateIf(o => !o.phoneNumber)
  @IsEmail()
  email: string
}
