import { BadRequest as BadRequestError, NotFound as NotFoundError } from 'http-errors';
import ModelUtils, { BaseModel, BaseModelList } from './_base';
import CustomerUtils from './customer';
import stripe from './index';

export class Order extends BaseModel {
	static resource = 'orders';

	_updateData({
		id,
		created,
		amount,
		items,
		status,
		selected_shipping_method,
		shipping_methods,
		metadata,
		customer,
	}) {
		this.id = id;
		this.created = new Date(created * 1000);
		this.amount = amount;
		this.items = items;
		this.status = status;
		this.selected_shipping_method = selected_shipping_method;
		this.shipping_methods = shipping_methods;
		this.metadata = metadata;
		this.customer_id = customer;

		return this;
	}

	toJSON() {
		return {
			id: this.id,
			created: this.created,
			amount: this.amount,
			items: this.items,
			status: this.status,
			selected_shipping_method: this.selected_shipping_method,
			shipping_methods: this.shipping_methods,
		};
	}

	get customer() {
		return CustomerUtils.findOne({ id: this.customer_id });
	}

	async setStatus(status) {
		const data = await stripe.orders.update(this.id, {
			status,
		});

		return this._updateData(data);
	}

	async setShippingMethod(selected_shipping_method) {
		const data = await stripe.orders.update(this.id, {
			selected_shipping_method,
		});

		return this._updateData(data);
	}
}

export class OrderList extends BaseModelList {
	static Item = Order;
}

export default {
	async create({
		items,
		customer,
		customer_id,
	}) {
		if (!customer_id && customer) {
			customer_id = customer.id;
		}

		let result;
		try {
			result = await stripe.orders.create({
				currency: 'usd',
				items: items && items.map(item => item),
				customer: customer_id,
			});
		}
		catch (raw) {
			const error = new BadRequestError('Could not create order.');
			error.raw = raw;
			throw error;
		}

		return Order.from(result);
	},

	async findOne({ id, customer, customer_id }) {
		if (!customer_id && customer) {
			customer_id = customer.id;
		}

		const order = await ModelUtils.findOne(Order, id);

		if (customer_id && order.customer_id !== customer_id) {
			throw new NotFoundError(`Order ${id} not found.`);
		}

		return order;
	},

	async findAll(params) {
		return ModelUtils.findAll(OrderList, params);
	},
};
