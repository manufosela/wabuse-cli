import { createServer } from 'vite';

/**
 * Start the Vite server
 * @param {boolean} headless - Whether to run the server in headless mode
 * @returns {Promise<import('vite').ViteDevServer>} - The Vite server instance
 */
export async function startServer(headless = false) {
  const server = await createServer({
    config: {
      root: './',
      server: {
        watch: {
          usePolling: true,
          interval: 100
        }
      },
    },
    server: {
      port,
      open: !headless,
    }
  });

  await server.listen();
  return server;
}
