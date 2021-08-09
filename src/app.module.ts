import { Module, OnApplicationBootstrap } from '@nestjs/common';
import * as chalk from 'chalk'
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShellFacade, ShellModule } from 'nestjs-shell'
import { HelpCommandComponent } from './help.command-component'

// app module
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configService } from './config/config.service';

// auth module
import { AuthModule } from './auth/auth.module';

// users module
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';

@Module({
  imports: [
    ShellModule,
    UsersModule,
    TypeOrmModule.forRoot({
      ...configService.getTypeOrmConfig(),
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule implements OnApplicationBootstrap {
  constructor(private readonly shellFacade: ShellFacade) { }

  public async onApplicationBootstrap(): Promise<void> {
    await this.shellFacade.bootstrap({
      prompt: chalk.red('⤳'),
      messages: {
        notFound: chalk.bgGreen.black.bold(' Sorry, there is no such command as $input '),
        wrongUsage: chalk.yellow.bold(`Wrong usage: $command ${chalk.red('$pattern')}`),
      },
      shellPrinter: (value) => console.log(value),
    })

    this.shellFacade.registerComponents(new HelpCommandComponent(this.shellFacade))
  }
}
