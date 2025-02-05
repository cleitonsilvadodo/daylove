require('ts-node').register();
require('dotenv').config({ path: '.env.local' });
const path = require('path');
const { handleSuccessfulPayment } = require(path.resolve(__dirname, 'src/services/pages.ts'));

// Dados de teste
const testData = {
  title: "Teste Webhook Local",
  startDate: new Date().toISOString(),
  message: "Teste de webhook local",
  user_email: "cleitomdodopag@gmail.com",
  payment_id: "teste_" + Date.now(),
  photos: [],
  music: { type: "", url: "", title: "" },
  animation: "none",
  dateDisplayMode: "padrao"
};

// Simular webhook do Pagar.me
async function testWebhook() {
  console.log('Iniciando teste de webhook...');
  console.log('Dados de teste:', testData);

  try {
    console.log('\nVerificando variáveis de ambiente...');
    console.log({
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Configurada' : 'Não configurada',
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Configurada' : 'Não configurada',
      emailHost: process.env.EMAIL_HOST ? 'Configurada' : 'Não configurada',
      emailUser: process.env.EMAIL_USER ? 'Configurada' : 'Não configurada'
    });

    console.log('\nProcessando pagamento...');
    const success = await handleSuccessfulPayment(
      testData.payment_id,
      testData.user_email,
      testData,
      process.argv[2] || 'forever' // Tipo do plano como argumento da linha de comando
    );

    if (success) {
      console.log('\nPagamento processado com sucesso!');
      console.log('- Página criada');
      console.log('- Emails enviados');
    } else {
      console.error('\nFalha ao processar pagamento');
    }
  } catch (error) {
    console.error('Erro ao testar webhook:', error);
    if (error.response) {
      console.error('Detalhes do erro:', error.response.data);
    }
  }
}

// Executar teste
console.log('Tipo de plano:', process.argv[2] || 'forever');
testWebhook();
