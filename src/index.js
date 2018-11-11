import { Stripe } from 'stripe';

// import CustomerUtils, { Customer } from './customer';
// import OrderUtils, { Order, OrderList } from './order';
// import ProductUtils, { Product, ProductList } from './product';
// import SKUUtils, { SKU, SKUList } from './sku';

export function initStripe({ publicKey, secretKey }) {
	const api = new Stripe(secretKey);
	api.publicKey = publicKey;

	return api;
}

export default initStripe({
	publicKey: process.env.STRIPE_PUBLIC_KEY,
	secretKey: process.env.STRIPE_SECRET_KEY,
});
