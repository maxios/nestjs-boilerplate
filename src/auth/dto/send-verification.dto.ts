import { ApiProperty,  ApiPropertyOptional  } from '@nestjs/swagger';

export class sendVerificationDto {
  @ApiProperty()
  phoneNumber: string
}