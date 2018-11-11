import { NotFound as NotFoundError, BadRequest as BadRequestError } from 'http-errors';
import ModelUtils, { BaseModel } from './_base';
import stripe from './index';

export class Customer extends BaseModel {
	static resource = 'customers';

	_updateData({
		id,
		email,
		shipping,
		metadata,
	}) {
		this.id = id;
		this.email = email;
		this.shipping = shipping;
		this.metadata = metadata;

		return this;
	}

	toJSON() {
		return {
			email: this.email,
		};
	}
}

export default {
	async create({
		name,
		email,
		phone,
		address,
	}) {
		let result;
		try {
			result = await stripe.customers.create({
				email,
				shipping: {
					name,
					phone,
					address: {
						line1: address.line1,
						line2: address.line2,
						city: address.city,
						state: address.state,
						postal_code: address.postal_code,
						country: 'USA',
					},
				},
			});
		}
		catch (raw) {
			const error = new BadRequestError('Could not create customer.');
			error.raw = raw;
			throw error;
		}

		return Customer.from(result);
	},

	async exists({ email }) {
		try {
			await ModelUtils.findOneByList(Customer, { email });
		}
		catch (e) {
			return false;
		}

		return true;
	},

	async findOne({ id, email }) {
		if (id) {
			return ModelUtils.findOne(Customer, id);
		}

		if (email) {
			return ModelUtils.findOneByList(Customer, { email });
		}

		throw new NotFoundError('Customer not found.');
	},
};
