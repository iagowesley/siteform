class BlogAdmin {
    constructor() {
        this.postForm = document.getElementById('blogPostForm');
        this.postsList = document.getElementById('posts-list');
        
        // Detectar URL da API baseado no ambiente
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        this.apiUrl = isLocalhost ? 
            'http://localhost:3000/api/blog' : 
            'http://192.168.0.4:3000/api/blog';
        
        this.init();
    }
    
    init() {
        this.loadPosts();
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        this.postForm.addEventListener('submit', (e) => this.handleSubmit(e));
    }
    
    async loadPosts() {
        try {
            const url = `${this.apiUrl}/posts`;
            console.log('🔍 Carregando posts de:', url);
            
            // Primeiro testar a conexão
            const testResponse = await fetch(`${this.apiUrl.replace('/blog', '')}/test`);
            const testResult = await testResponse.json();
            console.log('🔧 Status da API:', testResult);
            
            if (testResult.mongodb?.status !== 'conectado') {
                throw new Error('Banco de dados não está conectado');
            }

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Erro:', errorText);
                throw new Error(`${response.status}: ${response.statusText}`);
            }
            
            const posts = await response.json();
            this.renderPosts(posts);
        } catch (error) {
            this.renderError(error.message);
        }
    }
    
    renderPosts(posts) {
        this.postsList.innerHTML = `
            <div class="posts-grid">
                ${posts.length ? 
                    posts.map(post => this.createPostCard(post)).join('') : 
                    '<p class="no-posts">Nenhum post encontrado</p>'}
            </div>
        `;
    }
    
    renderError(message) {
        this.postsList.innerHTML = `
            <div class="error-message">
                <p>Erro ao carregar posts: ${message}</p>
                <button onclick="blogAdmin.loadPosts()">Tentar novamente</button>
            </div>
        `;
    }
    
    createPostCard(post) {
        return `
            <div class="post-card">
                <img src="${post.image}" alt="${post.title}">
                <div class="post-content">
                    <h3>${post.title}</h3>
                    <p>${post.excerpt}</p>
                    <div class="post-actions">
                        <button onclick="blogAdmin.editPost('${post.slug}')">Editar</button>
                        <button class="delete-button" onclick="blogAdmin.deletePost('${post.slug}')">Excluir</button>
                    </div>
                </div>
            </div>
        `;
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        try {
            console.log('Iniciando envio do post...');
            const formData = new FormData(this.postForm);
            
            // Log dos dados sendo enviados
            for (let [key, value] of formData.entries()) {
                console.log(`Campo ${key}:`, value);
            }

            const response = await fetch(`${this.apiUrl}/posts`, {
                method: 'POST',
                body: formData // Não definir Content-Type para multipart/form-data
            });
            
            console.log('Status da resposta:', response.status);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao criar post');
            }
            
            const result = await response.json();
            console.log('Post criado com sucesso:', result);
            
            await this.loadPosts();
            this.postForm.reset();
            hidePostForm();
            alert('Post criado com sucesso!');
        } catch (error) {
            console.error('Erro ao criar post:', error);
            alert(`Erro ao criar post: ${error.message}`);
        }
    }
    
    async deletePost(slug) {
        if (!confirm('Tem certeza que deseja excluir este post?')) return;
        
        try {
            const response = await fetch(`${this.apiUrl}/posts/${slug}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) throw new Error('Erro ao excluir post');
            
            await this.loadPosts();
            alert('Post excluído com sucesso!');
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao excluir post');
        }
    }
    
    async editPost(slug) {
        try {
            const response = await fetch(`${this.apiUrl}/posts/${slug}`);
            const post = await response.json();
            
            // Preencher formulário com dados do post
            document.getElementById('title').value = post.title;
            document.getElementById('excerpt').value = post.excerpt;
            document.getElementById('content').value = post.content;
            document.getElementById('author').value = post.author;
            
            showPostForm();
            
            // Alterar formulário para modo de edição
            this.postForm.dataset.mode = 'edit';
            this.postForm.dataset.slug = slug;
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao carregar post');
        }
    }
}

function showPostForm() {
    document.getElementById('post-form').classList.remove('hidden');
}

function hidePostForm() {
    document.getElementById('post-form').classList.add('hidden');
    document.getElementById('blogPostForm').reset();
}

// Inicializar admin
const blogAdmin = new BlogAdmin(); 