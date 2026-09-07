import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, '../..');
const composeFile = path.join(scriptDir, 'docker-compose.yml');

function printUsage() {
  console.log(`Usage: node scripts/rustfs/start-rustfs.mjs [options] [docker compose arguments]

Options:
  -e, --environment NAME  Read .env.NAME from the repository root
  -h, --help              Show this help

Examples:
  pnpm rustfs:dev
  pnpm rustfs -- --environment production up -d
  pnpm rustfs:status`);
}

const args = process.argv.slice(2);
let environment = process.env.NODE_ENV || 'development';
const composeArgs = [];

for (let index = 0; index < args.length; index += 1) {
  const arg = args[index];

  if (arg === '--') continue;
  if (arg === '-h' || arg === '--help') {
    printUsage();
    process.exit(0);
  }
  if (arg === '-e' || arg === '--environment') {
    environment = args[index + 1];
    if (!environment) {
      console.error(`Missing environment name after ${arg}`);
      process.exit(2);
    }
    index += 1;
    continue;
  }
  if (arg.startsWith('--environment=')) {
    environment = arg.slice('--environment='.length);
    if (!environment) {
      console.error('Environment name cannot be empty');
      process.exit(2);
    }
    continue;
  }
  composeArgs.push(arg);
}

const environmentFile = path.join(rootDir, `.env.${environment}`);
const envFile = existsSync(environmentFile) ? environmentFile : path.join(rootDir, '.env');

if (!existsSync(envFile)) {
  console.error(`Root environment file not found: ${envFile}`);
  process.exit(1);
}

if (composeArgs.length === 0) composeArgs.push('up', '-d');

const docker = spawn('docker', ['compose', '--env-file', envFile, '-f', composeFile, ...composeArgs], {
  cwd: rootDir,
  stdio: 'inherit',
});

docker.on('error', (error) => {
  if (error.code === 'ENOENT') {
    console.error('Docker CLI was not found. Install Docker Desktop or Docker Engine first.');
  } else {
    console.error(`Failed to start Docker Compose: ${error.message}`);
  }
  process.exit(1);
});

docker.on('exit', (code, signal) => {
  if (signal) process.exit(1);
  process.exit(code ?? 1);
});
