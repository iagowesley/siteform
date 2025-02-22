const Post = require('../models/Post');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');

// Configuração do Multer para upload de imagens
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, '../../public/uploads/blog'));
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB
    fileFilter: function(req, file, cb) {
        const filetypes = /jpeg|jpg|png|webp/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Apenas imagens são permitidas'));
    }
}).single('image');

// Adicionar no início do arquivo
const checkDbConnection = (req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({ 
            message: 'Banco de dados não está conectado' 
        });
    }
    next();
};

// Listar todos os posts
exports.getPosts = async (req, res) => {
    try {
        console.log('📝 Iniciando busca de posts...');
        
        // Verificar conexão com MongoDB
        if (mongoose.connection.readyState !== 1) {
            console.error('❌ MongoDB não está conectado');
            return res.status(500).json({ message: 'Banco de dados não está conectado' });
        }

        const posts = await Post.find()
            .sort({ date: -1 })
            .select('-content');
        
        console.log(`✅ Posts encontrados: ${posts.length}`);
        console.log('Posts:', posts);
        
        res.json(posts);
    } catch (error) {
        console.error('❌ Erro ao buscar posts:', error);
        res.status(500).json({ message: error.message });
    }
};

// Obter post específico
exports.getPost = async (req, res) => {
    try {
        const post = await Post.findOne({ slug: req.params.slug });
        if (!post) {
            return res.status(404).json({ message: 'Post não encontrado' });
        }
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Criar novo post
exports.createPost = async (req, res) => {
    upload(req, res, async function(err) {
        if (err instanceof multer.MulterError) {
            console.error('Erro no upload (Multer):', err);
            return res.status(400).json({ message: 'Erro no upload do arquivo' });
        } else if (err) {
            console.error('Erro no upload:', err);
            return res.status(400).json({ message: err.message });
        }

        // Log dos dados recebidos
        console.log('Dados do formulário:', req.body);
        console.log('Arquivo recebido:', req.file);

        if (!req.file) {
            return res.status(400).json({ message: 'Imagem é obrigatória' });
        }

        try {
            const post = new Post({
                title: req.body.title,
                excerpt: req.body.excerpt,
                content: req.body.content,
                image: `/uploads/blog/${req.file.filename}`,
                author: req.body.author || 'Admin'
            });

            console.log('Tentando salvar post:', post);
            const savedPost = await post.save();
            console.log('Post salvo com sucesso:', savedPost);
            
            res.status(201).json(savedPost);
        } catch (error) {
            console.error('Erro ao salvar post:', error);
            res.status(400).json({ 
                message: error.message,
                details: error.errors 
            });
        }
    });
};

// Atualizar post
exports.updatePost = async (req, res) => {
    try {
        const post = await Post.findOne({ slug: req.params.slug });
        if (!post) {
            return res.status(404).json({ message: 'Post não encontrado' });
        }
        
        if (req.body.title) post.title = req.body.title;
        if (req.body.excerpt) post.excerpt = req.body.excerpt;
        if (req.body.content) post.content = req.body.content;
        if (req.body.author) post.author = req.body.author;
        
        const updatedPost = await post.save();
        res.json(updatedPost);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Deletar post
exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findOneAndDelete({ slug: req.params.slug });
        if (!post) {
            return res.status(404).json({ message: 'Post não encontrado' });
        }
        res.json({ message: 'Post deletado com sucesso' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 