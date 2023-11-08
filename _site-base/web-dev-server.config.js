module.exports = {
  port: 8081,
  open: true,
  nodeResolve: true,
  appIndex: 'index.html',
  watch: true,
  headers: {
    'Access-Control-Allow-Origin': '*', // Puedes ajustar esto según tus necesidades
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  },
};