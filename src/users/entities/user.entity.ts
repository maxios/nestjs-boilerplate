import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../entities/base.entity';

@Entity({ name: 'users' })
export class User extends BaseEntity {

  @Column({ unique: true })
  phoneNumber: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  photo: string;

  @Column({ nullable: true })
  otp: string;

  @Column({ nullable: true })
  activation_code: string;

  @Column({ default: false })
  activated: boolean;

  @Column({ nullable: true })
  roles: string;
}
