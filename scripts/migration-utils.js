const { exec } = require('child_process');
const path = require('path');

/**
 * Logs an error message and exits the process with a failure code.
 * @param {string} message - The error message to log.
 */
const logErrorAndExit = (message) => {
  console.error(`❌ Error: ${message}`);
  process.exit(1);
};

/**
 * Executes a shell command and handles the output.
 * @param {string} command - The command to execute.
 * @returns {Promise<void>}
 */
const executeCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(`Command failed: ${error.message}`);
        return;
      }
      if (stderr) {
        console.warn(`⚠️ Stderr: ${stderr}`);
      }
      console.log(`✅ Stdout: ${stdout}`);
      resolve();
    });
  });
};

/**
 * Constructs the TypeORM command using local ts-node.
 * @param {string} action - The TypeORM action to perform (e.g., "migration:generate", "migration:run").
 * @param {string} datasourcePath - The path to the data-source file.
 * @param {string} [outputPath] - The output path for migration files (optional).
 * @param {string} [migrationName] - The name of the migration (optional).
 * @returns {string} - The full TypeORM command.
 */
const constructTypeORMCommand = (action, datasourcePath, outputPath, migrationName) => {
  const typeormCommand = `./node_modules/.bin/ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js`;
  let fullCommand = `${typeormCommand} ${action} -d ${datasourcePath}`;

  if (outputPath && migrationName) {
    fullCommand += ` ${path.join(outputPath, migrationName)}`;
  }

  return fullCommand;
};

module.exports = {
  logErrorAndExit,
  executeCommand,
  constructTypeORMCommand,
};