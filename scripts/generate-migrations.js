const { logErrorAndExit, executeCommand, constructTypeORMCommand } = require('./migration-utils');
const path = require('path');

/**
 * Generates a TypeORM migration using the provided migration name.
 * @param {string} migrationName - The name of the migration to generate.
 */
const generateMigration = async (migrationName) => {
  try {
    // Validate the migration name
    if (!migrationName) {
      logErrorAndExit('Migration name is required.');
    }

    // Define paths
    const datasourcePath = path.resolve('/app/dist/data-source.js');
    const outputPath = path.resolve('/app/src/migrations/');

    // Construct the TypeORM command
    const fullCommand = constructTypeORMCommand(
      'migration:generate',
      datasourcePath,
      outputPath,
      migrationName
    );

    console.log(`🚀 Running command: ${fullCommand}`);

    // Execute the command
    await executeCommand(fullCommand);
    console.log(`🎉 Migration "${migrationName}" generated successfully!`);
  } catch (error) {
    logErrorAndExit(error);
  }
};

// Main execution
(async () => {
  const args = process.argv.slice(2);
  const [migrationName] = args;

  if (!migrationName) {
    logErrorAndExit('Usage: pnpm migration:generate <migration-name>');
  }

  await generateMigration(migrationName);
})();