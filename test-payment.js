const testPayment = async () => {
  try {
    console.log('Testando criação de pagamento...');
    
    // Dados de teste para o plano "Para Sempre"
    const foreverPayload = {
      formData: {
        title: "Teste de Página",
        startDate: "2024-02-02",
        message: "Teste de mensagem",
        user_email: "cleitomdodopag@gmail.com"
      },
      planType: "forever",
      planPrice: 29.90
    };

    console.log('Payload do plano Para Sempre:', JSON.stringify(foreverPayload, null, 2));

    const foreverResponse = await fetch('http://localhost:3001/api/create-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(foreverPayload)
    });

    const foreverResult = await foreverResponse.json();
    console.log('Resposta do plano Para Sempre:', foreverResult);

    // Dados de teste para o plano "Anual"
    const annualPayload = {
      formData: {
        title: "Teste de Página",
        startDate: "2024-02-02",
        message: "Teste de mensagem",
        user_email: "cleitomdodopag@gmail.com"
      },
      planType: "annual",
      planPrice: 19.90
    };

    console.log('\nPayload do plano Anual:', JSON.stringify(annualPayload, null, 2));

    const annualResponse = await fetch('http://localhost:3001/api/create-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(annualPayload)
    });

    const annualResult = await annualResponse.json();
    console.log('Resposta do plano Anual:', annualResult);

  } catch (error) {
    console.error('Erro:', error.message);
    if (error.response) {
      console.error('Detalhes:', await error.response.text());
    }
  }
};

console.log('Iniciando testes de pagamento...');
testPayment();
