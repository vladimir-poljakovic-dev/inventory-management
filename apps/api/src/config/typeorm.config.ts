import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { config as loadEnv } from 'dotenv';
import { DataSourceOptions } from 'typeorm';

// Load .env so the standalone DataSource used by the TypeORM CLI sees DB credentials.
// At runtime ConfigModule also loads these; calling dotenv here is harmless/idempotent.
loadEnv();

// Glob both .ts (ts-node CLI) and .js (compiled runtime) so the same config works everywhere.
const entities = [__dirname + '/../**/*.entity{.ts,.js}'];
const migrations = [__dirname + '/../database/migrations/*{.ts,.js}'];

/**
 * Plain options object consumed by the TypeORM CLI via `database/data-source.ts`.
 * Reads straight from process.env because the CLI runs outside the Nest DI container.
 */
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities,
  migrations,
  // Never enable synchronize — all schema changes go through migrations.
  synchronize: false,
};

/**
 * Provides TypeOrmModule options inside Nest, sourcing every value from ConfigService.
 */
@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly config: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.config.get<string>('DATABASE_HOST'),
      port: this.config.get<number>('DATABASE_PORT'),
      username: this.config.get<string>('DATABASE_USER'),
      password: this.config.get<string>('DATABASE_PASSWORD'),
      database: this.config.get<string>('DATABASE_NAME'),
      entities,
      migrations,
      // Hardcoded — never sourced from env.
      synchronize: false,
    };
  }
}
