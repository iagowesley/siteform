const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
        
        // Monitorar eventos de conexão
        mongoose.connection.on('error', err => {
            console.error('❌ Erro na conexão MongoDB:', err);
        });
        
        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️ MongoDB desconectado');
        });
        
        return true;
    } catch (error) {
        console.error('❌ Erro ao conectar ao MongoDB:', error.message);
        return false;
    }
};

module.exports = connectDB; 