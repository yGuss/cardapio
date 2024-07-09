const menu = document.getElementById('menu');
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const cartCounter = document.getElementById('cart-count');
const addressInput = document.getElementById('address');
const addressWarn = document.getElementById('address-warn');
const paymentPix = document.getElementById('payment-warn');

let cart = []

cartBtn.addEventListener('click', function () {
    updateCartModal();
    cartModal.style.display = 'flex'
})

closeModalBtn.addEventListener('click', function () {
    cartModal.style.display = 'none'
})

cartModal.addEventListener('click', function (event) {
    if (event.target === cartModal) {
        cartModal.style.display = 'none'
    }
})


menu.addEventListener('click', function (event) {
    let addItemButton = event.target.closest('.add-to-cart-btn');
    let removeItemButton = event.target.closest('.remove-cart-btn');
    if (addItemButton) {
        const name = addItemButton.getAttribute('data-name');
        const price = parseFloat(addItemButton.getAttribute('data-price'));

        addToCart(name, price, 1);
    }
    if (removeItemButton) {
        const name = removeItemButton.getAttribute('data-name');
        removeItemCart(name, 1)
    }

});

function addToCart(name, price, quantity) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;

    } else {
        cart.push({
            name,
            price,
            quantity: quantity,
        });
    }
    updateQuantityBadge(name);
    Toastify({
        text: 'Item adicionado ao carrinho',
        duration: 2000,
        close: true,
        gravity: 'top',
        position: 'right',
        stopOnFocus: true,
        style: {
            background: '#16a34a',
        },
    }).showToast();


    updateCartModal();
}

function updateQuantityBadge(name) {
    const items = document.querySelectorAll('.item');
    items.forEach(item => {
        if (item.getAttribute('data-name') === name) {
            //Toggle da bagde de quantidade de itens
            const quantityBadge = item.querySelector('.quantity-badge');
            const quantitySpan = item.querySelector('.item-quantity');
            const itemInCart = cart.find(item => item.name === name);
            //Toggle dos botões -/+ dependendo da quantidade
            const addItemButton = item.querySelector('.add-to-cart-btn');
            const removeItemButton = item.querySelector('.remove-cart-btn');
            const spanItem = item.querySelector('.item-quantity');


            quantitySpan.textContent = itemInCart ? itemInCart.quantity : 0;
            quantityBadge.textContent = itemInCart ? itemInCart.quantity : 0;

            if (quantityBadge.textContent > 0) {
                quantityBadge.classList.remove('hidden')
                addItemButton.classList.remove('fa-cart-plus')
                addItemButton.classList.add('fa-plus')
                removeItemButton.classList.remove('hidden')
                spanItem.classList.remove('hidden')
            }
            else {
                quantityBadge.classList.add('hidden');
                addItemButton.classList.add('fa-cart-plus')
                addItemButton.classList.remove('fa-plus')
                removeItemButton.classList.add('hidden')
                spanItem.classList.add('hidden')
            }
        }
    });
}


function updateCartModal() {

    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement('div');
        cartItemElement.classList.add('flex', 'justify-between', 'mb-4', 'flex-col')
        cartItemElement.innerHTML = `
        <div class='flex items-center justify-between'>
            <div>
                <p class='font-semibold '>${item.name}</p>
                <p>Qtd: ${item.quantity}</p>
                <p class='font-medium '>R$ ${item.price.toFixed(2)}</p>
            </div>

            <div class="flex gap-2 items-center">
                <button class='remove-cart-btn px-3 cursor-pointer fa fa-minus text-lg text-gray-900' data-name='${item.name}'>
                </button>
                    <span class='item-quantity'>${item.quantity}</span>

               <button class='add-to-cart-btn px-3 cursor-pointer fa fa-plus text-lg text-gray-900' data-name='${item.name}'>
                </button>
        
            <button class='remove-item-cart-btn bg-red-500 text-white rounded px-3 py-2 mx-2 fa-solid fa-trash hover:scale-110 duration-200' data-name='${item.name}'>
            </button>
            
        </div>`


        total += item.price * item.quantity

        cartItemsContainer.appendChild(cartItemElement)

    })

    cartTotal.textContent = total.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });

    cartCounter.innerText = cart.length;

}

