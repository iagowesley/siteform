const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const contactController = require('../controllers/contactController');

// Limite de requisições: 5 por hora por IP
const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 5,
    message: {
        success: false,
        message: 'Muitas tentativas de contato. Por favor, tente novamente mais tarde.'
    }
});

router.post('/send', contactLimiter, contactController.sendContactEmail);

module.exports = router; 