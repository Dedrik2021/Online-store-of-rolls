let counter;
const deliveryCost = document.querySelector('.delivery-cost');
const cartDelivery = document.querySelector('[data-cart-delivery]');
const dataOrders = document.querySelector('[data-orders]');
const cartWrapper = document.querySelector('.cart-wrapper');
const cartEmpty = document.querySelector('[data-cart-empty]');
const orderForm = document.querySelector('#order-form');

(async function getProducts() {
    const response = await fetch('./js/products.json');
    const productsArray = await response.json();
	renderProducts(productsArray);
})()

function renderProducts(productsArray) {
    productsArray.forEach((item) => {
		
        const markup = `<div class="col-md-6">
							<div class="card mb-4" data-id="${item.id}">
								<img class="product-img" src="img/roll/${item.imgSrc}" alt="">
								<div class="card-body text-center">
									<h4 class="item-title">${item.title}</h4>
									<p><small data-items-in-box class="text-muted">${item.inBox} ks. / ${item.weight} gr.</small></p>
									<div class="details-wrapper">
										<div class="items counter-wrapper">
											<div class="items__control" data-action="minus">-</div>
											<div class="items__current" data-counter>1</div>
											<div class="items__control" data-action="plus">+</div>
										</div>
										<div class="price">
											<div class="price__weight"></div>
											<div class="price__currency">${item.price} Kč</div>
										</div>
									</div>
									<button data-cart type="button" class="btn btn-block btn-outline-warning">
										+ add to cart
									</button>
								</div>
							</div>
						</div>`;

		document.querySelector('#products-container').insertAdjacentHTML('beforeend', markup);
    });
}

window.addEventListener('click', function (e) {
	if (e.target.dataset.action === 'plus' || e.target.dataset.action === 'minus') {
		const counterWrapper = e.target.closest('.counter-wrapper');
		counter = counterWrapper.querySelector('[data-counter]');
	}

	if (e.target.dataset.action === 'plus') {
		counter.innerText = ++counter.innerText;
	} else if (e.target.dataset.action === 'minus') {
		if (parseInt(counter.innerText) > 1) {
			counter.innerText = --counter.innerText;
		} else if (parseInt(counter.innerText) === 1) {
			e.target.closest('.cart-item').remove();
			toggleCartStatus();
			calcCartPriceAndDelivery();
		}
	}

	if (e.target.hasAttribute('data-action') && e.target.closest('.cart-wrapper')) {
		calcCartPriceAndDelivery();
	}

	if (e.target.hasAttribute('data-cart')) {
		const cardId = e.target.closest('[data-id]');

		const productInfo = {
			id: cardId.dataset.id,
			imgSrc: cardId.querySelector('img').getAttribute('src'),
			imgAlt: cardId.querySelector('img').getAttribute('alt'),
			title: cardId.querySelector('.item-title').innerText,
			inBox: cardId.querySelector('[data-items-in-box]').innerText,
			counter: cardId.querySelector('[data-counter]').innerText,
			weight: cardId.querySelector('.price__weight').innerText,
			price: cardId.querySelector('.price__currency').innerText,
		};

		const itemInCart = cartWrapper.querySelector(`[data-id = '${productInfo.id}']`);
		if (itemInCart) {
			const counterEl = itemInCart.querySelector('[data-counter]');
			counterEl.innerText = parseInt(counterEl.innerText) + parseInt(productInfo.counter);
		} else {
			const newItem = `<div class="cart-item" data-id="${productInfo.id}">
                                <div class="cart-item__top">
                                    <div class="cart-item__img">
                                        <img src="${productInfo.imgSrc}" alt="${productInfo.imgAlt}">
                                    </div>
                                    <div class="cart-item__desc">
                                        <div class="cart-item__title">${productInfo.title}</div>
                                        <div class="cart-item__weight">${productInfo.inBox} ${productInfo.weight}</div>
                                        <div class="cart-item__details">
                                            <div class="items items--small counter-wrapper">
                                                <div class="items__control" data-action="minus">-</div>
                                                <div class="items__current" data-counter="">${productInfo.counter}</div>
                                                <div class="items__control" data-action="plus">+</div>
                                            </div>
                                            <div class="price">
                                                <div class="price__currency">${productInfo.price}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>`;

			cartWrapper.insertAdjacentHTML('afterbegin', newItem);
		}
		cardId.querySelector('[data-counter]').innerText = 1;

		toggleCartStatus();
		calcCartPriceAndDelivery();
	}
});

function calcCartPriceAndDelivery() {
	let totalPrice = 0;

	cartWrapper.querySelectorAll('.cart-item').forEach((el) => {
		const price = el.querySelector('.price__currency');
		const counterItem = el.querySelector('[data-counter]');
		const sum = parseInt(price.innerText) * parseInt(counterItem.innerText);
		totalPrice += sum;
	});
	const priceTotal = (document.querySelector('.total-price').innerText = totalPrice);

	if (priceTotal >= 400) {
		dataOrders.classList.add('none');
		deliveryCost.innerText = 'Free';
	} else if (priceTotal > 0) {
		deliveryCost.innerText = '100 Kč';
		cartDelivery.classList.remove('none');
		dataOrders.classList.remove('none');
	} else {
		cartDelivery.classList.add('none');
	}
}

function toggleCartStatus() {
	if (cartWrapper.children.length > 0) {
		cartEmpty.style.display = 'none';
		orderForm.style.display = 'block';
	} else {
		cartEmpty.style.display = 'block';
		orderForm.style.display = 'none';
	}
}
