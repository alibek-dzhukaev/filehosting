import Seeder from 'src/seed'
import type { DataSource } from 'typeorm';

export const runMigrations = async (
  dataSource: DataSource,
) => {
  try {
    await dataSource.initialize();
    console.log('Data Source has been initialized!');
    await dataSource.runMigrations();
    console.log('Migrations have been run successfully!');
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    await dataSource.destroy();
  }
};