cartItemsContainer.addEventListener('click', function (event) {
    let addQuantityButton = event.target.closest('.add-to-cart-btn');
    let removeQuantityButton = event.target.closest('.remove-cart-btn');
    let removeItemButton = event.target.closest('.remove-item-cart-btn')

    if (removeQuantityButton) {
        const name = event.target.getAttribute('data-name')
        removeItemCart(name, 1);
    }
    if (addQuantityButton) {
        const name = addQuantityButton.getAttribute('data-name');
        const price = parseFloat(addQuantityButton.getAttribute('data-price'));
        addToCart(name, price);

    }
    if (removeItemButton) {
        const items = document.querySelectorAll('.item');
        items.forEach(item => {
            if (item.getAttribute('data-name')) {
                const name = event.target.getAttribute('data-name')
                const quantity = item.querySelector('.item-quantity');
                removeItemCart(name, quantity);
            }

        })

    }
    updateCartModal()
})



function removeItemCart(name, quantity) {
    const index = cart.findIndex(item => item.name === name)

    if (index !== -1) {
        const item = cart[index];
        if (item.quantity > 1) {
            item.quantity -= quantity;
            updateCartModal();
            updateQuantityBadge(name);
            Toastify({
                text: 'Item removido',
                duration: 2000,
                close: true,
                gravity: 'top',
                position: 'right',
                stopOnFocus: true,
                style: {
                    background: '#ef4444',
                    borderRadius: '4px'
                },
            }).showToast();
            return;
        }

        cart.splice(index, 1)

    }
    updateCartModal()
    updateQuantityBadge(name);
}

addressInput.addEventListener('input', function (event) {
    let inputValue = event.target.value;

    if (inputValue !== '') {
        addressInput.classList.remove('border-red-500')
        addressWarn.classList.add('hidden')
    }
})


checkoutBtn.addEventListener('click', function () {

    const isOpen = checkRestaurantOpen()
    if (!isOpen) {
        Toastify({
            text: 'Ops, a lanchonete está fechada!',
            duration: 2000,
            close: true,
            gravity: 'top',
            position: 'right',
            stopOnFocus: true,
            style: {
                background: '#ef4444',
                borderRadius: '4px'
            },
        }).showToast();
        return;
    }
    if (cart.length === 0) {

        Toastify({
            text: 'Ops, seu carrinho está vazio!',
            duration: 2000,
            close: true,
            gravity: 'top',
            position: 'right',
            stopOnFocus: true,
            style: {
                background: '#ef4444',
                borderRadius: '4px'
            },
        }).showToast();
        return;
    }
    if (addressInput.value === '') {
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    const cartItems = cart.map((item) => {

        return (
            `* ${item.name} - Quantidade: (${item.quantity}) R$${item.price.toFixed(2)}\n`
        )
    }).join("")

    const phone = '32998298960'
    const message = encodeURIComponent(`${cartItems}\n*Endereço de entrega:* ${addressInput.value}\n*Forma de pagamento:* ${paymentMethod}\n*Total:* ${cartTotal.innerText}`);

    window.open(`https://wa.me/${phone}?text=*Pedido*%0a${message}`)
    cart = [];
    updateCartModal();


})

let paymentMethod;
document.querySelectorAll('input[type="radio"]').forEach((radio) => {
    radio.addEventListener('click', function () {
        if (radio.checked) {
            paymentMethod = radio.value;
        }
        if (paymentMethod === 'Pix') {
            paymentPix.classList.remove('hidden')
        } else {
            paymentPix.classList.add('hidden')
        }
    })
});



function checkRestaurantOpen() {
    const data = new Date();

    const dia = data.getDay()

    const hora = data.getHours();

    return hora >= 19 && hora < 23 && ((dia === 5 || dia === 6 || dia === 0));
}



const spanItem = document.getElementById('date-span')
const spanOpenClose = document.getElementById('restaurant-open-close')
const isOpen = checkRestaurantOpen();

if (isOpen) {
    spanItem.classList.remove('bg-red-500')
    spanItem.classList.add('bg-green-600')

    spanOpenClose.classList.remove('hidden')
    spanOpenClose.classList.add('bg-green-600')
    spanOpenClose.innerText = 'Aberto'

} else {
    spanItem.classList.remove('bg-green-600')
    spanItem.classList.add('bg-red-500')

    spanOpenClose.classList.remove('hidden')
    spanOpenClose.classList.add('bg-red-500')
    spanOpenClose.innerText = 'Fechado'
}

