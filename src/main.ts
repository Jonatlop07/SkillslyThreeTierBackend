import 'module-alias/register';

import { ServerApplication } from '@application/server_application';

async function runApplication(): Promise<void> {
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
  }
  const serverApplication: ServerApplication = ServerApplication.new();
  await serverApplication.run();
}

(async (): Promise<void> => {
  await runApplication();
})();
