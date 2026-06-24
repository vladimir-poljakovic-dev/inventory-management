import { DataSource } from 'typeorm';
import { dataSourceOptions } from '../config/typeorm.config';

/**
 * Standalone DataSource instance for the TypeORM CLI
 * (migration:generate / migration:run / migration:revert).
 */
export const AppDataSource = new DataSource(dataSourceOptions);

export default AppDataSource;
