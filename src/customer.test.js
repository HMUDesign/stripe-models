import { expect } from 'chai';

import CustomerUtils, { Customer } from './customer';

function createCustomerData() {
	return {
		name: 'Dummy',
		email: `dummy+${Math.random()}@example.com`,
		phone: '000-000-0000',
		address: {
			line1: '000 Something St.',
			line2: 'Suite 000',
			city: 'Somewhere',
			state: 'US',
			postal_code: '00000',
		},
		authentication: 'authentication',
	};
}

describe('Model: Customer', () => {

	describe('Customer class', () => {

		it('provides the correct data', async () => {
			const customer = Customer.from({
				id: 'id',
				email: 'email',
				shipping: {
					name: 'name',
					phone: 'phone',
					address: 'address',
				},
				metadata: {
					meta: 'data',
					authentication: 'authentication',
				},
			});

			expect(customer).to.be.instanceOf(Customer);
			expect(customer).to.deep.equal({
				id: 'id',
				email: 'email',
				shipping: {
					name: 'name',
					phone: 'phone',
					address: 'address',
				},
				metadata: {
					meta: 'data',
					authentication: 'authentication',
				},
			});

			JSON.stringify(customer);
		});

	});

	describe('CustomerUtils.create() method', () => {

		it('returns the correct type', async () => {
			const order = await CustomerUtils.create(createCustomerData());
			expect(order).to.be.instanceOf(Customer);
		});

		it('handles errors', async () => {
			try {
				await CustomerUtils.create({});
				throw new Error('did not error');
			}
			catch (error) {
				expect(error).to.have.property('name', 'BadRequestError');
				expect(error).to.have.property('message').that.has.string('Could not create customer.');
			}
		});

	});

	describe('CustomerUtils.exists() method', () => {

		it('works when found', async () => {
			const exists = await CustomerUtils.exists({
				email: process.env.STRIPE_CUSTOMER_EMAIL,
			});
			expect(exists).to.equal(true);
		});

		it('works when not found', async () => {
			const exists = await CustomerUtils.exists({
				email: Math.random() + process.env.STRIPE_CUSTOMER_EMAIL,
			});
			expect(exists).to.equal(false);
		});

	});

	describe('CustomerUtils.findOne() method', () => {

		it('returns the correct type by id', async () => {
			const customer = await CustomerUtils.findOne({ id: process.env.STRIPE_CUSTOMER });

			expect(customer).to.be.instanceOf(Customer);
			expect(customer).to.have.property('id', process.env.STRIPE_CUSTOMER);
			expect(customer).to.have.property('email', process.env.STRIPE_CUSTOMER_EMAIL);
		});

		it('handles errors by id', async () => {
			try {
				await CustomerUtils.findOne({ id: 'dummy' });
				throw new Error('did not error');
			}
			catch (error) {
				expect(error).to.have.property('name', 'NotFoundError');
				expect(error).to.have.property('message').that.has.string('Customer dummy not found.');
			}
		});

		it('returns the correct type by email', async () => {
			const customer = await CustomerUtils.findOne({ email: process.env.STRIPE_CUSTOMER_EMAIL });

			expect(customer).to.be.instanceOf(Customer);
			expect(customer).to.have.property('id', process.env.STRIPE_CUSTOMER);
			expect(customer).to.have.property('email', process.env.STRIPE_CUSTOMER_EMAIL);
		});

		it('handles errors by email', async () => {
			try {
				await CustomerUtils.findOne({ email: 'dummy@example.com' });
				throw new Error('did not error');
			}
			catch (error) {
				expect(error).to.have.property('name', 'NotFoundError');
				expect(error).to.have.property('message').that.has.string('Customer not found.');
			}
		});

		it('handles errors', async () => {
			try {
				await CustomerUtils.findOne({});
				throw new Error('did not error');
			}
			catch (error) {
				expect(error).to.have.property('name', 'NotFoundError');
				expect(error).to.have.property('message').that.has.string('Customer not found.');
			}
		});

	});

});
