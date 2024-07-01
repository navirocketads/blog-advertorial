const express = require('express');
const path = require('path');
const app = express();

// Define o diretório de arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rota padrão para servir o index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Porta do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
