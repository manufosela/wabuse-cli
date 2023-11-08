import getPort from 'get-port';
import { spawn } from 'child_process';

(async () => {
  const port = await getPort({ port: 8080 }); // Puerto predeterminado: 8080

  const server = spawn('web-dev-server', [
    '--app-index', 'index.html',
    '--node-resolve',
    '--watch',
    '--open',
    `--port ${port}`,
  ]);

  server.stdout.on('data', (data) => {
    console.log(data.toString());
  });

  server.stderr.on('data', (data) => {
    console.error(data.toString());
  });
})();