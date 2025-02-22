require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const contactRoutes = require('./routes/contact');

const app = express();

// Middlewares
app.use(helmet());

// Configuração CORS
const corsOptions = {
    origin: [
        'https://seu-site.netlify.app',
        'http://localhost:5500'
    ],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
    console.log(`📝 ${req.method} ${req.path}`);
    next();
});

// Rotas
app.use('/api/contact', contactRoutes);

// Error handling
app.use((err, req, res, next) => {
    console.error('Erro:', err);
    res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
    });
});

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
    console.log(`✅ Servidor rodando na porta ${PORT}`);
    console.log('Configurações de email:', {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        user: process.env.EMAIL_USER
    });
})
.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`❌ Porta ${PORT} já está em uso`);
    } else {
        console.error('❌ Erro ao iniciar servidor:', error);
    }
    process.exit(1);
});

// Tratamento de encerramento gracioso
process.on('SIGTERM', () => {
    console.info('SIGTERM recebido. Fechando servidor...');
    server.close(() => {
        console.log('Servidor fechado');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.info('SIGINT recebido. Fechando servidor...');
    server.close(() => {
        console.log('Servidor fechado');
        process.exit(0);
    });
}); 