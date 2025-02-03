import nodemailer from "nodemailer";
import { FormData } from "@/types/form";
import QRCode from "qrcode";

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
  <style>
    .button {
      background: #ef4444;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 5px;
      display: inline-block;
      margin: 10px 0;
    }
    .details {
      background: #f8f8f8;
      padding: 15px;
      border-radius: 5px;
      margin: 15px 0;
    }
  </style>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <h1 style="color: #ef4444; text-align: center;">Pagamento Confirmado!</h1>
    <p>Olá!</p>
    <p>Seu pagamento foi confirmado com sucesso. Aqui estão os detalhes:</p>
    <div class="details">
      <p><strong>Plano:</strong> ${data.plan?.type === 'forever' ? 'Para Sempre' : 'Anual'}</p>
      <p><strong>Valor:</strong> R$ ${data.plan?.price.toFixed(2)}</p>
      <p><strong>Título da Página:</strong> ${data.title}</p>
      <p><strong>Data de Início:</strong> ${new Date(data.startDate).toLocaleDateString('pt-BR')}</p>
    </div>
    <p>Sua página já está disponível! Clique no botão abaixo para acessá-la:</p>
    <p style="text-align: center;">
      <a href="${process.env.NEXT_PUBLIC_BASE_URL}/pages/${data.payment_id}" 
         class="button">
        Acessar Minha Página
      </a>
    </p>
    <p style="margin-top: 20px;">
      <strong>Observação:</strong> Em breve você receberá outro email com o link da sua página e um QR code para compartilhar.
    </p>
    <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
    <p style="text-align: center; color: #666; font-size: 14px;">
      Obrigado por usar o DayLove!<br>
      Com amor, Equipe DayLove ❤️
    </p>
  </div>
</body>
</html>
`;

// Template para email de página criada
const getPageCreatedTemplate = async (data: FormData) => {
  // Gerar QR code para o link da página
  const pageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/pages/${data.payment_id}`;
  const qrCodeDataUrl = await QRCode.toDataURL(pageUrl, {
    width: 300,
    margin: 2,
    color: {
      dark: "#000000",
      light: "#FFFFFF",
    },
  });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Sua Página foi Criada - DayLove</title>
  <style>
    .button {
      background: #ef4444;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 5px;
      display: inline-block;
      margin: 10px 0;
    }
    .details {
      background: #f8f8f8;
      padding: 15px;
      border-radius: 5px;
      margin: 15px 0;
    }
    .qrcode {
      background: white;
      padding: 15px;
      border-radius: 5px;
      margin: 20px auto;
      width: 300px;
      height: 300px;
    }
    .qrcode-container {
      text-align: center;
      margin: 30px 0;
      padding: 20px;
      background: #f8f8f8;
      border-radius: 5px;
    }
  </style>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <h1 style="color: #ef4444; text-align: center;">Sua Página foi Criada!</h1>
    <p>Olá!</p>
    <p>Sua página de amor foi criada com sucesso. Aqui estão os detalhes:</p>
    <div class="details">
      <p><strong>Título:</strong> ${data.title}</p>
      <p><strong>Data de Início:</strong> ${new Date(data.startDate).toLocaleDateString('pt-BR')}</p>
      <p><strong>Plano:</strong> ${data.plan?.type === 'forever' ? 'Para Sempre' : 'Anual'}</p>
      ${data.plan?.type === 'forever' ? '<p><strong>Recursos:</strong> Música e Animações Incluídas</p>' : ''}
    </div>
    <p>Clique no botão abaixo para acessar sua página:</p>
    <p style="text-align: center;">
      <a href="${pageUrl}" class="button">
        Acessar Minha Página
      </a>
    </p>

    <div class="qrcode-container">
      <h3 style="color: #ef4444; margin-bottom: 15px;">QR Code da Sua Página</h3>
      <p style="margin-bottom: 20px;">
        Escaneie o QR code abaixo para acessar sua página ou imprima para compartilhar com quem você ama ❤️
      </p>
      <img 
        src="${qrCodeDataUrl}"
        alt="QR Code da sua página"
        class="qrcode"
      />
      <p style="font-size: 14px; color: #666; margin-top: 15px;">
        Dica: Salve ou imprima este QR code para compartilhar facilmente sua página!
      </p>
    </div>

    <p style="margin-top: 20px;">
      <strong>Observação:</strong> Guarde este email, pois ele contém o link e o QR code da sua página.
    </p>
    <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
    <p style="text-align: center; color: #666; font-size: 14px;">
      Obrigado por compartilhar seu amor através do DayLove!<br>
      Com amor, Equipe DayLove ❤️
    </p>
  </div>
</body>
</html>
`;
};

// Função para enviar email de confirmação de pagamento
export async function sendPaymentConfirmationEmail(data: FormData) {
  if (!data.user_email) {
    console.error('Email do usuário não fornecido');
    return false;
  }

  try {
    console.log('Tentando enviar email de confirmação para:', data.user_email);
    console.log('Dados do email:', {
      title: data.title,
      startDate: data.startDate,
      plan: data.plan,
      payment_id: data.payment_id
    });

    const info = await transporter.sendMail({
      from: `"DayLove" <${process.env.EMAIL_USER}>`,
      to: data.user_email,
      subject: "Pagamento Confirmado - DayLove",
      html: getPaymentSuccessTemplate(data),
    });

    console.log('Email de confirmação enviado:', info.response);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    return true;
  } catch (error) {
    console.error("Erro ao enviar email de confirmação:", error);
    return false;
  }
}

// Função para enviar email de página criada
export async function sendPageCreatedEmail(data: FormData) {
  if (!data.user_email) {
    console.error('Email do usuário não fornecido');
    return false;
  }

  try {
    console.log('Tentando enviar email de página criada para:', data.user_email);
    console.log('Dados do email:', {
      title: data.title,
      startDate: data.startDate,
      plan: data.plan,
      payment_id: data.payment_id
    });

    // Gerar o template com o QR code
    const html = await getPageCreatedTemplate(data);

    const info = await transporter.sendMail({
      from: `"DayLove" <${process.env.EMAIL_USER}>`,
      to: data.user_email,
      subject: "Sua Página foi Criada - DayLove",
      html,
    });

    console.log('Email de página criada enviado:', info.response);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    return true;
  } catch (error) {
    console.error("Erro ao enviar email de página criada:", error);
    return false;
  }
}
