import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SignOptions } from 'jsonwebtoken';

require('dotenv').config();

class ConfigService {

  constructor(private env: { [k: string]: string | undefined }) { }

  private getValue(key: string, throwOnMissing = true): any {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach(k => this.getValue(k, true));
    return this;
  }

  public getPort() {
    return this.getValue('PORT', true);
  }

  public isProduction() {
    const mode = this.getValue('NODE_ENV', false);
    return mode === 'production';
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'mongodb',

      // host: this.getValue('DATABASE_HOST'),
      // port: parseInt(this.getValue('DATABASE_PORT')),
      // username: this.getValue('DATABASE_USER'),
      // password: this.getValue('DATABASE_PASSWORD'),
      // database: this.getValue('DATABASE_NAME'),
      url: this.getValue('DATABASE_URL'),
      // migrationsTableName: 'migration',

      // migrations: ['src/migration/*.ts'],

      // cli: {
      //   migrationsDir: 'src/migration',
      // },

      ssl: this.isProduction(),
    };
  }

  public getJWTConfig() {
    return {
      signOptions: {
        algorithm: this.getValue('JWT_ALGORITHM'),
        expiresIn: this.getValue('JWT_EXPIRES_IN_MINUTES'),
        issuer: this.getValue('JWT_ISSUER'),
        audience: this.getValue('JWT_AUDIENCE'),
      },
      secret: this.getValue('JWT_SECRET')
    };
  }

  public getAWSConfig() {
    return {
        sns: {
          region: "eu-west-1",
          apiVersion: "2010-03-31"
        }
    };
  }

}

const configService = new ConfigService(process.env)
  .ensureValues([
    // 'DATABASE_HOST',
    // 'DATABASE_PORT',
    // 'DATABASE_USER',
    // 'DATABASE_PASSWORD',
    // 'DATABASE_NAME',
    "DATABASE_URL",
    "AWS_ACCESS_KEY_ID",
    "AWS_SECRET_ACCESS_KEY",
    "JWT_ALGORITHM",
    "JWT_SECRET",
    "JWT_EXPIRES_IN_MINUTES",
    "JWT_ISSUER",
    "JWT_AUDIENCE"
  ]);

export { configService };
