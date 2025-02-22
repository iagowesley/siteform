const nodemailer = require('nodemailer');
const emailConfig = require('../config/email');

const transporter = nodemailer.createTransport(emailConfig);

// Verificar conexão com o servidor de email
transporter.verify(function(error, success) {
    if (error) {
        console.error('Erro na configuração do email:', error);
    } else {
        console.log('Servidor de email pronto para enviar mensagens');
    }
});

exports.sendContactEmail = async (req, res) => {
    console.log('Recebido pedido de contato:', req.body);
    
    const { name, email, phone, message } = req.body;

    // Validação básica
    if (!name || !email || !phone || !message) {
        return res.status(400).json({
            success: false,
            message: 'Por favor, preencha todos os campos'
        });
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: 'Por favor, forneça um email válido'
        });
    }

    try {
        // Email para você
        await transporter.sendMail({
            from: `"Formulário de Contato" <${emailConfig.auth.user}>`,
            to: emailConfig.auth.user,
            subject: `Nova mensagem de contato - ${name}`,
            html: `
                <h2>Nova mensagem de contato</h2>
                <p><strong>Nome:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Telefone:</strong> ${phone}</p>
                <p><strong>Mensagem:</strong></p>
                <p>${message}</p>
            `
        });

        // Email de confirmação para o cliente
        await transporter.sendMail({
            from: `"Paulo Leme" <${emailConfig.auth.user}>`,
            to: email,
            subject: 'Recebemos sua mensagem',
            html: `
                <h2>Olá ${name}!</h2>
                <p>Obrigado por entrar em contato. Recebemos sua mensagem e retornaremos em breve.</p>
                <p>Esta é uma mensagem automática, por favor não responda.</p>
                <br>
                <p>Atenciosamente,</p>
                <p>Paulo Leme</p>
            `
        });

        console.log('Email enviado com sucesso');
        res.status(200).json({
            success: true,
            message: 'Mensagem enviada com sucesso!'
        });

    } catch (error) {
        console.error('Erro detalhado ao enviar email:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao enviar mensagem. Por favor, tente novamente mais tarde.'
        });
    }
}; 