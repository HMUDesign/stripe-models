import { expect } from 'chai';

import OrderUtils, { Order, OrderList } from './order';
import { Customer } from './customer';

function createOrderData() {
	return {
		customer: {
			id: process.env.STRIPE_CUSTOMER,
		},
		items: [
			{
				type: 'sku',
				parent: process.env.STRIPE_SKU,
			},
		],
	};
}

async function cleanOrder(order) {
	if (order.status !== 'canceled') {
		await order.setStatus('canceled');
	}
}

describe('Model: Order', () => {

	describe('Order class', () => {

		it('provides the correct data', async () => {
			const order = Order.from({
				id: 'id',
				created: 0,
				amount: 100,
				items: [],
				status: 'status',
				selected_shipping_method: 'selected_shipping_method',
				shipping_methods: [],
				metadata: { meta: 'data' },
				customer: 'customer_id',
			});

			expect(order).to.be.instanceOf(Order);
			expect(order).to.deep.equal({
				id: 'id',
				created: new Date(0),
				amount: 100,
				items: [],
				status: 'status',
				selected_shipping_method: 'selected_shipping_method',
				shipping_methods: [],
				metadata: { meta: 'data' },
				customer_id: 'customer_id',
			});

			JSON.stringify(order);
		});

		describe('customer getter', () => {

			it('works', async () => {
				const order = Order.from({ customer: process.env.STRIPE_CUSTOMER });
				const customer = await order.customer;

				expect(customer).to.be.instanceOf(Customer);
				expect(customer).to.have.property('id', process.env.STRIPE_CUSTOMER);
			});

		});

		describe('setStatus method', () => {

			it('works', async () => {
				const order = await OrderUtils.create(createOrderData());

				await order.setStatus('canceled');
				expect(order).to.have.property('status', 'canceled');

				await cleanOrder(order);
			});

		});

		describe('setShippingMethod method', () => {

			it('works', async () => {
				const order = await OrderUtils.create(createOrderData());

				const selected_shipping_method = order.shipping_methods.slice(-1)[0];
				await order.setShippingMethod(selected_shipping_method.id);
				expect(order).to.have.property('selected_shipping_method', selected_shipping_method.id);

				await cleanOrder(order);
			});

		});

	});

	describe('OrderList class', () => {

		it('provides the correct data', async () => {
			const orders = OrderList.from([
				{ id: 'id' },
			]);

			expect(orders).to.be.instanceOf(OrderList);
			expect(orders).to.have.property('length', 1);

			for (const order of orders) {
				expect(order).to.be.instanceOf(Order);
				expect(order).to.have.property('id', 'id');
			}
		});

	});

	describe('OrderUtils.create() method', () => {

		it('returns the correct type', async () => {
			const order = await OrderUtils.create(createOrderData());
			expect(order).to.be.instanceOf(Order);

			await cleanOrder(order);
		});

		it('handles errors', async () => {
			try {
				await OrderUtils.create({});
				throw new Error('did not error');
			}
			catch (error) {
				expect(error).to.have.property('name', 'BadRequestError');
				expect(error).to.have.property('message').that.has.string('Could not create order.');
			}
		});

	});

	describe('OrderUtils.findOne() method', () => {

		it('returns the correct type', async () => {
			const order = await OrderUtils.findOne({
				id: process.env.STRIPE_ORDER,
				customer: {
					id: process.env.STRIPE_CUSTOMER,
				},
			});
			expect(order).to.be.instanceOf(Order);
		});

		it('handles customer missmatch errors', async () => {
			try {
				await OrderUtils.findOne({
					id: process.env.STRIPE_ORDER,
					customer: {
						id: process.env.STRIPE_CUSTOMER + Math.random(),
					},
				});
				throw new Error('did not error');
			}
			catch (error) {
				expect(error).to.have.property('name', 'NotFoundError');
				expect(error).to.have.property('message').that.has.string(`Order ${process.env.STRIPE_ORDER} not found.`);
			}
		});

		it('handles general errors', async () => {
			try {
				await OrderUtils.findOne({});
				throw new Error('did not error');
			}
			catch (error) {
				expect(error).to.have.property('name', 'NotFoundError');
				expect(error).to.have.property('message').that.has.string('Order undefined not found.');
			}
		});

	});

	describe('OrderUtils.findAll() method', () => {

		it('returns the correct type', async () => {
			const orders = await OrderUtils.findAll();
			expect(orders).to.be.instanceOf(OrderList);
		});

		it('handles errors', async () => {
			try {
				await OrderUtils.findAll({ dummy: 'dummy' });
				throw new Error('did not error');
			}
			catch (error) {
				expect(error).to.have.property('name', 'NotFoundError');
				expect(error).to.have.property('message').that.has.string('Orders not found.');
			}
		});

	});

});
