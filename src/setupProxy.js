const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/v1',
    createProxyMiddleware({
      target: 'http://95.216.140.202/',
      changeOrigin: true
    })
  );
};
