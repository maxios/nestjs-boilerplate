import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    public usersRepository: MongoRepository<User>,
  ) {}

  public create(createUserDto: CreateUserDto): User {
    const user = this.usersRepository.create(createUserDto)

    return user
  }

  public async save(users) {
    return await this.usersRepository.save(users);
  }

  public async findAll(): Promise<User[]> {
    return await this.usersRepository.find()
  }

  public async findOne(id: string): Promise<User> {
    return await this.usersRepository.findOne({ id: id })
  }

  public async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.usersRepository.update({id: id}, updateUserDto)
  }

  public async delete(id: string) {
    return await this.usersRepository.softDelete({ id: id })
  }

  public async findByEmail(email: string): Promise<any> {
    return await this.usersRepository.findOne({ email })
  }

  public async findByPhoneNumber(phoneNumber: string): Promise<any> {
    return await this.usersRepository.findOne({ phoneNumber })
  }
}
