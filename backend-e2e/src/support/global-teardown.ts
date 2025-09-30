import { killPort } from '@nx/node/utils';

declare global {
  var __TEARDOWN_MESSAGE__: string | undefined;
}

const teardown = async () => {
  // Put clean up logic here (e.g. stopping services, docker-compose, etc.).
  // Hint: `globalThis` is shared between setup and teardown.
  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  await killPort(port);
  if (globalThis.__TEARDOWN_MESSAGE__) {
    process.stdout.write(`${globalThis.__TEARDOWN_MESSAGE__}\n`);
  }
};

export default teardown;
module.exports = teardown;
