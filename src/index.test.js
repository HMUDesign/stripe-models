import { expect } from 'chai';

import stripe, { initStripe } from './index';

describe('index', async () => {

	it('works', () => {
		const api = initStripe({
			publicKey: process.env.STRIPE_PUBLIC_KEY,
			secretKey: process.env.STRIPE_SECRET_KEY,
		});

		expect(api).to.have.property('_api');
		expect(api).to.have.property('publicKey');

		expect(stripe).to.have.property('_api');
		expect(stripe).to.have.property('publicKey');
	});

});
