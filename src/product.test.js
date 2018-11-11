import { expect } from 'chai';

import ProductUtils, { Product, ProductList } from './product';
import { SKUList } from './sku';

describe('Model: Product', () => {

	describe('Product class', () => {

		it('provides the correct data', async () => {
			const product = Product.from({
				id: 'id',
				name: 'name',
				description: 'description',
				attributes: [ 'attribute' ],
				metadata: { meta: 'data' },
			});

			expect(product).to.be.instanceOf(Product);
			expect(product).to.deep.equal({
				id: 'id',
				name: 'name',
				description: 'description',
				attributes: [ 'attribute' ],
				metadata: { meta: 'data' },
			});

			JSON.stringify(product);
		});

		describe('skus getter', () => {

			it('works', async () => {
				const product = Product.from({ id: process.env.STRIPE_PRODUCT });
				const skus = await product.skus;

				expect(skus).to.be.instanceOf(SKUList);
			});

		});

	});

	describe('ProductList class', () => {

		it('provides the correct data', async () => {
			const products = ProductList.from([
				{ id: 'id' },
			]);

			expect(products).to.be.instanceOf(ProductList);
			expect(products).to.have.property('length', 1);

			for (const product of products) {
				expect(product).to.be.instanceOf(Product);
				expect(product).to.have.property('id', 'id');
			}
		});

	});

	describe('ProductUtils.findOne() method', () => {

		it('returns the correct type', async () => {
			const product = await ProductUtils.findOne({ id: process.env.STRIPE_PRODUCT });
			expect(product).to.be.instanceOf(Product);
		});

		it('handles errors', async () => {
			try {
				await ProductUtils.findOne({});
				throw new Error('did not error');
			}
			catch (error) {
				expect(error).to.have.property('name', 'NotFoundError');
				expect(error).to.have.property('message').that.has.string('Product undefined not found.');
			}
		});

	});

	describe('ProductUtils.findAll() method', () => {

		it('returns the correct type', async () => {
			const products = await ProductUtils.findAll();
			expect(products).to.be.instanceOf(ProductList);
		});

		it('handles errors', async () => {
			try {
				await ProductUtils.findAll({ dummy: 'dummy' });
				throw new Error('did not error');
			}
			catch (error) {
				expect(error).to.have.property('name', 'NotFoundError');
				expect(error).to.have.property('message').that.has.string('Products not found.');
			}
		});

	});

});
