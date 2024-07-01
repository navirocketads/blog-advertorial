const geoip = require('geoip-lite');

// Função para gerar um ID de sessão único
function generateSessionId() {
    // Gera um ID aleatório de 8 caracteres alfanuméricos
    return Math.random().toString(36).substring(2, 10);
}

// Função para criar sessão com informações adicionais
function createSession(userId, req) {
    const sessionId = generateSessionId();

    // Obtém o endereço IP do usuário
    const ip = req.ip;

    // Usa geoip-lite para obter informações de localização
    const geo = geoip.lookup(ip);

    let estado = null;
    let paisCodigo = null;

    if (geo) {
        estado = geo.region;          // Obtém o estado (se disponível)
        paisCodigo = geo.country;     // Obtém o código ISO 3166-1 alpha-2 do país (ex: "BR")
    }

    // Obtém os parâmetros de UTM da query string da URL (se disponíveis)
    const utmSource = req.query.source || null;
    const utmMedium = req.query.medium || null;
    const utmCampaign = req.query.campaign || null;
    const utmTerm = req.query.term || null;
    const utmContent = req.query.content || null;

    // Obtém informações do dispositivo do usuário
    const userAgent = req.headers['user-agent'];  // Obtém o agente do usuário
    const deviceType = getDeviceType(userAgent);  // Função para determinar o tipo de dispositivo

    // Armazena na sessão
    sessions[sessionId] = {
        userId,
        estado,
        paisCodigo,   // Armazena o código do país em vez do nome completo
        utm: {
            source: utmSource,
            medium: utmMedium,
            campaign: utmCampaign,
            term: utmTerm,
            content: utmContent
        },
        deviceType,
        userAgent,
        // Outros dados da sessão
    };

    return sessionId;
}

// Função para determinar o tipo de dispositivo com base no agente do usuário
function getDeviceType(userAgent) {
    if (/mobile/i.test(userAgent)) {
        return 'mobile';
    } else if (/tablet/i.test(userAgent)) {
        return 'tablet';
    } else {
        return 'desktop';
    }
}

// Exporta as funções necessárias
module.exports = {
    createSession,
    // Outras funções do sessionService se houver
};
