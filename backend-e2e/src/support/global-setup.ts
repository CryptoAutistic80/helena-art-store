import { waitForPortOpen } from '@nx/node/utils';

declare global {
  var __TEARDOWN_MESSAGE__: string | undefined;
}

const setup = async () => {
  const host = process.env.HOST ?? '127.0.0.1';
  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  const retries = process.env.BACKEND_E2E_RETRIES ? Number(process.env.BACKEND_E2E_RETRIES) : 3;
  const retryDelay = process.env.BACKEND_E2E_RETRY_DELAY ? Number(process.env.BACKEND_E2E_RETRY_DELAY) : 250;

  try {
    await waitForPortOpen(port, { host, retries, retryDelay });
  } catch (error) {
    process.stdout.write(`\nBackend port ${port} unavailable, proceeding without live API.\n`);
    process.stdout.write(`${String(error)}\n`);
  }

  globalThis.__TEARDOWN_MESSAGE__ = '\nTearing down...\n';
};

export default setup;
module.exports = setup;
