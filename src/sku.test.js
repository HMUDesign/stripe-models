import { expect } from 'chai';

import SKUUtils, { SKU, SKUList } from './sku';
import { Product } from './product';

describe('Model: SKU', () => {

	describe('SKU class', () => {

		it('provides the correct data', async () => {
			const sku = SKU.from({
				id: 'id',
				attributes: {
					type: 'type',
				},
				inventory: {
					quantity: null,
					type: 'infinite',
					value: null,
				},
				price: 100,
				metadata: { meta: 'data' },
				product: 'product_id',
			});

			expect(sku).to.be.instanceOf(SKU);
			expect(sku).to.deep.equal({
				id: 'id',
				attributes: {
					type: 'type',
				},
				inventory: {
					quantity: null,
					type: 'infinite',
					value: null,
				},
				price: 100,
				metadata: { meta: 'data' },
				product_id: 'product_id',
			});

			JSON.stringify(sku);
		});

		describe('product getter', () => {

			it('works', async () => {
				const sku = SKU.from({ product: process.env.STRIPE_PRODUCT });
				const product = await sku.product;

				expect(product).to.be.instanceOf(Product);
				expect(product).to.have.property('id', process.env.STRIPE_PRODUCT);
			});

		});

	});

	describe('SKUList class', () => {

		it('provides the correct data', async () => {
			const skus = SKUList.from([
				{ id: 'id' },
			]);

			expect(skus).to.be.instanceOf(SKUList);
			expect(skus).to.have.property('length', 1);

			for (const sku of skus) {
				expect(sku).to.be.instanceOf(SKU);
				expect(sku).to.have.property('id', 'id');
			}
		});

	});

	describe('SKUUtils.findOne() method', () => {

		it('returns the correct type', async () => {
			const sku = await SKUUtils.findOne({ id: process.env.STRIPE_SKU });
			expect(sku).to.be.instanceOf(SKU);
		});

		it('handles errors', async () => {
			try {
				await SKUUtils.findOne({});
				throw new Error('did not error');
			}
			catch (error) {
				expect(error).to.have.property('name', 'NotFoundError');
				expect(error).to.have.property('message').that.has.string('SKU undefined not found.');
			}
		});

	});

	describe('SKUUtils.findAll() method', () => {

		it('returns the correct type', async () => {
			const skus = await SKUUtils.findAll();
			expect(skus).to.be.instanceOf(SKUList);
		});

		it('handles errors', async () => {
			try {
				await SKUUtils.findAll({ dummy: 'dummy' });
				throw new Error('did not error');
			}
			catch (error) {
				expect(error).to.have.property('name', 'NotFoundError');
				expect(error).to.have.property('message').that.has.string('SKUs not found.');
			}
		});

	});

});
