import getPort from 'get-port';
import { createServer } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// Obtener la ruta actual del archivo
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

(async () => {
  const port = await getPort({ port: 8080 }); // Puerto predeterminado: 8080

  const server = await createServer({
    configFile: resolve(__dirname, './vite.config.mjs'), // Asegúrate de que la ruta sea correcta
    server: {
      port,
      open: true, // Abre el navegador automáticamente
    }
  });

  await server.listen();

  server.printUrls();

  server.config.logger.info(`Vite server is running on port ${port}`);
})();
