import { UseGuards, ServiceUnavailableException, Post, Controller, Get, Param, Res, Body, UsePipes, ValidationPipe, NotFoundException, BadRequestException, Headers } from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AwsService } from '../aws/aws.service';
import { CipherService } from './cipher.service';
import { sendVerificationDto } from './dto/send-verification.dto';
import { signupDto } from './dto/signup.dto';
import { signinDto } from './dto/signin.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from 'src/users/users.service';
import { UpdateWriteOpResult } from 'typeorm';
import { AuthService } from './auth.service';
import { FindAndModifyWriteOpResultObject } from 'typeorm';
import { JwtAuthGuard } from './jwt-auth.guard';
        

@ApiBearerAuth()
@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(
    private userService: UsersService,
    private awsService: AwsService,
    private cipherService: CipherService,
    private authService: AuthService
  ) {}


  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async me(@Headers() headers) {

    console.log(headers)
    return true
  }

  @Post('signin')
  async signin(@Body() body: signinDto) {
    const { provider, otp, ...restBody } = body;

    let result: FindAndModifyWriteOpResultObject;

    switch(provider) {
      case 'phone': {
        result = await this.userService.usersRepository.findOneAndUpdate(
          { phoneNumber: body.phoneNumber, otp },
          { $set: { otp: null } },
        )

        if (!result.lastErrorObject.updatedExisting) {
          throw new NotFoundException()
        }
        
      }
    }

    try {
      return await this.authService.login(result.value)
    } catch(e) {
      console.log(e)
      throw new BadRequestException()
    }
  }

  @Post('signup')
  @UsePipes(new ValidationPipe({ transform: true }))
  async signup(@Body() body: signupDto) {

    const { provider, otp, ...restBody } = body;
    let user: any;

      switch (provider) {
        case 'phone': {
          user = await this.userService.usersRepository.findOneAndUpdate(
            { phoneNumber: body.phoneNumber, otp },
            { $set: { ...restBody, otp: null } },
            { upsert: true }
          )

          if (!user.lastErrorObject.updatedExisting) {
            throw new NotFoundException()
          }

        }
        // add more providers logic here...
      }



    return user.value;
  }

  @Post('send_verification')
  async send_verfication(
    @Body() body: sendVerificationDto,
    @Res() res: Response
  ) {
    const otp: string = this.cipherService.generateOtp().toString();

    try {
      
      // TODO: log the database queries and results
      // create or update existing user with the new otp
      const user: UpdateWriteOpResult = await this.userService.usersRepository.updateOne(
        { phoneNumber: body.phoneNumber },
        { $set: { otp } },
        { upsert: true }
      )

      // TODO: cache the phone number in redis, so that it has an expiration time, and used instead of presisting it in the database (for the first time)
      // send otp as SMS
      await this.awsService.sns_publish({
        PhoneNumber: `+2${body.phoneNumber}`,
        Message: `your verification code ${otp}`
      })
        .then(res => console.log('[SNS][SUCCESS] ', res))
        .catch(error => console.log('[SNS][ERROR] ', error))

      return res.sendStatus(200)
    } catch (e) {
      console.log('error', e)
      throw new ServiceUnavailableException()
    }
  }
}