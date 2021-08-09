import bcrypt from 'bcrypt-nodejs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CipherService {

  constructor() { }

  /**
   * Hash the password field of the passed user.
   */
  hashPassword(user) {
    if (user.password) {
      user.password = bcrypt.hashSync(user.password);
    }
  }

  /**
   * Compare user password hash with unhashed password
   * @returns boolean indicating a match
   */
  comparePassword(password, user){
    return bcrypt.compareSync(password, user.password);
  }

  generateOtp(): number {
    return Math.floor(1000 + Math.random() * 9000)
  }
}
