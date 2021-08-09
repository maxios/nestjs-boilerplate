import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { AwsService } from '../aws/aws.service';
import { AuthController } from './auth.controller';
import { CipherService } from './cipher.service';
import { JwtModule } from '@nestjs/jwt';
import { configService } from 'src/config/config.service';


@Module({
  imports: [
    UsersModule, 
    PassportModule,
    JwtModule.register({
      secret: configService.getJWTConfig().secret,
      signOptions: configService.getJWTConfig().signOptions,
    })
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    LocalStrategy, 
    JwtStrategy,
    AwsService, 
    CipherService
  ]
})
export class AuthModule {}
