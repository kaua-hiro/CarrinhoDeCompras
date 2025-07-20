document.addEventListener('DOMContentLoaded', () => {
    // Inicializa os ícones
    lucide.createIcons();
    // Testando a atualização
    // --- ESTADO DA APLICAÇÃO ---
    const state = {
        products: [
            { id: 1, name: "SSD Kingston Fury Renegade, 1 TB, M.2", price: 599.99, image: "https://placehold.co/400x400/1a1a1a/ffffff?text=SSD+1TB" },
            { id: 2, name: "Placa-Mãe MSI MPG B550 Gaming Plus", price: 879.99, image: "https://placehold.co/400x400/1a1a1a/ffffff?text=Placa-Mãe" },
            { id: 3, name: "Monitor Gamer Concórdia 23.8, 165Hz", price: 599.99, image: "https://placehold.co/400x400/1a1a1a/ffffff?text=Monitor" },
            { id: 4, name: "Fonte Gamer Rise Mode Zeus, 500W", price: 169.99, image: "https://placehold.co/400x400/1a1a1a/ffffff?text=Fonte+500W" },
            { id: 5, name: "Headset Gamer Havit, Drivers 53mm", price: 180.90, image: "https://placehold.co/400x400/1a1a1a/ffffff?text=Headset" },
            { id: 6, name: "Gabinete Gamer Mancer Goblin, Lateral de Vidro", price: 199.90, image: "https://placehold.co/400x400/1a1a1a/ffffff?text=Gabinete" },
            { id: 7, name: "Memória RAM DDR4 Kingston Fury Beast, 8GB, 3200MHz", price: 159.99, image: "https://placehold.co/400x400/1a1a1a/ffffff?text=RAM+8GB" },
            { id: 8, name: "Processador AMD Ryzen 5 5600G, 3.9GHz", price: 849.90, image: "https://placehold.co/400x400/1a1a1a/ffffff?text=Ryzen+5" },
        ],
        cart: [], // Formato: { productId: 1, quantity: 2 }
    };

    // --- SELETORES DO DOM ---
    const productsGrid = document.getElementById('productsGrid');
    const cartButton = document.getElementById('cartButton');
    const cartModal = document.getElementById('cartModal');
    const closeModalButton = document.getElementById('closeModalButton');
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartCountBadge = document.getElementById('cartCountBadge');
    const cartTotal = document.getElementById('cartTotal');
    const searchInput = document.getElementById('searchInput');
    const noResultsMessage = document.getElementById('noResultsMessage');
    const checkoutButton = document.getElementById('checkoutButton');
    const clearCartButton = document.getElementById('clearCartButton');

    // --- FUNÇÕES DE RENDERIZAÇÃO ---

    /**
     * Formata um número para o formato de moeda BRL.
     * @param {number} value - O valor a ser formatado.
     * @returns {string} O valor formatado como string.
     */
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    /**
     * Renderiza os produtos na grade principal.
     * @param {Array} productsToRender - A lista de produtos a ser exibida.
     */
    const renderProducts = (productsToRender) => {
        productsGrid.innerHTML = '';
        if(productsToRender.length === 0){
            noResultsMessage.classList.remove('hidden');
        } else {
            noResultsMessage.classList.add('hidden');
        }
        
        productsToRender.forEach(product => {
            const productCard = `
                <div class="bg-gray-800 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300 flex flex-col">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-56 object-cover">
                    <div class="p-6 flex flex-col flex-grow">
                        <h3 class="text-xl font-semibold text-white mb-2 flex-grow">${product.name}</h3>
                        <p class="text-2xl font-bold text-indigo-400 mb-4">${formatCurrency(product.price)}</p>
                        <button data-product-id="${product.id}" class="add-to-cart-btn mt-auto w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                            <i data-lucide="plus-circle" class="w-5 h-5"></i>
                            Adicionar
                        </button>
                    </div>
                </div>
            `;
            productsGrid.innerHTML += productCard;
        });
        lucide.createIcons(); // Recria os ícones após adicionar novos elementos
    };

    /**
     * Renderiza os itens dentro do modal do carrinho.
     */
    const renderCart = () => {
        cartItemsContainer.innerHTML = '';
        if (state.cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="text-center py-10">
                    <i data-lucide="shopping-basket" class="w-16 h-16 mx-auto text-gray-500 mb-4"></i>
                    <p class="text-gray-400 text-lg">Seu carrinho está vazio.</p>
                </div>
            `;
        } else {
            state.cart.forEach(cartItem => {
                const product = state.products.find(p => p.id === cartItem.productId);
                const itemTotal = product.price * cartItem.quantity;
                const cartItemElement = `
                    <div class="flex items-center justify-between gap-4 p-4 rounded-lg hover:bg-gray-700/50">
                        <img src="${product.image}" alt="${product.name}" class="w-20 h-20 rounded-md object-cover">
                        <div class="flex-grow">
                            <h4 class="font-semibold text-white">${product.name}</h4>
                            <p class="text-sm text-gray-400">${formatCurrency(product.price)}</p>
                        </div>
                        <div class="flex items-center gap-3">
                            <button data-product-id="${product.id}" class="decrease-quantity-btn bg-gray-700 hover:bg-gray-600 rounded-full w-8 h-8 flex items-center justify-center transition-colors">
                                <i data-lucide="minus" class="w-4 h-4"></i>
                            </button>
                            <span class="font-bold text-lg w-8 text-center">${cartItem.quantity}</span>
                            <button data-product-id="${product.id}" class="increase-quantity-btn bg-gray-700 hover:bg-gray-600 rounded-full w-8 h-8 flex items-center justify-center transition-colors">
                                <i data-lucide="plus" class="w-4 h-4"></i>
                            </button>
                        </div>
                        <p class="font-bold text-lg w-24 text-right">${formatCurrency(itemTotal)}</p>
                        <button data-product-id="${product.id}" class="remove-from-cart-btn text-red-400 hover:text-red-300 transition-colors">
                            <i data-lucide="trash-2" class="w-5 h-5"></i>
                        </button>
                    </div>
                `;
                cartItemsContainer.innerHTML += cartItemElement;
            });
        }
        updateCartInfo();
        lucide.createIcons();
    };
    
    /**
     * Atualiza o contador de itens e o valor total do carrinho.
     */
    const updateCartInfo = () => {
        const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalValue = state.cart.reduce((sum, item) => {
            const product = state.products.find(p => p.id === item.productId);
            return sum + (product.price * item.quantity);
        }, 0);

        cartCountBadge.textContent = totalItems;
        cartTotal.textContent = formatCurrency(totalValue);
        checkoutButton.disabled = totalItems === 0;
    };

    // --- LÓGICA DO CARRINHO ---

    const addToCart = (productId) => {
        const existingItem = state.cart.find(item => item.productId === productId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            state.cart.push({ productId, quantity: 1 });
        }
        const product = state.products.find(p => p.id === productId);
        showToast(`${product.name} foi adicionado ao carrinho.`);
        renderCart();
    };
    
    const removeFromCart = (productId) => {
        state.cart = state.cart.filter(item => item.productId !== productId);
        const product = state.products.find(p => p.id === productId);
        showToast(`${product.name} foi removido do carrinho.`, 'error');
        renderCart();
    };

    const updateQuantity = (productId, change) => {
        const cartItem = state.cart.find(item => item.productId === productId);
        if (cartItem) {
            cartItem.quantity += change;
            if (cartItem.quantity <= 0) {
                removeFromCart(productId);
            } else {
                renderCart();
            }
        }
    };
    
    const clearCart = () => {
        if (confirm('Tem certeza que deseja esvaziar o carrinho?')) {
            state.cart = [];
            showToast('Carrinho esvaziado com sucesso.', 'info');
            renderCart();
        }
    };

    // --- LÓGICA DO MODAL ---
    const openModal = () => cartModal.classList.remove('hidden');
    const closeModal = () => cartModal.classList.add('hidden');

    // --- LÓGICA DA BUSCA ---
    const handleSearch = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredProducts = state.products.filter(product => 
            product.name.toLowerCase().includes(searchTerm)
        );
        renderProducts(filteredProducts);
    };
    
    // --- TOAST NOTIFICATIONS ---
    const showToast = (message, type = 'success') => {
        const toastContainer = document.getElementById('toastContainer');
        const toastId = `toast-${Date.now()}`;
        
        const colors = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            info: 'bg-blue-500',
        };
        
        const icons = {
            success: 'check-circle',
            error: 'x-circle',
            info: 'info',
        };

        const toast = document.createElement('div');
        toast.id = toastId;
        toast.className = `toast-enter toast-enter-active flex items-center gap-3 ${colors[type]} text-white py-3 px-5 rounded-lg shadow-lg`;
        toast.innerHTML = `
            <i data-lucide="${icons[type]}" class="w-6 h-6"></i>
            <span>${message}</span>
        `;
        
        toastContainer.appendChild(toast);
        lucide.createIcons();

        setTimeout(() => {
            toast.classList.remove('toast-enter', 'toast-enter-active');
            toast.classList.add('toast-exit', 'toast-exit-active');
            toast.addEventListener('transitionend', () => toast.remove());
        }, 3000);
    };

    // --- EVENT LISTENERS ---
    cartButton.addEventListener('click', openModal);
    closeModalButton.addEventListener('click', closeModal);
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            closeModal();
        }
    });
    
    searchInput.addEventListener('input', handleSearch);
    clearCartButton.addEventListener('click', clearCart);

    document.body.addEventListener('click', (e) => {
        // Adicionar ao carrinho
        const addToCartBtn = e.target.closest('.add-to-cart-btn');
        if (addToCartBtn) {
            const productId = parseInt(addToCartBtn.dataset.productId);
            addToCart(productId);
        }
        
        // Remover do carrinho
        const removeFromCartBtn = e.target.closest('.remove-from-cart-btn');
        if (removeFromCartBtn) {
            const productId = parseInt(removeFromCartBtn.dataset.productId);
            removeFromCart(productId);
        }
        
        // Aumentar quantidade
        const increaseBtn = e.target.closest('.increase-quantity-btn');
        if (increaseBtn) {
            const productId = parseInt(increaseBtn.dataset.productId);
            updateQuantity(productId, 1);
        }

        // Diminuir quantidade
        const decreaseBtn = e.target.closest('.decrease-quantity-btn');
        if (decreaseBtn) {
            const productId = parseInt(decreaseBtn.dataset.productId);
            updateQuantity(productId, -1);
        }
    });

    // --- INICIALIZAÇÃO ---
    renderProducts(state.products);
    renderCart();
});
