const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Define o diretório de arquivos estáticos (public)
app.use(express.static(path.join(__dirname, 'public')));

// Rota padrão para servir o index.html localmente
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Configuração do proxy reverso para a página white (externa)
const proxyOptionsWhite = {
    target: 'https://www.megamodahotel.com.br/cultura/como-arrumar-uma-mala-de-viagem-feminina/',
    changeOrigin: true,  // Mudar o cabeçalho Host para o host do destino
    secure: true  // Habilitar verificação SSL
};

// Criar o middleware do proxy reverso baseado nas opções acima
const proxyWhite = createProxyMiddleware(proxyOptionsWhite);

// Middleware para determinar qual página servir
app.use((req, res, next) => {
    const userAgent = req.headers['user-agent'].toLowerCase();
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    const isBot = /googlebot|bingbot|yandexbot|duckduckbot|baiduspider|sogou|exabot|msnbot|teoma|slurp/i.test(userAgent);
    const isGoogleBot = /googlebot|googlebot-image|googlebot-video|googlebot-mobile|adsbot-google(?:-mobile)?|mediapartners-google/i.test(userAgent);

    // Decida qual página servir com base no agente do usuário
    if (!isBot && !isGoogleBot && isMobile) {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));

                // Servir o quiz local (index.html)
    } else {
        proxyWhite(req, res, next);

        // Encaminha a requisição para o proxy da página white (externa)
    }
});

// Porta do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
