const { env } = require('process');

// El proxy redirige las peticiones de Angular (puerto 44495) al backend de .NET (puerto 7107).
// Sin esto, Angular no sabría a dónde enviar las llamadas a /api/...
const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
  env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'https://localhost:7107';

const PROXY_CONFIG = [
  {
    // Aquí le decimos que TODAS las rutas que empiecen con /api 
    // deben ser redirigidas al servidor .NET
    context: [
      "/api",
      "/swagger"
    ],
    proxyTimeout: 10000,
    target: target,
    secure: false, // Ignoramos el error de certificado en desarrollo
    headers: {
      Connection: 'Keep-Alive'
    }
  }
]

module.exports = PROXY_CONFIG;
