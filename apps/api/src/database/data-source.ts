import { DataSource } from 'typeorm';
import { dataSourceOptions } from '../config/typeorm.config';

/**
 * Standalone DataSource instance for the TypeORM CLI
 * (migration:generate / migration:run / migration:revert).
 */
// Export exactly one DataSource — the TypeORM CLI rejects a file that exports
// more than one DataSource instance (a named export + a default counts as two).
export const AppDataSource = new DataSource(dataSourceOptions);
