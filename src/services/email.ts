import nodemailer from "nodemailer";
import { FormData } from "@/types/form";

// Configuração do transportador de email
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_PORT === "465",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  ...(process.env.NODE_ENV === 'development' && {
    logger: true,
    debug: true
  })
});

// Verificar configuração em desenvolvimento
if (process.env.NODE_ENV === 'development') {
  console.log('Configurações de email:', {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT === "465",
    user: process.env.EMAIL_USER
  });
}

// Template para email de confirmação de pagamento
const getPaymentSuccessTemplate = (data: FormData) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Pagamento Confirmado - DayLove</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <h1 style="color: #ef4444; text-align: center;">Pagamento Confirmado!</h1>
    <p>Olá!</p>
    <p>Seu pagamento foi confirmado com sucesso. Aqui estão os detalhes:</p>
    <ul>
      <li>Plano: ${data.plan?.type}</li>
      <li>Valor: R$ ${data.plan?.price.toFixed(2)}</li>
    </ul>
    <p>Sua página já está disponível em:</p>
    <p style="text-align: center;">
      <a href="${process.env.NEXT_PUBLIC_BASE_URL}/pages/${data.payment_id}" 
         style="background: #ef4444; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
        Ver Minha Página
      </a>
    </p>
    <p>Obrigado por usar o DayLove!</p>
  </div>
</body>
</html>
`;

// Template para email de página criada
const getPageCreatedTemplate = (data: FormData) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Sua Página foi Criada - DayLove</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <h1 style="color: #ef4444; text-align: center;">Sua Página foi Criada!</h1>
    <p>Olá!</p>
    <p>Sua página de amor foi criada com sucesso. Você pode acessá-la através do link:</p>
    <p style="text-align: center;">
      <a href="${process.env.NEXT_PUBLIC_BASE_URL}/pages/${data.payment_id}" 
         style="background: #ef4444; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
        Ver Minha Página
      </a>
    </p>
    <p>Detalhes da sua página:</p>
    <ul>
      <li>Título: ${data.title}</li>
      <li>Data: ${data.startDate}</li>
      <li>Plano: ${data.plan?.type}</li>
    </ul>
    <p>Obrigado por compartilhar seu amor através do DayLove!</p>
  </div>
</body>
</html>
`;

// Função para enviar email de confirmação de pagamento
export async function sendPaymentConfirmationEmail(data: FormData) {
  if (!data.user_email) return;

  try {
    console.log('Tentando enviar email de confirmação para:', data.user_email);
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: data.user_email,
      subject: "Pagamento Confirmado - DayLove",
      html: getPaymentSuccessTemplate(data),
    });
    console.log('Email de confirmação enviado:', info.response);
    return true;
  } catch (error) {
    console.error("Erro ao enviar email de confirmação:", error);
    return false;
  }
}

// Função para enviar email de página criada
export async function sendPageCreatedEmail(data: FormData) {
  if (!data.user_email) return;

  try {
    console.log('Tentando enviar email de página criada para:', data.user_email);
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: data.user_email,
      subject: "Sua Página foi Criada - DayLove",
      html: getPageCreatedTemplate(data),
    });
    console.log('Email de página criada enviado:', info.response);
    return true;
  } catch (error) {
    console.error("Erro ao enviar email de página criada:", error);
    return false;
  }
}
