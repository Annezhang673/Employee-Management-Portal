const { createProxyMiddleware } = require('http-proxy-middleware');

const target = process.env.REACT_APP_API_URL || 'http://localhost:8080';

module.exports = function(app) {
   app.use(
      '/api',
      createProxyMiddleware({
         target,
         changeOrigin: true,
      })
   );
};