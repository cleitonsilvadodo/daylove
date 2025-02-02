const testEmail = async () => {
  try {
    console.log('Enviando requisição de teste de pagamento...');
    
    const payload = {
      type: 'payment',
      data: {
        user_email: 'cleitomdodopago@gmail.com',
        title: 'Teste de Página',
        startDate: '2024-02-02',
        plan: {
          type: 'premium',
          price: 49.90
        },
        payment_id: 'test-123'
      }
    };

    console.log('Payload:', JSON.stringify(payload, null, 2));

    const response = await fetch('http://localhost:3004/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Resposta:', data);
  } catch (error) {
    console.error('Erro:', error.message);
    if (error.response) {
      console.error('Detalhes:', await error.response.text());
    }
  }
};

console.log('Iniciando teste de email de pagamento...');
testEmail();
