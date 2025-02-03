const crypto = require('crypto');
const { default: fetch } = require('node-fetch');

// URLs de exemplo para fotos de teste
const TEST_PHOTOS = [
  "https://picsum.photos/400/400?random=1",
  "https://picsum.photos/400/400?random=2",
  "https://picsum.photos/400/400?random=3",
  "https://picsum.photos/400/400?random=4",
  "https://picsum.photos/400/400?random=5",
  "https://picsum.photos/400/400?random=6",
  "https://picsum.photos/400/400?random=7",
  "https://picsum.photos/400/400?random=8",
];

const testWebhook = async (planType = "forever", musicUrl = "") => {
  try {
    // Validar o tipo do plano
    if (!["forever", "annual"].includes(planType)) {
      throw new Error('Tipo de plano inválido. Use "forever" ou "annual".');
    }

    // Determinar número máximo de fotos baseado no plano
    const maxPhotos = planType === "forever" ? 8 : 4;
    const photos = TEST_PHOTOS.slice(0, maxPhotos);

    // Configurar música baseado no plano e URL
    let music = { type: "", url: "", title: "" };
    if (planType === "forever" && musicUrl) {
      const isYoutube = musicUrl.includes("youtube.com") || musicUrl.includes("youtu.be");
      const isSpotify = musicUrl.includes("spotify.com");
      
      if (!isYoutube && !isSpotify) {
        throw new Error("URL de música inválida. Use YouTube ou Spotify.");
      }

      music = {
        type: isYoutube ? "youtube" : "spotify",
        url: musicUrl,
        title: "Música de Teste"
      };
    }

    // Dados de teste do formulário
    const formData = {
      title: "Teste de Página",
      startDate: "2024-02-02",
      message: "Teste de mensagem",
      user_email: "cleitomdodopago@gmail.com",
      photos,
      music,
      animation: planType === "forever" ? "hearts" : "none",
      dateDisplayMode: "padrao",
      currentStep: 8,
      plan: {
        type: planType,
        price: planType === "forever" ? 29.90 : 19.90
      }
    };

    const orderId = "order_" + Date.now();

    // Simula os dados do webhook do Pagar.me
    const webhookData = {
      id: crypto.randomUUID(),
      type: "order.paid",
      data: {
        id: orderId,
        code: orderId,
        amount: planType === "forever" ? 2990 : 1990, // em centavos
        currency: "BRL",
        closed: true,
        status: "paid",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        customer: {
          email: "cleitomdodopago@gmail.com",
          name: "Cliente Teste",
          type: "individual",
          document: "12345678900"
        },
        charges: [{
          id: `ch_${Date.now()}`,
          code: orderId,
          gateway_id: `gw_${Date.now()}`,
          amount: planType === "forever" ? 2990 : 1990,
          status: "paid",
          currency: "BRL",
          payment_method: "credit_card",
          paid_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          customer: {
            email: "cleitomdodopago@gmail.com",
            name: "Cliente Teste",
            type: "individual",
            document: "12345678900"
          }
        }],
        metadata: {
          formData: JSON.stringify(formData),
          planType: planType
        }
      }
    };

    // Garante a ordem consistente dos campos no JSON
    const body = JSON.stringify(webhookData);
    
    // Cria a assinatura HMAC
    const signature = crypto
      .createHmac('sha256', 'sk_574323fe8558476a9f6ccb76d8443acc')
      .update(body)
      .digest('hex');

    console.log(`Testando plano: ${planType}`);
    console.log(`Número de fotos: ${photos.length}`);
    if (planType === "forever") {
      console.log(`Música: ${music.url ? `${music.type} - ${music.url}` : "Nenhuma"}`);
      console.log(`Animação: ${formData.animation}`);
    } else {
      console.log("Plano anual: sem música e sem animação");
    }
    console.log('URL do webhook:', 'http://localhost:3001/api/webhooks/pagarme');
    console.log('Headers:', {
      'Content-Type': 'application/json',
      'X-Hub-Signature': signature
    });
    console.log('Body preview:', body.substring(0, 200) + '...');
    
    // Envia o webhook
    const response = await fetch('http://localhost:3001/api/webhooks/pagarme', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hub-Signature': signature
      },
      body
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Resposta do webhook:', result);

    if (result.success) {
      console.log('Webhook processado com sucesso!');
      console.log('Verifique seu email para o link da página criada.');
      console.log(`Plano ${planType}: ${planType === "forever" ? "com" : "sem"} música e animação.`);
    } else {
      console.error('Erro ao processar webhook:', result.error);
    }

  } catch (error) {
    console.error('Erro:', error.message);
    if (error.response) {
      console.error('Detalhes:', await error.response.text());
    }
  }
};

// Pega os argumentos da linha de comando
const [planType, musicUrl] = process.argv.slice(2);

console.log('Iniciando teste do webhook...');
console.log(`
Uso:
  Plano anual (4 fotos, sem música/animação):
  node test-webhook.js annual

  Plano para sempre (8 fotos + música):
  node test-webhook.js forever "https://youtube.com/watch?v=123"
  node test-webhook.js forever "https://open.spotify.com/track/123"
`);

testWebhook(planType || "forever", musicUrl);
