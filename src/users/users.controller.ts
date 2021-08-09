import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = this.usersService.create(createUserDto);

    await this.usersService.save(user);

    return user
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user: User = await this.usersService.findOne(id);

    if (!user) throw new NotFoundException()

    return this.usersService.update(user.id, updateUserDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const user: User = await this.usersService.findOne(id);

    if (!user) throw new NotFoundException()

    await this.usersService.delete(user.id)

    return user
  }
}
