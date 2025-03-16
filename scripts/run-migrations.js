const { logErrorAndExit, executeCommand, constructTypeORMCommand } = require('./migration-utils');
const path = require('path');

/**
 * Runs all pending TypeORM migrations.
 */
const runMigrations = async () => {
  try {
    // Define paths
    const datasourcePath = path.resolve('/app/dist/data-source.js');

    // Construct the TypeORM command
    const fullCommand = constructTypeORMCommand('migration:run', datasourcePath);

    console.log(`🚀 Running command: ${fullCommand}`);

    // Execute the command
    await executeCommand(fullCommand);
    console.log('🎉 Migrations executed successfully!');
  } catch (error) {
    logErrorAndExit(error);
  }
};

// Main execution
(async () => {
  await runMigrations();
})();