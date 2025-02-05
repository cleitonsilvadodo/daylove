require('ts-node').register();
const path = require('path');
const nodemailer = require('nodemailer');
const { sendPaymentConfirmationEmail, sendPageCreatedEmail } = require(path.resolve(__dirname, 'src/services/email.ts'));

// Configuração do transportador de email
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.titan.email',
  port: Number(process.env.EMAIL_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER || 'suporte@daylove.com.br',
    pass: process.env.EMAIL_PASS || '#Cleiton123',
  },
  debug: true,
  logger: true
});

const testData = {
  title: "Teste Local",
  startDate: new Date().toISOString(),
  message: "Teste de email local",
  user_email: "cleitomdodopag@gmail.com",
  payment_id: "teste123",
  plan: { type: "forever", price: 1.00 },
  photos: [],
  music: { type: "", url: "", title: "" },
  animation: "none",
  dateDisplayMode: "padrao"
};

async function testEmails() {
  console.log('Iniciando teste de emails...');
  console.log('Dados de teste:', testData);

  try {
    console.log('\nVerificando configurações do email...');
    console.log({
      host: process.env.EMAIL_HOST || 'smtp.titan.email',
      port: process.env.EMAIL_PORT || 465,
      secure: true,
      user: process.env.EMAIL_USER || 'suporte@daylove.com.br'
    });

    console.log('\nTestando conexão com servidor SMTP...');
    await transporter.verify();
    console.log('Conexão SMTP OK!');

    console.log('\nEnviando email de teste...');
    const info = await transporter.sendMail({
      from: `"DayLove" <${process.env.EMAIL_USER || 'suporte@daylove.com.br'}>`,
      to: testData.user_email,
      subject: "Teste de Email - DayLove",
      html: `
        <h1>Teste de Email</h1>
        <p>Este é um email de teste do DayLove.</p>
        <p>Dados do teste:</p>
        <pre>${JSON.stringify(testData, null, 2)}</pre>
      `,
    });

    console.log('Email enviado:', info.response);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));

  } catch (error) {
    console.error('Erro ao testar emails:', error);
    if (error.response) {
      console.error('Detalhes do erro:', error.response.data);
    }
  }
}

testEmails();
