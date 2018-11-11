import { expect } from 'chai';

import { BaseModel, BaseModelList } from './_base';

describe('Model: BaseModel', () => {

	describe('BaseModel class', () => {

		it('provides the correct data', async () => {
			const model0 = BaseModel.from();
			expect(model0).to.be.instanceOf(BaseModel);

			const model = BaseModel.from({});
			expect(model).to.be.instanceOf(BaseModel);
		});

		it('works with the constructor', async () => {
			const model = new BaseModel();
			JSON.stringify(model);
		});

	});

	describe('BaseModelList class', () => {

		it('provides the correct data', async () => {
			const models0 = BaseModelList.from();
			expect(models0).to.be.instanceOf(BaseModelList);

			const models = BaseModelList.from([]);
			expect(models).to.be.instanceOf(BaseModelList);
			expect(models).to.have.property('length', 0);

			for (const model of models) {
				expect(model).to.be.instanceOf(BaseModel);
			}
		});

		it('works with the constructor', async () => {
			const models = new BaseModelList();
			JSON.stringify(models);
		});

	});

});
