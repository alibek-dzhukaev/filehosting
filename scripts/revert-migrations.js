const { logErrorAndExit, executeCommand, constructTypeORMCommand } = require('./migration-utils');
const path = require('path');

/**
 * Reverts the last applied TypeORM migration.
 */
const revertMigration = async () => {
  try {
    // Define paths
    const datasourcePath = path.resolve('/app/dist/data-source.js');

    // Construct the TypeORM command
    const fullCommand = constructTypeORMCommand('migration:revert', datasourcePath);

    console.log(`🚀 Running command: ${fullCommand}`);

    // Execute the command
    await executeCommand(fullCommand);
    console.log('🎉 Migration reverted successfully!');
  } catch (error) {
    logErrorAndExit(error);
  }
};

// Main execution
(async () => {
  await revertMigration();
})();