document.addEventListener('DOMContentLoaded', function() {
    // Adiciona suporte para dispositivos touch
    const menuItems = document.querySelectorAll('.nav-menu__item');
    
    menuItems.forEach(item => {
        item.addEventListener('touchstart', function(e) {
            const hasSubmenu = this.querySelector('.submenu');
            if (hasSubmenu) {
                e.preventDefault();
                this.classList.toggle('active');
            }
        });
    });
}); 